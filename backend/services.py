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
    days_old: int = 60,
    min_sold_qty: int = 0
) -> List[Listing]:
    """
    Zombie Filter Logic
    Filters listings based on criteria:
    - date_listed > days_old days ago
    - sold_qty == min_sold_qty
    """
    cutoff_date = date.today() - timedelta(days=days_old)
    
    zombies = db.query(Listing).filter(
        and_(
            Listing.date_listed < cutoff_date,
            Listing.sold_qty == min_sold_qty
        )
    ).all()
    
    return zombies


def generate_export_csv(
    listings: List[Listing],
    export_mode: str
) -> str:
    """
    Smart Export Feature
    Generates CSV file based on the selected Listing Tool.
    
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
        asin = listing.sku  # Can be refined to extract actual ASIN
        
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
                "ItemID": listing.ebay_item_id
            })
        else:
            raise ValueError(f"Unknown export mode: {export_mode}")
    
    df = pd.DataFrame(data)
    
    # Convert to CSV string
    output = StringIO()
    df.to_csv(output, index=False)
    return output.getvalue()

