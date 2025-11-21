#!/usr/bin/env python
"""
Simple script to run the FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    print("=" * 50)
    print("Starting OptListing Backend Server...")
    print("=" * 50)
    print("Backend API: http://localhost:8000")
    print("API Docs: http://localhost:8000/docs")
    print("=" * 50)
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

