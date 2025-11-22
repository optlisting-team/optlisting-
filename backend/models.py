import os
from dotenv import load_dotenv
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, create_engine, Index, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import date, datetime
import uuid

# Load environment variables from .env file
load_dotenv()

Base = declarative_base()


class Listing(Base):
    __tablename__ = "listings"

    # Core Columns
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)  # UUID as string for compatibility
    platform = Column(String, nullable=False)  # "eBay", "Shopify", etc.
    item_id = Column(String, nullable=False)  # External platform ID (eBay ItemID, Shopify Product ID, etc.)
    
    # Basic Info
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    sku = Column(String, nullable=False)
    
    # Source Detection (CRITICAL)
    source_name = Column(String, nullable=False)  # Detected Source: "Amazon", "Walmart", "Unverified", etc.
    source_id = Column(String, nullable=True)  # Extracted Source ID: ASIN "B08...", Walmart ID, etc.
    
    # Metadata
    brand = Column(String, nullable=True)  # Brand name for forensic source detection
    upc = Column(String, nullable=True)  # UPC/EAN code for source identification
    
    # Metrics (stored as JSONB for flexibility)
    metrics = Column(JSONB, nullable=True, default={})  # {"sales": 0, "views": 10, "price": 29.99, "currency": "USD"}
    
    # Raw Data (full API response backup)
    raw_data = Column(JSONB, nullable=True)  # Store complete original API response
    
    # Timestamps
    last_synced_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Legacy fields for backward compatibility (deprecated, use metrics instead)
    price = Column(Float, nullable=True)  # Use metrics['price'] instead
    date_listed = Column(Date, nullable=True)  # Use metrics['date_listed'] instead
    sold_qty = Column(Integer, default=0)  # Use metrics['sales'] instead
    watch_count = Column(Integer, default=0)  # Use metrics['views'] instead
    
    # Unique constraint: prevent duplicates per user/platform/item_id
    __table_args__ = (
        Index('idx_user_platform_item', 'user_id', 'platform', 'item_id', unique=True),
    )

    def __repr__(self):
        return f"<Listing(platform={self.platform}, item_id={self.item_id}, source_name={self.source_name}, source_id={self.source_id})>"


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

