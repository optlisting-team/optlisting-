from datetime import date, timedelta
import random
from sqlalchemy.orm import Session
from models import Listing


def generate_dummy_listings(db: Session, count: int = 50):
    """
    Generate dummy listings for testing
    Mix of Amazon/Walmart, some zombies, some active
    """
    # Clear existing data
    db.query(Listing).delete()
    db.commit()
    
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
    
    for i in range(count):
        # Random title
        title = random.choice(titles) + f" - Model {i+1}"
        
        # Determine source (40% Amazon, 30% Walmart, 30% Unknown)
        source_rand = random.random()
        if source_rand < 0.4:
            source = "Amazon"
            sku = f"AMZ{random.randint(100000, 999999)}"
            image_url = f"https://ssl-images-amazon.com/images/I/{random.randint(100000, 999999)}.jpg"
        elif source_rand < 0.7:
            source = "Walmart"
            sku = f"WM{random.randint(100000, 999999)}"
            image_url = f"https://i5.walmartimages.com/asr/{random.randint(100000, 999999)}.jpg"
        else:
            source = "Unknown"
            sku = f"SKU{random.randint(100000, 999999)}"
            image_url = f"https://example.com/images/{random.randint(100000, 999999)}.jpg"
        
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
        
        # eBay item ID
        ebay_item_id = f"123456789{i:03d}"
        
        listing = Listing(
            ebay_item_id=ebay_item_id,
            title=title,
            sku=sku,
            image_url=image_url,
            source=source,
            price=price,
            date_listed=date_listed,
            sold_qty=sold_qty,
            watch_count=watch_count
        )
        
        listings.append(listing)
    
    db.add_all(listings)
    db.commit()
    
    print(f"Generated {count} dummy listings")
    return listings

