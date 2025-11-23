from datetime import date, timedelta, datetime
from typing import List, Optional, Dict, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, cast, Integer
from sqlalchemy.dialects.postgresql import insert
from backend.models import Listing
import pandas as pd
from io import StringIO
import re
import json


def extract_supplier_info(
    sku: str = "",
    image_url: str = "",
    title: str = "",
    brand: str = "",
    upc: str = ""
) -> Tuple[str, Optional[str]]:
    """
    Extract Supplier Name and Supplier ID from SKU and other data.
    
    Returns: (supplier_name, supplier_id)
    - supplier_name: Detected supplier name (e.g., "Amazon", "Walmart", "Unverified")
    - supplier_id: Extracted supplier ID (e.g., ASIN "B08...", Walmart ID) or None
    
    Logic:
    - Amazon: If SKU has "AMZ" or "B0..." pattern, extract ASIN -> save to supplier_id
    - Walmart: If SKU has "WM", extract the ID -> save to supplier_id
    - AliExpress/Others: Regex matching logic
    - Fallback: If unknown, set supplier_name="Unverified"
    """
    sku_upper = sku.upper() if sku else ""
    image_url_lower = image_url.lower() if image_url else ""
    title_lower = title.lower() if title else ""
    brand_lower = brand.lower() if brand else ""
    
    # Amazon Detection
    # Pattern 1: SKU starts with "AMZ" or contains "B0" (ASIN pattern)
    amazon_asin_pattern = r'B0[0-9A-Z]{8}'  # ASIN format: B + 9 alphanumeric
    if sku_upper.startswith("AMZ") or re.search(amazon_asin_pattern, sku_upper):
        # Extract ASIN
        asin_match = re.search(amazon_asin_pattern, sku_upper)
        if asin_match:
            supplier_id = asin_match.group(0)
        elif sku_upper.startswith("AMZ"):
            # Try to extract ASIN from SKU (e.g., "AMZ-B08ABC1234")
            parts = sku_upper.split("-")
            for part in parts:
                if re.match(amazon_asin_pattern, part):
                    supplier_id = part
                    break
            else:
                supplier_id = sku_upper.replace("AMZ", "").strip("-")
        else:
            supplier_id = None
        return ("Amazon", supplier_id)
    
    # Walmart Detection
    if sku_upper.startswith("WM") or "WALMART" in image_url_lower:
        # Extract Walmart ID (usually after "WM-" prefix)
        if sku_upper.startswith("WM"):
            walmart_id = sku_upper.replace("WM", "").strip("-").strip()
            supplier_id = walmart_id if walmart_id else None
        else:
            supplier_id = None
        return ("Walmart", supplier_id)
    
    # AliExpress Detection
    if sku_upper.startswith("AE") or sku_upper.startswith("ALI") or "aliexpress" in image_url_lower or "alicdn" in image_url_lower:
        # Extract AliExpress product ID
        if sku_upper.startswith("AE") or sku_upper.startswith("ALI"):
            ali_id = sku_upper.replace("AE", "").replace("ALI", "").strip("-").strip()
            supplier_id = ali_id if ali_id else None
        else:
            supplier_id = None
        return ("AliExpress", supplier_id)
    
    # CJ Dropshipping
    if sku_upper.startswith("CJ") or "cjdropshipping" in image_url_lower:
        cj_id = sku_upper.replace("CJ", "").strip("-").strip() if sku_upper.startswith("CJ") else None
        return ("CJ Dropshipping", cj_id)
    
    # Home Depot
    if sku_upper.startswith("HD") or "homedepot" in image_url_lower:
        hd_id = sku_upper.replace("HD", "").strip("-").strip() if sku_upper.startswith("HD") else None
        return ("Home Depot", hd_id)
    
    # Wayfair
    if sku_upper.startswith("WF") or "wayfair" in image_url_lower:
        wf_id = sku_upper.replace("WF", "").strip("-").strip() if sku_upper.startswith("WF") else None
        return ("Wayfair", wf_id)
    
    # Costco
    if sku_upper.startswith("CO") or "costco" in image_url_lower:
        co_id = sku_upper.replace("CO", "").strip("-").strip() if sku_upper.startswith("CO") else None
        return ("Costco", co_id)
    
    # Pro Aggregators
    if sku_upper.startswith("W2B") or "wholesale2b" in image_url_lower:
        w2b_id = sku_upper.replace("W2B", "").strip("-").strip() if sku_upper.startswith("W2B") else None
        return ("Wholesale2B", w2b_id)
    
    if sku_upper.startswith("SPK") or "spocket" in image_url_lower:
        spk_id = sku_upper.replace("SPK", "").strip("-").strip() if sku_upper.startswith("SPK") else None
        return ("Spocket", spk_id)
    
    if sku_upper.startswith("SH") or "salehoo" in image_url_lower:
        sh_id = sku_upper.replace("SH", "").strip("-").strip() if sku_upper.startswith("SH") else None
        return ("SaleHoo", sh_id)
    
    if sku_upper.startswith("IS") or "inventorysource" in image_url_lower:
        is_id = sku_upper.replace("IS", "").strip("-").strip() if sku_upper.startswith("IS") else None
        return ("Inventory Source", is_id)
    
    if sku_upper.startswith("DF") or "dropified" in image_url_lower:
        df_id = sku_upper.replace("DF", "").strip("-").strip() if sku_upper.startswith("DF") else None
        return ("Dropified", df_id)
    
    # Fallback: Unverified
    return ("Unverified", None)


def detect_source(
    image_url: str = "",
    sku: str = "",
    title: str = "",
    brand: str = "",
    upc: str = ""
) -> tuple[str, str]:
    """
    Legacy function - kept for backward compatibility.
    Now uses extract_supplier_info internally.
    """
    supplier_name, _ = extract_supplier_info(sku, image_url, title, brand, upc)
    # Return with confidence level for backward compatibility
    confidence = "High" if supplier_name != "Unverified" else "Low"
    return (supplier_name, confidence)
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
    user_id: str,
    min_days: int = 60,
    max_sales: int = 0,
    max_watch_count: int = 10,
    supplier_filter: str = "All",
    platform_filter: str = "All"
) -> List[Listing]:
    """
    Low Interest Items Filter Logic (formerly Zombie Filter)
    Filters listings based on dynamic criteria using new hybrid schema.
    
    Uses metrics JSONB field for flexible filtering:
    - date_listed > min_days days ago (from metrics or legacy date_listed)
    - sales <= max_sales (from metrics['sales'] or legacy sold_qty)
    - views <= max_watch_count (from metrics['views'] or legacy watch_count)
    - supplier_name matches supplier_filter (if not "All")
    - platform matches platform_filter (if not "All")
    """
    # Ensure min_days is at least 0
    min_days = max(0, min_days)
    # Ensure max_sales is at least 0
    max_sales = max(0, max_sales)
    # Ensure max_watch_count is at least 0
    max_watch_count = max(0, max_watch_count)
    
    cutoff_date = date.today() - timedelta(days=min_days)
    
    # Build query with filters
    # Support both new metrics JSONB and legacy fields
    query = db.query(Listing).filter(
        Listing.user_id == user_id
    )
    
    # Date filter: use date_listed (legacy field exists, use it directly)
    query = query.filter(
        Listing.date_listed < cutoff_date
    )
    
    # Sales filter: use metrics['sales'] (JSONB) or fallback to sold_qty (legacy)
    # PostgreSQL JSONB query: cast metrics['sales'] to integer, or use sold_qty
    query = query.filter(
        or_(
            # Use metrics JSONB if available
            and_(
                Listing.metrics != None,
                Listing.metrics.has_key('sales'),
                cast(Listing.metrics['sales'].astext, Integer) <= max_sales
            ),
            # Fallback to legacy sold_qty field
            and_(
                or_(
                    Listing.metrics == None,
                    ~Listing.metrics.has_key('sales')
                ),
                or_(
                    Listing.sold_qty == None,
                    Listing.sold_qty <= max_sales
                )
            )
        )
    )
    
    # Watch count filter: use metrics['views'] (JSONB) or fallback to watch_count (legacy)
    query = query.filter(
        or_(
            # Use metrics JSONB if available
            and_(
                Listing.metrics != None,
                Listing.metrics.has_key('views'),
                cast(Listing.metrics['views'].astext, Integer) <= max_watch_count
            ),
            # Fallback to legacy watch_count field
            and_(
                or_(
                    Listing.metrics == None,
                    ~Listing.metrics.has_key('views')
                ),
                or_(
                    Listing.watch_count == None,
                    Listing.watch_count <= max_watch_count
                )
            )
        )
    )
    
    # Apply platform filter if not "All"
    if platform_filter and platform_filter != "All":
        query = query.filter(Listing.platform == platform_filter)
    
    # Apply supplier filter if not "All"
    if supplier_filter and supplier_filter != "All":
        query = query.filter(Listing.supplier_name == supplier_filter)
    
    zombies = query.all()
    
    return zombies


def upsert_listings(db: Session, listings: List[Listing]) -> int:
    """
    UPSERT listings using PostgreSQL's ON CONFLICT DO UPDATE.
    
    This function handles duplicate key conflicts by updating existing records
    instead of raising IntegrityError. Uses the unique index 'idx_user_platform_item'
    which is on (user_id, platform, item_id).
    
    For PostgreSQL: Uses INSERT ... ON CONFLICT DO UPDATE
    For SQLite: Falls back to individual INSERT OR REPLACE (less efficient but compatible)
    
    Args:
        db: Database session
        listings: List of Listing objects to upsert
        
    Returns:
        Number of listings processed
    """
    if not listings:
        return 0
    
    # Check if we're using PostgreSQL (has insert().on_conflict_do_update)
    # or SQLite (needs different approach)
    from sqlalchemy import inspect
    from backend.models import engine
    
    is_postgresql = engine.dialect.name == 'postgresql'
    
    if is_postgresql:
        # PostgreSQL: Use bulk INSERT ... ON CONFLICT DO UPDATE
        table = Listing.__table__
        
        # Prepare data dictionaries for bulk insert
        values_list = []
        for listing in listings:
            # Convert Listing object to dictionary
            values = {
                'user_id': listing.user_id,
                'platform': listing.platform,
                'item_id': listing.item_id,
                'title': listing.title,
                'image_url': listing.image_url,
                'sku': listing.sku,
                'supplier_name': listing.supplier_name,
                'supplier_id': listing.supplier_id,
                'brand': listing.brand,
                'upc': listing.upc,
                'metrics': listing.metrics if listing.metrics else {},
                'raw_data': listing.raw_data if listing.raw_data else {},
                'last_synced_at': listing.last_synced_at if listing.last_synced_at else datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                # Legacy fields
                'price': listing.price,
                'date_listed': listing.date_listed,
                'sold_qty': listing.sold_qty if listing.sold_qty is not None else 0,
                'watch_count': listing.watch_count if listing.watch_count is not None else 0,
            }
            values_list.append(values)
        
        # Use PostgreSQL's INSERT ... ON CONFLICT DO UPDATE
        stmt = insert(table).values(values_list)
        
        # On conflict, update these fields (but preserve created_at)
        # Use excluded table reference for PostgreSQL ON CONFLICT
        excluded = stmt.excluded
        stmt = stmt.on_conflict_do_update(
            index_elements=['user_id', 'platform', 'item_id'],
            set_={
                'title': excluded.title,
                'image_url': excluded.image_url,
                'sku': excluded.sku,
                'supplier_name': excluded.supplier_name,
                'supplier_id': excluded.supplier_id,
                'brand': excluded.brand,
                'upc': excluded.upc,
                'metrics': excluded.metrics,
                'raw_data': excluded.raw_data,
                'last_synced_at': excluded.last_synced_at,
                'updated_at': datetime.utcnow(),
                # Legacy fields
                'price': excluded.price,
                'date_listed': excluded.date_listed,
                'sold_qty': excluded.sold_qty,
                'watch_count': excluded.watch_count,
            }
        )
        
        # Execute the statement
        db.execute(stmt)
        db.commit()
    else:
        # SQLite: Use individual INSERT OR REPLACE (less efficient but compatible)
        for listing in listings:
            # Check if listing exists
            existing = db.query(Listing).filter(
                Listing.user_id == listing.user_id,
                Listing.platform == listing.platform,
                Listing.item_id == listing.item_id
            ).first()
            
            if existing:
                # Update existing record
                existing.title = listing.title
                existing.image_url = listing.image_url
                existing.sku = listing.sku
                existing.supplier_name = listing.supplier_name
                existing.supplier_id = listing.supplier_id
                existing.brand = listing.brand
                existing.upc = listing.upc
                existing.metrics = listing.metrics if listing.metrics else {}
                existing.raw_data = listing.raw_data if listing.raw_data else {}
                existing.last_synced_at = listing.last_synced_at if listing.last_synced_at else datetime.utcnow()
                existing.updated_at = datetime.utcnow()
                existing.price = listing.price
                existing.date_listed = listing.date_listed
                existing.sold_qty = listing.sold_qty if listing.sold_qty is not None else 0
                existing.watch_count = listing.watch_count if listing.watch_count is not None else 0
            else:
                # Insert new record
                listing.updated_at = datetime.utcnow()
                db.add(listing)
        
        db.commit()
    
    return len(listings)


def generate_export_csv(
    listings,
    target_tool: str
) -> str:
    """
    Advanced CSV Export with Tool-Specific Formats
    
    Supports multiple export formats:
    1. AutoDS: Headers: "Source ID", "File Action" | Data: source_id, "delete"
    2. Wholesale2B: Headers: "SKU", "Action" | Data: sku, "Delete"
    3. Shopify (Matrixify/Excelify): Headers: "ID", "Command" | Data: item_id, "DELETE"
    4. Shopify (Tagging Method): Headers: "Handle", "Tags" | Data: handle/sku, "OptListing_Delete"
    5. eBay File Exchange: Headers: "Action", "ItemID" | Data: "End", item_id
    6. Yaballe: Headers: "Monitor ID", "Action" | Data: source_id, "DELETE"
    
    Args:
        listings: List of Listing objects or dictionaries
        target_tool: Tool name (e.g., "autods", "wholesale2b", "shopify_matrixify", "shopify_tagging", "ebay", "yaballe")
    
    Returns:
        CSV string
    """
    if not listings:
        return ""
    
    data = []
    
    for listing in listings:
        # Handle both Listing objects and dictionaries
        if isinstance(listing, dict):
            item_id = listing.get("item_id") or listing.get("ebay_item_id", "")
            sku = listing.get("sku", "")
            supplier_id = listing.get("supplier_id", "") or listing.get("source_id", "")  # Backward compatibility
            supplier_name = listing.get("supplier_name") or listing.get("source_name") or listing.get("source", "")
            platform = listing.get("platform", "")
            # Try to get handle from raw_data or use SKU as fallback
            raw_data = listing.get("raw_data", {})
            if isinstance(raw_data, str):
                try:
                    raw_data = json.loads(raw_data)
                except:
                    raw_data = {}
            handle = raw_data.get("handle") or sku
        else:
            item_id = listing.item_id if hasattr(listing, 'item_id') else (listing.ebay_item_id if hasattr(listing, 'ebay_item_id') else "")
            sku = listing.sku
            supplier_id = listing.supplier_id if hasattr(listing, 'supplier_id') else (listing.source_id if hasattr(listing, 'source_id') else None)
            supplier_name = listing.supplier_name if hasattr(listing, 'supplier_name') else (listing.source_name if hasattr(listing, 'source_name') else (listing.source if hasattr(listing, 'source') else ""))
            platform = listing.platform if hasattr(listing, 'platform') else (listing.marketplace if hasattr(listing, 'marketplace') else "")
            # Try to get handle from raw_data
            raw_data = listing.raw_data if hasattr(listing, 'raw_data') else {}
            if isinstance(raw_data, str):
                try:
                    raw_data = json.loads(raw_data)
                except:
                    raw_data = {}
            handle = raw_data.get("handle") if raw_data else sku
        
        # Use supplier_id if available, otherwise fallback to SKU
        effective_supplier_id = supplier_id if supplier_id else sku
        
        if target_tool == "autods":
            data.append({
                "Source ID": effective_supplier_id,
                "File Action": "delete"
            })
        elif target_tool == "wholesale2b":
            data.append({
                "SKU": sku,
                "Action": "Delete"
            })
        elif target_tool == "shopify_matrixify":
            # Shopify Matrixify/Excelify format
            data.append({
                "ID": item_id,
                "Command": "DELETE"
            })
        elif target_tool == "shopify_tagging":
            # Shopify Tagging Method (users upload to tag items, then filter & delete manually)
            data.append({
                "Handle": handle,
                "Tags": "OptListing_Delete"
            })
        elif target_tool == "ebay":
            data.append({
                "Action": "End",
                "ItemID": item_id
            })
        elif target_tool == "yaballe":
            data.append({
                "Monitor ID": effective_supplier_id,
                "Action": "DELETE"
            })
        else:
            raise ValueError(f"Unknown target tool: {target_tool}. Supported: autods, wholesale2b, shopify_matrixify, shopify_tagging, ebay, yaballe")
    
    df = pd.DataFrame(data)
    
    # Convert to CSV string
    output = StringIO()
    df.to_csv(output, index=False)
    return output.getvalue()

