from datetime import date, timedelta, datetime
from typing import List, Optional, Dict, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, cast, Integer, String, Date
from sqlalchemy.dialects.postgresql import insert
from backend.models import Listing, DeletionLog
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


def check_global_health(
    db: Session,
    user_id: str,
    supplier_id: Optional[str]
) -> bool:
    """
    Cross-Platform Health Check: Detect "Global Winners"
    
    Checks if a supplier_id is selling well across ALL of the user's connected stores
    (regardless of platform). This prevents accidental deletion of profitable items
    that are failing locally but succeeding globally.
    
    Args:
        db: Database session
        user_id: User ID to check across all their stores
        supplier_id: Supplier ID to check (e.g., ASIN "B08...", Walmart ID, etc.)
    
    Returns:
        True if SUM(sales) > 20 across all stores (Global Winner), False otherwise
    
    Logic:
        - Sum sales volume for the given supplier_id across ALL stores/platforms for this user
        - If total sales > 20 (threshold), return True (Global Winner)
        - Uses metrics['sales'] or legacy sold_qty field
    """
    if not supplier_id:
        return False
    
    # Query all listings for this user with matching supplier_id across ALL stores/platforms
    query = db.query(Listing).filter(
        Listing.user_id == user_id,
        Listing.supplier_id == supplier_id
    )
    
    all_listings = query.all()
    
    # Sum sales across all listings for this supplier_id
    total_sales = 0
    for listing in all_listings:
        # Try metrics['sales'] first, then fallback to sold_qty
        if listing.metrics and isinstance(listing.metrics, dict) and 'sales' in listing.metrics:
            sales = listing.metrics.get('sales', 0)
            if isinstance(sales, (int, float)):
                total_sales += int(sales)
        elif hasattr(listing, 'sold_qty') and listing.sold_qty:
            total_sales += listing.sold_qty or 0
    
    # Threshold: 20 sales across all platforms = Global Winner
    return total_sales > 20


def analyze_zombie_listings(
    db: Session,
    user_id: str,
    min_days: int = 60,
    max_sales: int = 0,
    max_watch_count: int = 10,
    supplier_filter: str = "All",
    platform_filter: str = "eBay",  # MVP Scope: Default to eBay (only eBay and Shopify supported)
    store_id: Optional[str] = None
) -> Tuple[List[Listing], Dict[str, int]]:
    """
    Low Interest Items Filter Logic (formerly Zombie Filter)
    Filters listings based on dynamic criteria using new hybrid schema.
    
    Uses metrics JSONB field for flexible filtering:
    - date_listed > min_days days ago (from metrics or legacy date_listed)
    - sales <= max_sales (from metrics['sales'] or legacy sold_qty)
    - views <= max_watch_count (from metrics['views'] or legacy watch_count)
    - supplier_name matches supplier_filter (if not "All")
    - platform matches platform_filter (MVP Scope: "eBay" or "Shopify" only)
    
    Returns:
        Tuple of (list of zombie listings, breakdown dictionary by platform)
        Example: ([Listing, ...], {"eBay": 150, "Shopify": 23})
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
    
    # Apply store filter if store_id is provided and not 'all'
    if store_id and store_id != 'all':
        # Note: Assuming there's a store_id column in Listing model
        # If not, this will need to be adjusted based on actual schema
        # For now, we'll skip this filter if store_id column doesn't exist
        if hasattr(Listing, 'store_id'):
            query = query.filter(Listing.store_id == store_id)
    # If store_id is 'all' or None, DO NOT filter by store (return all for user)
    
    # Date filter: use metrics['date_listed'] (JSONB) or fallback to date_listed/last_synced_at
    # Safely handle cases where date_listed column may not exist
    date_filters = [
        # Use metrics JSONB if available
        and_(
            Listing.metrics != None,
            Listing.metrics.has_key('date_listed'),
            cast(Listing.metrics['date_listed'].astext, Date) < cutoff_date
        )
    ]
    
    # Add fallback to date_listed if column exists (legacy support)
    if hasattr(Listing, 'date_listed'):
        date_filters.append(
            and_(
                or_(
                    Listing.metrics == None,
                    ~Listing.metrics.has_key('date_listed')
                ),
                Listing.date_listed != None,
                Listing.date_listed < cutoff_date
            )
        )
    
    # Always add last_synced_at as final fallback
    date_filters.append(
        and_(
            or_(
                Listing.metrics == None,
                ~Listing.metrics.has_key('date_listed')
            ),
            or_(
                not hasattr(Listing, 'date_listed'),
                Listing.date_listed == None
            ),
            Listing.last_synced_at < cutoff_date
        )
    )
    
    query = query.filter(or_(*date_filters))
    
    # Sales filter: use metrics['sales'] (JSONB only)
    # If metrics doesn't have sales, assume 0 (which satisfies <= max_sales when max_sales >= 0)
    sales_filters = []
    if max_sales >= 0:
        # Items with metrics['sales'] <= max_sales
        sales_filters.append(
            and_(
                Listing.metrics != None,
                Listing.metrics.has_key('sales'),
                cast(Listing.metrics['sales'].astext, Integer) <= max_sales
            )
        )
        # Items without metrics or without sales key (assume 0, which satisfies <= max_sales)
        sales_filters.append(
            or_(
                Listing.metrics == None,
                ~Listing.metrics.has_key('sales')
            )
        )
    if sales_filters:
        query = query.filter(or_(*sales_filters))
    
    # Watch count filter: use metrics['views'] (JSONB only)
    # If metrics doesn't have views, assume 0 (which satisfies <= max_watch_count when max_watch_count >= 0)
    views_filters = []
    if max_watch_count >= 0:
        # Items with metrics['views'] <= max_watch_count
        views_filters.append(
            and_(
                Listing.metrics != None,
                Listing.metrics.has_key('views'),
                cast(Listing.metrics['views'].astext, Integer) <= max_watch_count
            )
        )
        # Items without metrics or without views key (assume 0, which satisfies <= max_watch_count)
        views_filters.append(
            or_(
                Listing.metrics == None,
                ~Listing.metrics.has_key('views')
            )
        )
    if views_filters:
        query = query.filter(or_(*views_filters))
    
    # Apply platform filter (MVP Scope: Only eBay and Shopify)
    if platform_filter and platform_filter in ["eBay", "Shopify"]:
        query = query.filter(Listing.platform == platform_filter)
    
    # Apply supplier filter if not "All"
    if supplier_filter and supplier_filter != "All":
        query = query.filter(Listing.supplier_name == supplier_filter)
    
    zombies = query.all()
    
    # Get current platform(s) being analyzed
    current_platforms = set()
    if platform_filter and platform_filter != "All":
        current_platforms.add(platform_filter)
    else:
        # If filtering all platforms, get all platforms from zombies
        current_platforms = {z.platform for z in zombies}
    
    # Cross-Platform Health Check & Activity Check: Check each zombie
    for zombie in zombies:
        # Check if this supplier_id is a global winner across all stores
        is_global_winner = check_global_health(db, user_id, zombie.supplier_id)
        
        # Set the is_global_winner flag
        zombie.is_global_winner = 1 if is_global_winner else 0
        
        # Cross-Platform Activity Check: Check if this zombie is active elsewhere
        is_active_elsewhere = False
        if zombie.supplier_id:
            # Find all other listings with the same supplier_id in OTHER platforms
            other_listings_query = db.query(Listing).filter(
                Listing.user_id == user_id,
                Listing.supplier_id == zombie.supplier_id,
                Listing.platform != zombie.platform  # Different platform/store
            )
            other_listings = other_listings_query.all()
            
            # Check if ANY of these other listings are NOT zombies (active)
            for other_listing in other_listings:
                # Get sales, views, and age
                other_sales = 0
                other_views = 0
                other_date_listed = None
                
                if other_listing.metrics and isinstance(other_listing.metrics, dict):
                    other_sales = other_listing.metrics.get('sales', 0) or 0
                    other_views = other_listing.metrics.get('views', 0) or 0
                    if 'date_listed' in other_listing.metrics:
                        date_val = other_listing.metrics['date_listed']
                        if isinstance(date_val, date):
                            other_date_listed = date_val
                        elif isinstance(date_val, str):
                            try:
                                other_date_listed = datetime.strptime(date_val, '%Y-%m-%d').date()
                            except:
                                pass
                else:
                    other_sales = getattr(other_listing, 'sold_qty', 0) or 0
                    other_views = getattr(other_listing, 'watch_count', 0) or 0
                    other_date_listed = getattr(other_listing, 'date_listed', None)
                
                # Calculate age
                if other_date_listed:
                    age_days = (date.today() - other_date_listed).days
                else:
                    # Use last_synced_at as fallback
                    if other_listing.last_synced_at:
                        age_days = (date.today() - other_listing.last_synced_at.date()).days
                    else:
                        age_days = 999  # Very old if no date
                
                # Check if this listing is NOT a zombie (active)
                # Active if: Sales > 0 OR Views > 10 OR Age < 3 days
                is_active = (
                    other_sales > 0 or
                    other_views > 10 or
                    age_days < 3
                )
                
                if is_active:
                    is_active_elsewhere = True
                    break  # Found at least one active listing elsewhere
        
        # Set the is_active_elsewhere flag
        zombie.is_active_elsewhere = 1 if is_active_elsewhere else 0
        
        # Commit the update to database
        db.commit()
    
    # Sort zombies: Primary by is_active_elsewhere (DESC - True first), Secondary by age (oldest first)
    def sort_key(z):
        # Primary: is_active_elsewhere (True = 1, False = 0, so DESC means True comes first)
        # Secondary: age (oldest first)
        is_active = getattr(z, 'is_active_elsewhere', 0)
        
        # Calculate age for secondary sort
        z_date_listed = None
        if z.metrics and isinstance(z.metrics, dict) and 'date_listed' in z.metrics:
            date_val = z.metrics['date_listed']
            if isinstance(date_val, date):
                z_date_listed = date_val
            elif isinstance(date_val, str):
                try:
                    z_date_listed = datetime.strptime(date_val, '%Y-%m-%d').date()
                except:
                    pass
        if not z_date_listed:
            z_date_listed = getattr(z, 'date_listed', None)
        if not z_date_listed and z.last_synced_at:
            z_date_listed = z.last_synced_at.date()
        
        age_days = (date.today() - z_date_listed).days if z_date_listed else 999
        
        # Return tuple: (negative is_active for DESC, age_days for ASC)
        return (-is_active, age_days)
    
    zombies = sorted(zombies, key=sort_key)
    
    # Calculate Store-Level Breakdown: Group zombies by platform
    zombie_breakdown = {}
    for zombie in zombies:
        platform = zombie.platform or "Unknown"
        zombie_breakdown[platform] = zombie_breakdown.get(platform, 0) + 1
    
    return zombies, zombie_breakdown


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
    target_tool: str,
    db: Optional[Session] = None,
    user_id: str = "default-user",
    mode: str = "delete_list",
    store_id: Optional[str] = None
) -> str:
    """
    CSV Export for Dropshipping Automation Tools Only
    
    MVP Focus: High-Volume Dropshippers using automation tools.
    All exports are tool-specific formats - no generic/fallback formats.
    
    Supported export formats:
    1. AutoDS: Headers: "Source ID", "File Action" | Data: supplier_id, "delete"
    2. Wholesale2B: Headers: "SKU", "Action" | Data: sku, "Delete"
    3. Shopify (Matrixify/Excelify): Headers: "ID", "Command" | Data: item_id, "DELETE"
    4. Shopify (Tagging Method): Headers: "Handle", "Tags" | Data: handle/sku, "OptListing_Delete"
    5. eBay File Exchange: Headers: "Action", "ItemID" | Data: "End", item_id
    6. Yaballe: Headers: "Monitor ID", "Action" | Data: supplier_id, "DELETE"
    
    Args:
        listings: List of Listing objects or dictionaries (items to delete OR items to exclude in full_sync mode)
        target_tool: Tool name (e.g., "autods", "wholesale2b", "shopify_matrixify", "shopify_tagging", "ebay", "yaballe")
        db: Optional database session for logging deletions with snapshots and fetching all listings
        user_id: User ID for deletion logging and fetching listings
        mode: Export mode - "delete_list" (default) exports items to delete, "full_sync_list" exports survivors (all items except provided list)
        store_id: Optional store ID filter for full_sync_list mode
    
    Returns:
        CSV string in tool-specific format
    
    Note: Assumes 100% of items are from supported Dropshipping Tools (no manual/direct listings).
    """
    # Full Sync Mode: Export all active listings EXCEPT the provided list
    if mode == "full_sync_list" and db:
        # Get all active listings for this user/store
        query = db.query(Listing).filter(Listing.user_id == user_id)
        
        # Apply store filter if provided and not 'all'
        if store_id and store_id != 'all':
            if hasattr(Listing, 'store_id'):
                query = query.filter(Listing.store_id == store_id)
        
        all_listings = query.all()
        
        # Extract item IDs from the exclusion list (zombies to remove)
        exclusion_item_ids = set()
        for listing in listings:
            if isinstance(listing, dict):
                item_id = listing.get("item_id") or listing.get("ebay_item_id", "")
            else:
                item_id = listing.item_id if hasattr(listing, 'item_id') else (listing.ebay_item_id if hasattr(listing, 'ebay_item_id') else "")
            if item_id:
                exclusion_item_ids.add(item_id)
        
        # Filter out excluded items (survivors only)
        survivor_listings = [
            listing for listing in all_listings
            if listing.item_id not in exclusion_item_ids
        ]
        
        # Use survivors as the export list (no deletion logging for full sync mode)
        listings = survivor_listings
    elif not listings:
        return ""
    
    # Log deletions with snapshots BEFORE generating CSV (only for delete_list mode)
    if db and mode == "delete_list":
        deletion_logs = []
        for listing in listings:
            # Extract data for snapshot
            if isinstance(listing, dict):
                item_id = listing.get("item_id") or listing.get("ebay_item_id", "")
                title = listing.get("title", "Unknown")
                platform = listing.get("platform") or listing.get("marketplace", "eBay")
                supplier = listing.get("supplier") or listing.get("supplier_name") or listing.get("source", "Unknown")
                price = listing.get("price") or (listing.get("metrics", {}).get("price") if isinstance(listing.get("metrics"), dict) else None)
                views = listing.get("watch_count") or listing.get("views") or (listing.get("metrics", {}).get("views") if isinstance(listing.get("metrics"), dict) else None)
                sales = listing.get("sold_qty") or listing.get("sales") or (listing.get("metrics", {}).get("sales") if isinstance(listing.get("metrics"), dict) else None)
                metrics = listing.get("metrics", {}) if isinstance(listing.get("metrics"), dict) else {}
            else:
                item_id = listing.item_id if hasattr(listing, 'item_id') else (listing.ebay_item_id if hasattr(listing, 'ebay_item_id') else "")
                title = listing.title if hasattr(listing, 'title') else "Unknown"
                platform = listing.platform if hasattr(listing, 'platform') else (listing.marketplace if hasattr(listing, 'marketplace') else "eBay")
                supplier = listing.supplier_name if hasattr(listing, 'supplier_name') else (listing.source_name if hasattr(listing, 'source_name') else (listing.source if hasattr(listing, 'source') else "Unknown"))
                price = getattr(listing, 'price', None) or (listing.metrics.get('price') if listing.metrics and isinstance(listing.metrics, dict) else None)
                views = getattr(listing, 'watch_count', None) or (listing.metrics.get('views') if listing.metrics and isinstance(listing.metrics, dict) else None)
                sales = getattr(listing, 'sold_qty', None) or (listing.metrics.get('sales') if listing.metrics and isinstance(listing.metrics, dict) else None)
                metrics = listing.metrics if listing.metrics and isinstance(listing.metrics, dict) else {}
            
            # Create snapshot with current item state
            snapshot = {
                "price": price,
                "views": views,
                "sales": sales,
                "title": title,
                "supplier": supplier,
                "platform": platform,
                "metrics": metrics
            }
            
            # Create DeletionLog entry with snapshot
            log_entry = DeletionLog(
                item_id=item_id,
                title=title,
                platform=platform,
                supplier=supplier,
                snapshot=snapshot
            )
            deletion_logs.append(log_entry)
        
        # Bulk insert deletion logs
        if deletion_logs:
            db.add_all(deletion_logs)
            db.commit()
    
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
        
        # Use supplier_id if available, otherwise use SKU (both work with automation tools)
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

