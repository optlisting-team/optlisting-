from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import Optional, List, Dict
from datetime import date
import json
from pydantic import BaseModel

from models import init_db, get_db, Listing, DeletionLog
from services import detect_source, analyze_zombie_listings, generate_export_csv
from dummy_data import generate_dummy_listings

app = FastAPI(title="OptListing API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    try:
        init_db()
        # Generate dummy data on first startup
        db = next(get_db())
        try:
            count = db.query(Listing).count()
            if count == 0:
                print("Generating 5000 dummy listings... This may take a moment.")
                generate_dummy_listings(db, count=5000)
                print("Dummy data generated successfully")
        except Exception as e:
            print(f"Error generating dummy data: {e}")
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
    image_url: str,
    sku: str,
    db: Session = Depends(get_db)
):
    """Detect source for a listing"""
    source = detect_source(image_url, sku)
    return {"source": source}


@app.get("/api/analyze")
def analyze_zombies(
    min_days: int = 3,
    max_sales: int = 0,
    max_watch_count: int = 10,
    source_filter: str = "All",
    marketplace: str = "All",
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
    # Validate marketplace
    valid_marketplaces = ["All", "eBay", "Amazon", "Shopify", "Walmart"]
    if marketplace not in valid_marketplaces:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid marketplace. Must be one of: {', '.join(valid_marketplaces)}"
        )
    
    # Validate source_filter
    valid_sources = ["All", "Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Unknown"]
    if source_filter not in valid_sources:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid source_filter. Must be one of: {', '.join(valid_sources)}"
        )
    
    # Ensure min_days, max_sales, and max_watch_count are non-negative
    min_days = max(0, min_days)
    max_sales = max(0, max_sales)
    max_watch_count = max(0, max_watch_count)
    
    # Get ALL listings for total stats (not just zombies)
    all_listings = db.query(Listing).all()
    total_count = len(all_listings)
    
    # Calculate breakdown by source for ALL listings
    total_breakdown = {"Amazon": 0, "Walmart": 0, "AliExpress": 0, "CJ Dropshipping": 0, "Home Depot": 0, "Wayfair": 0, "Costco": 0, "Unknown": 0}
    # Calculate breakdown by platform for ALL listings
    platform_breakdown = {"eBay": 0, "Amazon": 0, "Shopify": 0, "Walmart": 0}
    for listing in all_listings:
        source = listing.source
        if source in total_breakdown:
            total_breakdown[source] += 1
        else:
            total_breakdown["Unknown"] += 1
        
        # Platform breakdown
        marketplace = getattr(listing, 'marketplace', 'eBay') or 'eBay'
        if marketplace in platform_breakdown:
            platform_breakdown[marketplace] += 1
        else:
            platform_breakdown["eBay"] += 1  # Default to eBay if unknown
    
    # Get zombie listings (filtered)
    zombies = analyze_zombie_listings(
        db, 
        min_days=min_days, 
        max_sales=max_sales,
        max_watch_count=max_watch_count,
        source_filter=source_filter,
        marketplace_filter=marketplace
    )
    
    return {
        "total_count": total_count,
        "total_breakdown": total_breakdown,
        "platform_breakdown": platform_breakdown,
        "zombie_count": len(zombies),
        "zombies": [
            {
                "id": z.id,
                "ebay_item_id": z.ebay_item_id,
                "title": z.title,
                "sku": z.sku,
                "image_url": z.image_url,
                "marketplace": getattr(z, 'marketplace', 'eBay'),
                "source": z.source,
                "price": z.price,
                "date_listed": z.date_listed.isoformat() if z.date_listed else None,
                "sold_qty": z.sold_qty,
                "watch_count": z.watch_count
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
    valid_sources = ["All", "Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Unknown"]
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
    export_mode: str

@app.post("/api/export-queue")
def export_queue_csv(
    request: ExportQueueRequest,
    db: Session = Depends(get_db)
):
    """
    Export CSV from queue items (staging area)
    Accepts a list of items directly from the frontend queue
    """
    items = request.items
    export_mode = request.export_mode
    
    if export_mode not in ["autods", "yaballe", "ebay"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid export_mode. Must be one of: autods, yaballe, ebay"
        )
    
    if not items:
        raise HTTPException(status_code=400, detail="No items in queue to export")
    
    # Generate CSV directly from items (dictionaries)
    csv_content = generate_export_csv(items, export_mode)
    
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


@app.post("/api/dummy-data")
def create_dummy_data(
    count: int = 50,
    db: Session = Depends(get_db)
):
    """Generate dummy listings for testing"""
    generate_dummy_listings(db, count=count)
    return {"message": f"Generated {count} dummy listings"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

