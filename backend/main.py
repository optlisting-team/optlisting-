from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from datetime import date
import json
from pydantic import BaseModel

from backend.models import init_db, get_db, Listing, DeletionLog, Base, engine
from backend.services import detect_source, extract_source_info, analyze_zombie_listings, generate_export_csv
from backend.dummy_data import generate_dummy_listings

app = FastAPI(title="OptListing API", version="1.0.0")

# CORS middleware for React frontend
# Allow both local development and production frontend URLs
import os
cors_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", ""),  # Production frontend URL from environment
]
# Filter out empty strings
cors_origins = [origin for origin in cors_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],  # Fallback to all if no origins specified
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    db: Session = Depends(get_db)
):
    """Get all listings"""
    listings = db.query(Listing).offset(skip).limit(limit).all()
    return {
        "total": db.query(Listing).count(),
        "listings": [
            {
                "id": l.id,
                "ebay_item_id": l.ebay_item_id,
                "title": l.title,
                "sku": l.sku,
                "image_url": l.image_url,
                "brand": getattr(l, 'brand', None),
                "upc": getattr(l, 'upc', None),
                "marketplace": getattr(l, 'marketplace', 'eBay'),
                "source": l.source,
                "price": l.price,
                "date_listed": l.date_listed.isoformat() if l.date_listed else None,
                "sold_qty": l.sold_qty,
                "watch_count": l.watch_count
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
    source_filter: str = "All",
    marketplace: str = "All",
    user_id: str = "default-user",  # Default user ID for backward compatibility
    db: Session = Depends(get_db)
):
    """
    Zombie Filter API
    Filters listings based on dynamic criteria:
    - marketplace: Filter by marketplace - "All", "eBay", "Amazon", "Shopify", "Walmart" (default: "All")
    - min_days: Minimum days old (default: 3)
    - max_sales: Maximum sales count (default: 0)
    - max_watch_count: Maximum watch count/views (default: 10)
    - source_filter: Filter by source - "All", "Amazon", "Walmart", etc. (default: "All")
    
    Returns:
    - total_count: Total number of ALL listings in the database
    - total_breakdown: Breakdown by source for ALL listings
    - zombie_count: Number of filtered zombie listings
    - zombies: List of zombie listings
    """
    # Validate marketplace - Global marketplace list
    valid_marketplaces = [
        "All",
        # South Korea
        "Naver Smart Store", "Coupang", "Gmarket", "11st",
        # North America
        "eBay", "Amazon", "Shopify", "Walmart", "Etsy", "Target",
        # Japan & Taiwan
        "Rakuten", "Qoo10", "Shopee TW", "Momo", "Ruten",
        # South East Asia
        "Shopee", "Lazada", "Tokopedia",
        # Europe
        "Allegro", "Zalando", "Cdiscount", "Otto",
        # Latin America & Others
        "Mercado Libre", "Wildberries", "Flipkart", "Ozon"
    ]
    if marketplace not in valid_marketplaces:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid marketplace. Must be one of: {', '.join(valid_marketplaces)}"
        )
    
    # Validate source_filter
    valid_sources = ["All", "Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Wholesale2B", "Spocket", "SaleHoo", "Inventory Source", "Dropified", "Unverified", "Unknown"]
    if source_filter not in valid_sources:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid source_filter. Must be one of: {', '.join(valid_sources)}"
        )
    
    # Ensure min_days, max_sales, and max_watch_count are non-negative
    min_days = max(0, min_days)
    max_sales = max(0, max_sales)
    max_watch_count = max(0, max_watch_count)
    
    # Get ALL listings for total stats (not just zombies) - filter by user_id
    all_listings = db.query(Listing).filter(Listing.user_id == user_id).all()
    total_count = len(all_listings)
    
    # Calculate breakdown by source for ALL listings
    total_breakdown = {"Amazon": 0, "Walmart": 0, "AliExpress": 0, "CJ Dropshipping": 0, "Home Depot": 0, "Wayfair": 0, "Costco": 0, "Wholesale2B": 0, "Spocket": 0, "SaleHoo": 0, "Inventory Source": 0, "Dropified": 0, "Unverified": 0, "Unknown": 0}
    # Calculate breakdown by platform for ALL listings (dynamic - includes all marketplaces)
    platform_breakdown = {}
    for listing in all_listings:
        # Use source_name if available, otherwise fallback to source (legacy)
        source = getattr(listing, 'source_name', None) or getattr(listing, 'source', 'Unknown')
        if source in total_breakdown:
            total_breakdown[source] += 1
        else:
            total_breakdown["Unknown"] += 1
        
        # Platform breakdown (use platform if available, otherwise marketplace)
        platform = getattr(listing, 'platform', None) or getattr(listing, 'marketplace', 'eBay') or 'eBay'
        if platform not in platform_breakdown:
            platform_breakdown[platform] = 0
        platform_breakdown[platform] += 1
    
    # Ensure key marketplaces are always present (even if count is 0)
    key_marketplaces = ["eBay", "Amazon", "Shopify", "Walmart", "Naver Smart Store", "Coupang"]
    for key in key_marketplaces:
        if key not in platform_breakdown:
            platform_breakdown[key] = 0
    
    # Get zombie listings (filtered) - pass user_id
    zombies = analyze_zombie_listings(
        db,
        user_id=user_id,
        min_days=min_days, 
        max_sales=max_sales,
        max_watch_count=max_watch_count,
        source_filter=source_filter,
        platform_filter=marketplace
    )
    
    return {
        "total_count": total_count,
        "total_breakdown": total_breakdown,
        "platform_breakdown": platform_breakdown,
        "zombie_count": len(zombies),
        "zombies": [
            {
                "id": z.id,
                "item_id": getattr(z, 'item_id', None) or getattr(z, 'ebay_item_id', ''),
                "ebay_item_id": getattr(z, 'item_id', None) or getattr(z, 'ebay_item_id', ''),  # Backward compatibility
                "title": z.title,
                "sku": z.sku,
                "image_url": z.image_url,
                "platform": getattr(z, 'platform', None) or getattr(z, 'marketplace', 'eBay'),
                "marketplace": getattr(z, 'platform', None) or getattr(z, 'marketplace', 'eBay'),  # Backward compatibility
                "source_name": getattr(z, 'source_name', None) or getattr(z, 'source', 'Unknown'),
                "source": getattr(z, 'source_name', None) or getattr(z, 'source', 'Unknown'),  # Backward compatibility
                "source_id": getattr(z, 'source_id', None),
                "price": getattr(z, 'price', None) or (z.metrics.get('price') if hasattr(z, 'metrics') and z.metrics else None),
                "date_listed": z.date_listed.isoformat() if z.date_listed else None,
                "sold_qty": getattr(z, 'sold_qty', 0) or (z.metrics.get('sales') if hasattr(z, 'metrics') and z.metrics else 0),
                "watch_count": getattr(z, 'watch_count', 0) or (z.metrics.get('views') if hasattr(z, 'metrics') and z.metrics else 0)
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
    source_filter: str = "All",
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
    
    # Validate source_filter
    valid_sources = ["All", "Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Wholesale2B", "Spocket", "SaleHoo", "Inventory Source", "Dropified", "Unverified", "Unknown"]
    if source_filter not in valid_sources:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid source_filter. Must be one of: {', '.join(valid_sources)}"
        )
    
    # Ensure min_days, max_sales, and max_watch_count are non-negative
    min_days = max(0, min_days)
    max_sales = max(0, max_sales)
    max_watch_count = max(0, max_watch_count)
    
    # Get zombie listings with filters
    zombies = analyze_zombie_listings(
        db, 
        min_days=min_days, 
        max_sales=max_sales,
        max_watch_count=max_watch_count,
        source_filter=source_filter
    )
    
    if not zombies:
        raise HTTPException(status_code=404, detail="No zombie listings found")
    
    # Generate CSV
    csv_content = generate_export_csv(zombies, export_mode)
    
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
    
    # Generate CSV directly from items (dictionaries) with target_tool
    csv_content = generate_export_csv(items, target_tool)
    
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
            source=item.get("source", "Unknown")
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
                "source": log.source,
                "deleted_at": log.deleted_at.isoformat() if log.deleted_at else None
            }
            for log in logs
        ]
    }


class UpdateListingRequest(BaseModel):
    source: Optional[str] = None

@app.patch("/api/listing/{listing_id}")
def update_listing(
    listing_id: int,
    request: UpdateListingRequest,
    db: Session = Depends(get_db)
):
    """
    Update a listing's source (manual override)
    Allows users to correct auto-detected sources
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Validate source if provided
    if request.source is not None:
        valid_sources = ["Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Wholesale2B", "Spocket", "SaleHoo", "Inventory Source", "Dropified", "Unverified", "Unknown"]
        if request.source not in valid_sources:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid source. Must be one of: {', '.join(valid_sources)}"
            )
        listing.source = request.source
    
    db.commit()
    db.refresh(listing)
    
    return {
        "id": listing.id,
        "ebay_item_id": listing.ebay_item_id,
        "title": listing.title,
        "source": listing.source,
        "message": "Listing updated successfully"
    }


@app.post("/api/dummy-data")
def create_dummy_data(
    count: int = 50,
    user_id: str = "default-user",
    db: Session = Depends(get_db)
):
    """Generate dummy listings for testing with new hybrid schema"""
    # Clear all existing listings before generating new dummy data
    db.query(Listing).delete()
    db.commit()
    
    generate_dummy_listings(db, count=count, user_id=user_id)
    return {"message": f"Generated {count} dummy listings"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

