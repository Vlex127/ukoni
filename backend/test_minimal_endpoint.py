#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends
from app.db.database import get_db
from app.models.subscriber import Subscriber as SubscriberModel
from sqlalchemy.orm import Session
from app.core.config import settings

# Create a minimal test app
app = FastAPI()

@app.get("/test-count")
def test_count(db: Session = Depends(get_db)):
    """Test endpoint for subscribers count"""
    try:
        print(f"Database URL: {settings.database_url}")
        count = db.query(SubscriberModel).filter(
            SubscriberModel.status == "active"
        ).count()
        return {"count": count}
    except Exception as e:
        return {"error": str(e)}

@app.get("/test-simple")
def test_simple():
    """Test simple endpoint"""
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
