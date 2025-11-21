import os
from dotenv import load_dotenv
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import date, datetime

# Load environment variables from .env file
load_dotenv()

Base = declarative_base()


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    ebay_item_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    marketplace = Column(String, nullable=True, default="eBay")  # "eBay", "Amazon", "Shopify", "Walmart"
    source = Column(String, nullable=False)  # "Amazon", "Walmart", "AliExpress", "CJ Dropshipping", "Home Depot", "Wayfair", "Costco", "Unknown"
    price = Column(Float, nullable=False)
    date_listed = Column(Date, nullable=False)
    sold_qty = Column(Integer, default=0)
    watch_count = Column(Integer, default=0)

    def __repr__(self):
        return f"<Listing(ebay_item_id={self.ebay_item_id}, title={self.title}, source={self.source})>"


class DeletionLog(Base):
    __tablename__ = "deletion_logs"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(String, nullable=False, index=True)  # ebay_item_id or similar
    title = Column(String, nullable=False)
    platform = Column(String, nullable=True)  # marketplace: "eBay", "Amazon", "Shopify", "Walmart"
    source = Column(String, nullable=False)  # "Amazon", "Walmart", etc.
    deleted_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<DeletionLog(item_id={self.item_id}, title={self.title}, deleted_at={self.deleted_at})>"


# Database setup
# Use Supabase PostgreSQL if DATABASE_URL is set, otherwise fall back to SQLite
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Supabase PostgreSQL connection
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=5,
        max_overflow=10
    )
else:
    # Fallback to SQLite for local development
    SQLALCHEMY_DATABASE_URL = "sqlite:///./optlisting.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initialize database and create tables"""
    # Note: For Supabase, tables are managed via migrations
    # This function is kept for SQLite compatibility
    if not DATABASE_URL:  # Only create tables if using SQLite
        # Drop and recreate tables to ensure schema is up to date
        # This is safe for development with dummy data
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

