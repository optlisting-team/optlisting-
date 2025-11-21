import os
from dotenv import load_dotenv
from sqlalchemy import Column, Integer, String, Float, Date, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import date

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
    source = Column(String, nullable=False)  # "Amazon", "Walmart", "Unknown"
    price = Column(Float, nullable=False)
    date_listed = Column(Date, nullable=False)
    sold_qty = Column(Integer, default=0)
    watch_count = Column(Integer, default=0)

    def __repr__(self):
        return f"<Listing(ebay_item_id={self.ebay_item_id}, title={self.title}, source={self.source})>"


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
        Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

