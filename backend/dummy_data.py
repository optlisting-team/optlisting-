from datetime import date, timedelta, datetime
import random
import json
from sqlalchemy.orm import Session
from backend.models import Listing
from backend.services import extract_supplier_info, upsert_listings


def generate_dummy_listings(db: Session, count: int = 50, user_id: str = "default-user"):
    """
    Generate dummy listings for testing with new hybrid schema
    Mix of Amazon/Walmart, some zombies, some active
    
    Args:
        db: Database session
        count: Number of listings to generate
        user_id: User ID for the listings (default: "default-user")
    
    Note: Table clearing is handled in the API endpoint (create_dummy_data)
    to ensure clean state before generating test data.
    """
    # Sample data
    titles = [
        "Wireless Bluetooth Headphones",
        "USB-C Charging Cable 6ft",
        "Phone Case with Screen Protector",
        "Laptop Stand Adjustable",
        "Mechanical Keyboard RGB",
        "Wireless Mouse Ergonomic",
        "HDMI Cable 4K 10ft",
        "Webcam 1080p HD",
        "USB Hub 4 Port",
        "Laptop Cooling Pad",
        "Phone Mount Car Vent",
        "Tablet Stand Adjustable",
        "Cable Management Box",
        "Desk Organizer Set",
        "Monitor Stand Riser"
    ]
    
    listings = []
    today = date.today()
    
    # Batch processing for large counts (5000 items)
    batch_size = 500
    total_batches = (count + batch_size - 1) // batch_size
    
    for batch_num in range(total_batches):
        batch_start = batch_num * batch_size
        batch_end = min(batch_start + batch_size, count)
        batch_listings = []
        
        for i in range(batch_start, batch_end):
            # Random title
            title = random.choice(titles) + f" - Model {i+1}"
            
            # MVP Scope: Only eBay and Shopify
            # eBay: 60% (Primary), Shopify: 40% (Secondary)
            marketplace_rand = random.random()
            if marketplace_rand < 0.6:
                marketplace = "eBay"
            else:
                marketplace = "Shopify"
            
            # MVP Scope: Final 7 Suppliers Only
            # Weighted distribution:
            # Amazon: 25%, AliExpress: 25% (Retail/China - High volume)
            # Walmart: 15%, CJ Dropshipping: 15% (Retail/China - Medium volume)
            # Home Depot: 8%, Wholesale2B: 7%, Costway: 5% (Pro/Others - Remaining %)
            source_rand = random.random()
            brand = None
            upc = None
            
            if source_rand < 0.25:
                # Amazon: 25% - Retail
                source = "Amazon"
                sku = f"AMZ{random.randint(100000, 999999)}"
                image_url = f"https://ssl-images-amazon.com/images/I/{random.randint(100000, 999999)}.jpg"
                if random.random() < 0.3:  # 30% chance
                    brand = random.choice(["AmazonBasics", "Solimo", "Happy Belly"])
            elif source_rand < 0.50:
                # AliExpress: 25% - China
                source = "AliExpress"
                sku = f"AE{random.randint(100000, 999999)}"
                image_url = f"https://ae01.alicdn.com/kf/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.65:
                # Walmart: 15% - Retail
                source = "Walmart"
                sku = f"WM{random.randint(100000, 999999)}"
                image_url = f"https://i5.walmartimages.com/asr/{random.randint(100000, 999999)}.jpg"
                if random.random() < 0.4:  # 40% chance
                    brand = random.choice(["Mainstays", "Great Value", "Equate", "Pen+Gear", "Hyper Tough"])
                    if random.random() < 0.2:  # 20% chance
                        upc = f"681131{random.randint(100000, 999999)}"
            elif source_rand < 0.80:
                # CJ Dropshipping: 15% - China
                source = "CJ Dropshipping"
                sku = f"CJ{random.randint(100000, 999999)}"
                image_url = f"https://cdn.cjdropshipping.com/images/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.88:
                # Home Depot: 8% - Retail
                source = "Home Depot"
                sku = f"HD{random.randint(100000, 999999)}"
                image_url = f"https://images.homedepot-static.com/productImages/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.95:
                # Wholesale2B: 7% - Pro
                source = "Wholesale2B"
                sku = f"W2B{random.randint(100000, 999999)}"
                image_url = f"https://wholesale2b.com/images/{random.randint(100000, 999999)}.jpg"
            else:
                # Costway: 5% - Pro
                source = "Costway"
                sku = f"CW{random.randint(100000, 999999)}"
                image_url = f"https://costway.com/images/{random.randint(100000, 999999)}.jpg"
            
            # Random price
            price = round(random.uniform(9.99, 199.99), 2)
            
            # Date listed (mix of old and new)
            # 60% zombies (old), 40% active (recent)
            is_zombie = random.random() < 0.6
            if is_zombie:
                days_ago = random.randint(61, 180)  # 61-180 days ago
            else:
                days_ago = random.randint(1, 59)  # 1-59 days ago
            
            date_listed = today - timedelta(days=days_ago)
            
            # Sold quantity (zombies have 0, active might have some)
            if is_zombie:
                sold_qty = 0
            else:
                sold_qty = random.randint(0, 10)
            
            # Watch count
            watch_count = random.randint(0, 50)
            
            # Item ID (unique for up to 99999 items)
            item_id = f"123456789{i:05d}"
            
            # Update title to include brand if available (for forensic detection)
            if brand:
                title = f"{brand} {title}"
            
            # Extract supplier info using extract_supplier_info function
            supplier_name, supplier_id = extract_supplier_info(
                sku=sku,
                image_url=image_url,
                title=title,
                brand=brand,
                upc=upc
            )
            
            # Build metrics JSONB
            metrics = {
                "sales": sold_qty,
                "views": watch_count,
                "price": price,
                "currency": "USD",
                "date_listed": date_listed.isoformat() if date_listed else None
            }
            
            # Build raw_data JSONB (simulated API response)
            raw_data = {
                "item_id": item_id,
                "title": title,
                "sku": sku,
                "image_url": image_url,
                "price": price,
                "date_listed": date_listed.isoformat() if date_listed else None,
                "sold_qty": sold_qty,
                "watch_count": watch_count,
                "platform": marketplace,
                "supplier": source,
                "brand": brand,
                "upc": upc
            }
            
            listing = Listing(
                user_id=user_id,
                platform=marketplace,
                item_id=item_id,
                title=title,
                sku=sku,
                image_url=image_url,
                supplier_name=supplier_name,
                supplier_id=supplier_id,
                brand=brand,
                upc=upc,
                metrics=metrics,
                raw_data=raw_data,
                last_synced_at=datetime.utcnow(),
                # Legacy fields for backward compatibility
                price=price,
                date_listed=date_listed,
                sold_qty=sold_qty,
                watch_count=watch_count
            )
            
            batch_listings.append(listing)
        
        # Upsert batch to database (handles duplicates gracefully)
        upsert_listings(db, batch_listings)
        listings.extend(batch_listings)
        
        # Progress indicator
        if (batch_num + 1) % 5 == 0 or batch_num == total_batches - 1:
            print(f"Generated {batch_end}/{count} listings... ({((batch_num + 1) / total_batches * 100):.1f}%)")
    
    print(f"Successfully generated {count} dummy listings")
    return listings

