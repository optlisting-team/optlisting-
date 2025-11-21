from datetime import date, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models import Listing
import pandas as pd
from io import StringIO


def detect_source(image_url: str, sku: str) -> str:
    """
    Source Detective Logic
    Analyzes image_url and sku to determine the source.
    
    Rules:
    - If image_url contains "amazon" or "ssl-images-amazon" OR sku starts with "AMZ" -> "Amazon"
    - If image_url contains "walmart" OR sku starts with "WM" -> "Walmart"
    - Else -> "Unknown"
    """
    image_url_lower = image_url.lower()
    sku_upper = sku.upper()
    
    # Check for Amazon
    if (
        "amazon" in image_url_lower 
        or "ssl-images-amazon" in image_url_lower 
        or sku_upper.startswith("AMZ")
    ):
        return "Amazon"
    
    # Check for Walmart
    if "walmart" in image_url_lower or sku_upper.startswith("WM"):
        return "Walmart"
    
    return "Unknown"


def analyze_zombie_listings(
    db: Session,
    min_days: int = 60,
    max_sales: int = 0,
    max_watch_count: int = 10,
    source_filter: str = "All",
    marketplace_filter: str = "All"
) -> List[Listing]:
    """
    Zombie Filter Logic
    Filters listings based on dynamic criteria:
    - date_listed > min_days days ago
    - sold_qty <= max_sales
    - watch_count <= max_watch_count
    - source matches source_filter (if not "All")
    """
    # Ensure min_days is at least 0
    min_days = max(0, min_days)
    # Ensure max_sales is at least 0
    max_sales = max(0, max_sales)
    # Ensure max_watch_count is at least 0
    max_watch_count = max(0, max_watch_count)
    
    cutoff_date = date.today() - timedelta(days=min_days)
    
    # Build query with filters
    query = db.query(Listing).filter(
        and_(
            Listing.date_listed < cutoff_date,
            Listing.sold_qty <= max_sales,
            Listing.watch_count <= max_watch_count
        )
    )
    
    # Apply marketplace filter if not "All"
    if marketplace_filter and marketplace_filter != "All":
        query = query.filter(Listing.marketplace == marketplace_filter)
    
    # Apply source filter if not "All"
    if source_filter and source_filter != "All":
        query = query.filter(Listing.source == source_filter)
    
    zombies = query.all()
    
    return zombies


def generate_export_csv(
    listings,
    export_mode: str
) -> str:
    """
    Smart Export Feature
    Generates CSV file based on the selected Listing Tool.
    Accepts both Listing objects and dictionaries.
    
    Modes:
    1. AutoDS: Headers: "Source ID", "File Action" | Values: [ASIN], "delete"
    2. Yaballe: Headers: "Monitor ID", "Action" | Values: [ASIN], "DELETE"
    3. eBay File Exchange: Headers: "Action", "ItemID" | Values: "End", [ebay_item_id]
    """
    if not listings:
        return ""
    
    # Extract ASIN from SKU (assuming SKU format contains ASIN)
    # For now, we'll use SKU as ASIN, but this can be refined
    data = []
    
    for listing in listings:
        # Handle both Listing objects and dictionaries
        if isinstance(listing, dict):
            sku = listing.get("sku", "")
            ebay_item_id = listing.get("ebay_item_id", "")
        else:
            sku = listing.sku
            ebay_item_id = listing.ebay_item_id
        
        asin = sku  # Can be refined to extract actual ASIN
        
        if export_mode == "autods":
            data.append({
                "Source ID": asin,
                "File Action": "delete"
            })
        elif export_mode == "yaballe":
            data.append({
                "Monitor ID": asin,
                "Action": "DELETE"
            })
        elif export_mode == "ebay":
            data.append({
                "Action": "End",
                "ItemID": ebay_item_id
            })
        else:
            raise ValueError(f"Unknown export mode: {export_mode}")
    
    df = pd.DataFrame(data)
    
    # Convert to CSV string
    output = StringIO()
    df.to_csv(output, index=False)
    return output.getvalue()

