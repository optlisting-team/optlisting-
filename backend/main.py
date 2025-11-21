from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
import json

from models import init_db, get_db, Listing
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
    init_db()
    # Generate dummy data on first startup
    db = next(get_db())
    try:
        count = db.query(Listing).count()
        if count == 0:
            generate_dummy_listings(db, count=50)
            print("Dummy data generated successfully")
    finally:
        db.close()


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
    days_old: int = 60,
    min_sold_qty: int = 0,
    db: Session = Depends(get_db)
):
    """
    Zombie Filter API
    Filters listings based on criteria:
    - date_listed > days_old days ago
    - sold_qty == min_sold_qty
    """
    zombies = analyze_zombie_listings(db, days_old=days_old, min_sold_qty=min_sold_qty)
    
    return {
        "total_zombies": len(zombies),
        "zombies": [
            {
                "id": z.id,
                "ebay_item_id": z.ebay_item_id,
                "title": z.title,
                "sku": z.sku,
                "image_url": z.image_url,
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
    days_old: int = 60,
    min_sold_qty: int = 0,
    db: Session = Depends(get_db)
):
    """
    Smart Export Feature
    Generates CSV file based on the selected Listing Tool.
    """
    if export_mode not in ["autods", "yaballe", "ebay"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid export_mode. Must be one of: autods, yaballe, ebay"
        )
    
    # Get zombie listings
    zombies = analyze_zombie_listings(db, days_old=days_old, min_sold_qty=min_sold_qty)
    
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

