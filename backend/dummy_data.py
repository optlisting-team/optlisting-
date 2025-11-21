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
            
            # Random marketplace (eBay, Amazon, Shopify, Walmart)
            marketplaces = ["eBay", "Amazon", "Shopify", "Walmart"]
            marketplace = random.choice(marketplaces)
            
            # Determine source (diverse suppliers)
            # Amazon: 20%, Walmart: 15%, AliExpress: 20%, CJ Dropshipping: 15%, 
            # Home Depot: 10%, Wayfair: 8%, Costco: 7%, Unknown: 5%
            source_rand = random.random()
            if source_rand < 0.20:
                source = "Amazon"
                sku = f"AMZ{random.randint(100000, 999999)}"
                image_url = f"https://ssl-images-amazon.com/images/I/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.35:
                source = "Walmart"
                sku = f"WM{random.randint(100000, 999999)}"
                image_url = f"https://i5.walmartimages.com/asr/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.55:
                source = "AliExpress"
                sku = f"AE{random.randint(100000, 999999)}"
                image_url = f"https://ae01.alicdn.com/kf/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.70:
                source = "CJ Dropshipping"
                sku = f"CJ{random.randint(100000, 999999)}"
                image_url = f"https://cdn.cjdropshipping.com/images/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.80:
                source = "Home Depot"
                sku = f"HD{random.randint(100000, 999999)}"
                image_url = f"https://images.homedepot-static.com/productImages/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.88:
                source = "Wayfair"
                sku = f"WF{random.randint(100000, 999999)}"
                image_url = f"https://images.wayfair.com/images/{random.randint(100000, 999999)}.jpg"
            elif source_rand < 0.95:
                source = "Costco"
                sku = f"CO{random.randint(100000, 999999)}"
                image_url = f"https://images.costco-static.com/{random.randint(100000, 999999)}.jpg"
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
            
            # eBay item ID (unique for up to 99999 items)
            ebay_item_id = f"123456789{i:05d}"
            
            listing = Listing(
                ebay_item_id=ebay_item_id,
                title=title,
                sku=sku,
                image_url=image_url,
                marketplace=marketplace,
                source=source,
                price=price,
                date_listed=date_listed,
                sold_qty=sold_qty,
                watch_count=watch_count
            )
            
            batch_listings.append(listing)
        
        # Add batch to database
        db.add_all(batch_listings)
        db.commit()
        listings.extend(batch_listings)
        
        # Progress indicator
        if (batch_num + 1) % 5 == 0 or batch_num == total_batches - 1:
            print(f"Generated {batch_end}/{count} listings... ({((batch_num + 1) / total_batches * 100):.1f}%)")
    
    print(f"Successfully generated {count} dummy listings")
    return listings

