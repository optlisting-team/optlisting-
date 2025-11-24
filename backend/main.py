from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, Dict
from datetime import date
import json
from pydantic import BaseModel

from backend.models import init_db, get_db, Listing, DeletionLog, Base, engine
from backend.services import detect_source, extract_supplier_info, analyze_zombie_listings, generate_export_csv
from backend.dummy_data import generate_dummy_listings

app = FastAPI(title="OptListing API", version="1.0.0")

# CORS middleware for React frontend
# Allow both local development and production frontend URLs
import os
import re

cors_origins = [
    # Local development environments
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    
    # Production Vercel deployment - All variations
    "https://optlisting.vercel.app",
    "https://optlisting.vercel.app/",
    "https://www.optlisting.vercel.app",
    "https://www.optlisting.vercel.app/",
    
    # Environment variable for additional frontend URLs
    os.getenv("FRONTEND_URL", ""),
]

# Filter out empty strings and add Vercel regex pattern
cors_origins = [origin for origin in cors_origins if origin]

# CORS configuration for Railway + Vercel deployment
# Important: allow_origins=["*"] requires allow_credentials=False
# This allows all origins including Vercel preview deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Railway + Vercel compatibility)
    allow_origin_regex=r"https://.*\.vercel\.app",  # Explicitly allow all Vercel subdomains
    allow_credentials=False,  # Must be False when using allow_origins=["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    try:
        # Create tables if they don't exist (works for both SQLite and Supabase)
        print("Creating database tables if they don't exist...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created/verified successfully")
        
        # Generate dummy data on first startup
        db = next(get_db())
        try:
            count = db.query(Listing).count()
            if count == 0:
                print("Generating 5000 dummy listings... This may take a moment.")
                generate_dummy_listings(db, count=5000, user_id="default-user")
                print("Dummy data generated successfully")
            else:
                print(f"Database already contains {count} listings")
        except Exception as e:
            print(f"Error generating dummy data: {e}")
            import traceback
            traceback.print_exc()
        finally:
            db.close()
    except Exception as e:
        print(f"Startup error: {e}")
        import traceback
        traceback.print_exc()


@app.get("/")
def root():
    return {"message": "OptListing API is running"}


@app.get("/api/listings")
def get_listings(
    skip: int = 0,
    limit: int = 100,
    store_id: Optional[str] = None,  # Store ID filter - 'all' or None means all stores
    user_id: str = "default-user",  # Default user ID for MVP phase
    db: Session = Depends(get_db)
):
    """Get all listings for a specific user"""
    query = db.query(Listing).filter(Listing.user_id == user_id)
    
    # Apply store filter if store_id is provided and not 'all'
    if store_id and store_id != 'all':
        if hasattr(Listing, 'store_id'):
            query = query.filter(Listing.store_id == store_id)
    # If store_id is 'all' or None, DO NOT filter by store (return all for user)
    
    listings = query.offset(skip).limit(limit).all()
    
    # Get total count with store filter applied
    total_query = db.query(Listing).filter(Listing.user_id == user_id)
    if store_id and store_id != 'all':
        if hasattr(Listing, 'store_id'):
            total_query = total_query.filter(Listing.store_id == store_id)
    total_count = total_query.count()
    
    return {
        "total": total_count,
        "listings": [
            {
                "id": l.id,
                "item_id": l.item_id,
                "ebay_item_id": l.item_id,  # Backward compatibility
                "title": l.title,
                "sku": l.sku,
                "image_url": l.image_url,
                "brand": getattr(l, 'brand', None),
                "upc": getattr(l, 'upc', None),
                "platform": l.platform,
                "marketplace": l.platform,  # Backward compatibility
                "supplier_name": getattr(l, 'supplier_name', None) or (l.metrics.get('supplier_name') if l.metrics and isinstance(l.metrics, dict) else None) or "Unknown",
                "supplier": getattr(l, 'supplier_name', None) or (l.metrics.get('supplier_name') if l.metrics and isinstance(l.metrics, dict) else None) or "Unknown",  # Backward compatibility
                "supplier_id": getattr(l, 'supplier_id', None) or (l.metrics.get('supplier_id') if l.metrics and isinstance(l.metrics, dict) else None),
                "price": (l.metrics.get('price') if l.metrics and isinstance(l.metrics, dict) and 'price' in l.metrics else None) or getattr(l, 'price', None),
                "date_listed": (
                    l.date_listed.isoformat() if l.date_listed else (
                        l.metrics.get('date_listed') if l.metrics and isinstance(l.metrics, dict) and 'date_listed' in l.metrics else None
                    )
                ),
                "sold_qty": (l.metrics.get('sales') if l.metrics and isinstance(l.metrics, dict) and 'sales' in l.metrics else None) or getattr(l, 'sold_qty', 0) or 0,
                "watch_count": (l.metrics.get('views') if l.metrics and isinstance(l.metrics, dict) and 'views' in l.metrics else None) or getattr(l, 'watch_count', 0) or 0
            }
            for l in listings
        ]
    }


@app.post("/api/listings/detect-source")
def detect_listing_source(
    image_url: str = "",
    sku: str = "",
    title: str = "",
    brand: str = "",
    upc: str = "",
    db: Session = Depends(get_db)
):
    """Detect source for a listing with forensic analysis"""
    source, confidence = detect_source(
        image_url=image_url,
        sku=sku,
        title=title,
        brand=brand,
        upc=upc
    )
    return {
        "source": source,
        "confidence_level": confidence
    }


@app.get("/api/analyze")
def analyze_zombies(
    min_days: int = 3,
    max_sales: int = 0,
    max_watch_count: int = 10,
    supplier_filter: str = "All",
    marketplace: str = "eBay",  # MVP Scope: Default to eBay (only eBay and Shopify supported)
    store_id: Optional[str] = None,  # Store ID filter - 'all' or None means all stores
    user_id: str = "default-user",  # Default user ID for backward compatibility
    db: Session = Depends(get_db)
):
    """
    Zombie Filter API
    Filters listings based on dynamic criteria:
    - marketplace: Filter by marketplace - MVP Scope: "eBay" or "Shopify" only (default: "eBay")
    - min_days: Minimum days old (default: 3)
    - max_sales: Maximum sales count (default: 0)
    - max_watch_count: Maximum watch count/views (default: 10)
    - supplier_filter: Filter by supplier - "All", "Amazon", "Walmart", etc. (default: "All")
    
    Returns:
    - total_count: Total number of ALL listings in the database
    - total_breakdown: Breakdown by source for ALL listings
    - zombie_count: Number of filtered zombie listings
    - zombies: List of zombie listings
    """
    # Validate marketplace - MVP Scope: Only eBay and Shopify
    valid_marketplaces = [
        "eBay",
        "Shopify"
    ]
    if marketplace not in valid_marketplaces:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid marketplace. Must be one of: {', '.join(valid_marketplaces)}"
        )
    
    # Validate supplier_filter
    valid_suppliers = ["All", "Amazon", "Walmart", "Wholesale2B", "Doba", "DSers", "Spocket", "CJ Dropshipping", "Unverified"]
    if supplier_filter not in valid_suppliers:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid supplier_filter. Must be one of: {', '.join(valid_suppliers)}"
        )
    
    # Ensure min_days, max_sales, and max_watch_count are non-negative
    min_days = max(0, min_days)
    max_sales = max(0, max_sales)
    max_watch_count = max(0, max_watch_count)
    
    # Build base query with user_id filter
    base_query = db.query(Listing).filter(Listing.user_id == user_id)
    
    # Apply store filter if store_id is provided and not 'all'
    if store_id and store_id != 'all':
        if hasattr(Listing, 'store_id'):
            base_query = base_query.filter(Listing.store_id == store_id)
    # If store_id is 'all' or None, DO NOT filter by store (return all for user)
    
    # Get total count using SQL COUNT
    total_count = base_query.count()
    
    # Calculate breakdown by supplier using SQL GROUP BY
    supplier_query = db.query(
        Listing.supplier_name,
        func.count(Listing.id).label('count')
    ).filter(
        Listing.user_id == user_id
    )
    
    # Apply store filter to supplier breakdown
    if store_id and store_id != 'all':
        if hasattr(Listing, 'store_id'):
            supplier_query = supplier_query.filter(Listing.store_id == store_id)
    
    supplier_results = supplier_query.group_by(Listing.supplier_name).all()
    
    total_breakdown = {"Amazon": 0, "Walmart": 0, "AliExpress": 0, "CJ Dropshipping": 0, "Home Depot": 0, "Wayfair": 0, "Costco": 0, "Wholesale2B": 0, "Spocket": 0, "SaleHoo": 0, "Inventory Source": 0, "Dropified": 0, "Unverified": 0, "Unknown": 0}
    for supplier_name, count in supplier_results:
        if supplier_name in total_breakdown:
            total_breakdown[supplier_name] = count
        else:
            total_breakdown["Unknown"] = total_breakdown.get("Unknown", 0) + count
    
    # Calculate breakdown by platform using SQL GROUP BY (dynamic - includes all marketplaces)
    platform_query = db.query(
        Listing.platform,
        func.count(Listing.id).label('count')
    ).filter(
        Listing.user_id == user_id
    )
    
    # Apply store filter to platform breakdown
    if store_id and store_id != 'all':
        if hasattr(Listing, 'store_id'):
            platform_query = platform_query.filter(Listing.store_id == store_id)
    
    platform_results = platform_query.group_by(Listing.platform).all()
    
    # Build platform breakdown dictionary from SQL results
    platform_breakdown = {}
    for platform, count in platform_results:
        if platform:  # Only include non-null platforms
            platform_breakdown[platform] = count
    
    # Get zombie listings (filtered) - pass user_id
    zombies, zombie_breakdown = analyze_zombie_listings(
        db,
        user_id=user_id,
        min_days=min_days, 
        max_sales=max_sales,
        max_watch_count=max_watch_count,
        supplier_filter=supplier_filter,
        platform_filter=marketplace,
        store_id=store_id
    )
    
    return {
        "total_count": total_count,
        "total_breakdown": total_breakdown,
        "platform_breakdown": platform_breakdown,
        "zombie_count": len(zombies),
        "zombie_breakdown": zombie_breakdown,  # Store-Level Breakdown
        "zombies": [
            {
                "id": z.id,
                "item_id": z.item_id,
                "ebay_item_id": z.item_id,  # Backward compatibility
                "title": z.title,
                "sku": z.sku,
                "image_url": z.image_url,
                "platform": z.platform,
                "marketplace": z.platform,  # Backward compatibility
                "supplier_name": z.supplier_name,
                "supplier": z.supplier_name,  # Backward compatibility
                "supplier_id": z.supplier_id,
                "price": (z.metrics.get('price') if z.metrics and 'price' in z.metrics else None) or z.price,
                "date_listed": z.date_listed.isoformat() if z.date_listed else None,
                "sold_qty": (z.metrics.get('sales') if z.metrics and 'sales' in z.metrics else None) or z.sold_qty or 0,
                "watch_count": (z.metrics.get('views') if z.metrics and 'views' in z.metrics else None) or z.watch_count or 0,
                "is_global_winner": bool(getattr(z, 'is_global_winner', 0)),  # Cross-Platform Health Check flag
                "is_active_elsewhere": bool(getattr(z, 'is_active_elsewhere', 0))  # Cross-Platform Activity Check flag
            }
            for z in zombies
        ]
    }


@app.post("/api/export")
def export_csv(
    export_mode: str,  # "autods", "yaballe", "ebay"
    min_days: int = 60,
    max_sales: int = 0,
    max_watch_count: int = 10,
    supplier_filter: str = "All",
    db: Session = Depends(get_db)
):
    """
    Smart Export Feature
    Generates CSV file based on the selected Listing Tool.
    Uses the same filter parameters as /api/analyze
    """
    if export_mode not in ["autods", "yaballe", "ebay"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid export_mode. Must be one of: autods, yaballe, ebay"
        )
    
    # Validate supplier_filter
    valid_suppliers = ["All", "Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Wholesale2B", "Spocket", "SaleHoo", "Inventory Source", "Dropified", "Unverified", "Unknown"]
    if supplier_filter not in valid_suppliers:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid supplier_filter. Must be one of: {', '.join(valid_suppliers)}"
        )
    
    # Ensure min_days, max_sales, and max_watch_count are non-negative
    min_days = max(0, min_days)
    max_sales = max(0, max_sales)
    max_watch_count = max(0, max_watch_count)
    
    # Get zombie listings with filters
    zombies, _ = analyze_zombie_listings(
        db, 
        user_id="default-user",  # Default user ID
        min_days=min_days, 
        max_sales=max_sales,
        max_watch_count=max_watch_count,
        supplier_filter=supplier_filter
    )
    
    if not zombies:
        raise HTTPException(status_code=404, detail="No zombie listings found")
    
    # Generate CSV (with snapshot logging)
    csv_content = generate_export_csv(zombies, export_mode, db=db, user_id="default-user")
    
    # Determine filename
    filename_map = {
        "autods": "zombies_autods.csv",
        "yaballe": "zombies_yaballe.csv",
        "ebay": "zombies_ebay.csv"
    }
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename_map[export_mode]}"
        }
    )


class ExportQueueRequest(BaseModel):
    items: List[Dict]
    target_tool: Optional[str] = None  # New parameter: "autods", "wholesale2b", "shopify_matrixify", etc.
    export_mode: Optional[str] = None  # Legacy parameter for backward compatibility
    mode: Optional[str] = "delete_list"  # "delete_list" (default) or "full_sync_list"
    store_id: Optional[str] = None  # Store ID for full_sync_list mode

@app.post("/api/export-queue")
def export_queue_csv(
    request: ExportQueueRequest,
    db: Session = Depends(get_db)
):
    """
    Export CSV from queue items (staging area)
    Accepts a list of items directly from the frontend queue
    Supports multiple export formats via target_tool parameter.
    """
    items = request.items
    
    # Support both new target_tool and legacy export_mode
    target_tool = request.target_tool or request.export_mode or "autods"
    
    valid_tools = ["autods", "yaballe", "ebay", "wholesale2b", "shopify_matrixify", "shopify_tagging"]
    if target_tool not in valid_tools:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid target_tool. Must be one of: {', '.join(valid_tools)}"
        )
    
    if not items:
        raise HTTPException(status_code=400, detail="No items in queue to export")
    
    # Validate mode
    mode = request.mode or "delete_list"
    if mode not in ["delete_list", "full_sync_list"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid mode. Must be 'delete_list' or 'full_sync_list'"
        )
    
    # Generate CSV directly from items (dictionaries) with target_tool (with snapshot logging)
    csv_content = generate_export_csv(
        items, 
        target_tool, 
        db=db, 
        user_id="default-user",
        mode=mode,
        store_id=request.store_id
    )
    
    # Determine filename
    filename_map = {
        "autods": "queue_autods.csv",
        "yaballe": "queue_yaballe.csv",
        "ebay": "queue_ebay.csv",
        "wholesale2b": "queue_wholesale2b.csv",
        "shopify_matrixify": "queue_shopify_matrixify.csv",
        "shopify_tagging": "queue_shopify_tagging.csv"
    }
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename_map[target_tool]}"
        }
    )


class LogDeletionRequest(BaseModel):
    items: List[Dict]

@app.post("/api/log-deletion")
def log_deletion(
    request: LogDeletionRequest,
    db: Session = Depends(get_db)
):
    """
    Log deleted items to history
    Accepts a list of items from the queue that were exported/deleted
    """
    items = request.items
    
    if not items:
        raise HTTPException(status_code=400, detail="No items to log")
    
    # Create deletion log entries
    logs = []
    for item in items:
        log_entry = DeletionLog(
            item_id=item.get("ebay_item_id") or item.get("item_id") or str(item.get("id", "")),
            title=item.get("title", "Unknown"),
            platform=item.get("marketplace") or item.get("platform") or "eBay",
            supplier=item.get("supplier") or item.get("supplier_name") or item.get("source", "Unknown")
        )
        logs.append(log_entry)
    
    # Bulk insert
    db.add_all(logs)
    db.commit()
    
    return {
        "message": f"Logged {len(logs)} deletions",
        "count": len(logs)
    }


@app.get("/api/history")
def get_deletion_history(
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db)
):
    """
    Get deletion history
    Returns total count and list of deleted items (most recent first)
    """
    # Get total count
    total_count = db.query(DeletionLog).count()
    
    # Get logs (most recent first)
    logs = db.query(DeletionLog).order_by(DeletionLog.deleted_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "total_count": total_count,
        "logs": [
            {
                "id": log.id,
                "item_id": log.item_id,
                "title": log.title,
                "platform": log.platform,
                "supplier": log.supplier,
                "deleted_at": log.deleted_at.isoformat() if log.deleted_at else None
            }
            for log in logs
        ]
    }


class UpdateListingRequest(BaseModel):
    supplier: Optional[str] = None

@app.patch("/api/listing/{listing_id}")
def update_listing(
    listing_id: int,
    request: UpdateListingRequest,
    db: Session = Depends(get_db)
):
    """
    Update a listing's supplier (manual override)
    Allows users to correct auto-detected suppliers
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Validate supplier if provided
    if request.supplier is not None:
        valid_suppliers = ["Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Wholesale2B", "Spocket", "SaleHoo", "Inventory Source", "Dropified", "Unverified", "Unknown"]
        if request.supplier not in valid_suppliers:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid supplier. Must be one of: {', '.join(valid_suppliers)}"
            )
        listing.supplier_name = request.supplier
    
    db.commit()
    db.refresh(listing)
    
    return {
        "id": listing.id,
        "item_id": listing.item_id,
        "ebay_item_id": listing.item_id,  # Backward compatibility
        "title": listing.title,
        "supplier_name": listing.supplier_name,
        "supplier": listing.supplier_name,  # Backward compatibility
        "message": "Listing updated successfully"
    }


@app.post("/api/dummy-data")
def create_dummy_data(
    count: int = 50,
    user_id: str = "default-user",
    db: Session = Depends(get_db)
):
    """Generate dummy listings for testing with new hybrid schema"""
    # Ensure tables exist before attempting to delete
    Base.metadata.create_all(bind=engine)
    
    # Clear all existing listings before generating new dummy data
    db.query(Listing).delete()
    db.commit()
    
    generate_dummy_listings(db, count=count, user_id=user_id)
    return {"message": f"Generated {count} dummy listings"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

