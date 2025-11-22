from datetime import date, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from backend.models import Listing
import pandas as pd
from io import StringIO


def detect_source(
    image_url: str = "",
    sku: str = "",
    title: str = "",
    brand: str = "",
    upc: str = ""
) -> tuple[str, str]:
    """
    Advanced Source Detection with Forensic Analysis
    Uses multiple data points to identify source with confidence scoring.
    
    Detection Methods (in priority order):
    1. Exclusive Brand/Keyword Match (HIGH confidence)
    2. SKU Prefix Match (HIGH confidence)
    3. UPC/EAN Prefix Match (HIGH confidence)
    4. Image URL Domain Match (MEDIUM confidence)
    
    Returns: (source, confidence_level)
    - source: Detected source name or "Unverified"
    - confidence_level: "High", "Medium", "Low"
    """
    image_url_lower = image_url.lower() if image_url else ""
    sku_upper = sku.upper() if sku else ""
    title_lower = title.lower() if title else ""
    brand_lower = brand.lower() if brand else ""
    upc_str = upc.strip() if upc else ""
    
    # Exclusive Brand/Keyword Dictionary (HIGH confidence indicators)
    exclusive_brands = {
        "Walmart": ["mainstays", "great value", "equate", "pen+gear", "pen & gear", "hyper tough"],
        "Costco": ["kirkland", "kirkland signature"],
        "Amazon": ["amazonbasics", "solimo", "happy belly"],
        "Home Depot": ["husky", "hdx", "glacier bay"],
        "Wayfair": ["wayfair basics", "mercury row"]
    }
    
    # SKU Prefix Patterns (HIGH confidence)
    sku_patterns = {
        "Amazon": ["AMZ"],
        "Walmart": ["WM"],
        "AliExpress": ["AE", "ALI"],
        "CJ Dropshipping": ["CJ"],
        "Home Depot": ["HD"],
        "Wayfair": ["WF"],
        "Costco": ["CO"],
        "Wholesale2B": ["W2B"],
        "Spocket": ["SPK"],
        "SaleHoo": ["SH"],
        "Inventory Source": ["IS"],
        "Dropified": ["DF"]
    }
    
    # UPC/EAN Prefix Patterns (HIGH confidence)
    # Real implementation would query UPC database
    upc_patterns = {
        "Walmart": ["681131"],  # Walmart UPC prefix
        # Add more UPC prefixes as needed
    }
    
    # Image URL Domain Patterns (MEDIUM confidence)
    url_patterns = {
        "Amazon": ["amazon", "ssl-images-amazon"],
        "Walmart": ["walmart", "walmartimages"],
        "AliExpress": ["alicdn", "aliexpress"],
        "CJ Dropshipping": ["cjdropshipping"],
        "Home Depot": ["homedepot"],
        "Wayfair": ["wayfair"],
        "Costco": ["costco"],
        "Wholesale2B": ["wholesale2b"],
        "Spocket": ["spocket"],
        "SaleHoo": ["salehoo"],
        "Inventory Source": ["inventorysource"],
        "Dropified": ["dropified"]
    }
    
    # Priority 1: Check Exclusive Brands/Keywords (HIGH confidence)
    # Check both title and brand field
    search_text = f"{title_lower} {brand_lower}".strip()
    for source, keywords in exclusive_brands.items():
        for keyword in keywords:
            if keyword in search_text:
                return (source, "High")
    
    # Priority 2: Check SKU Prefix (HIGH confidence)
    for source, prefixes in sku_patterns.items():
        if any(sku_upper.startswith(prefix) for prefix in prefixes):
            return (source, "High")
    
    # Priority 3: Check UPC/EAN Prefix (HIGH confidence)
    if upc_str:
        for source, prefixes in upc_patterns.items():
            if any(upc_str.startswith(prefix) for prefix in prefixes):
                return (source, "High")
    
    # Priority 4: Check Image URL Domain (MEDIUM confidence)
    if image_url_lower:
        for source, keywords in url_patterns.items():
            if any(keyword in image_url_lower for keyword in keywords):
                return (source, "Medium")
    
    # No match found -> Unverified (LOW confidence)
    return ("Unverified", "Low")


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

