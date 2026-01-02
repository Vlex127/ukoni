#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.analytics import Analytics

def check_analytics_data():
    """Check what's in the analytics table"""
    
    db = next(get_db())
    
    try:
        # Get all analytics records
        analytics = db.query(Analytics).all()
        
        print(f"📊 Total Analytics Records: {len(analytics)}")
        
        for i, record in enumerate(analytics[:10]):  # Show first 10
            print(f"   {i+1}. ID: {record.id}, Date: {record.date}, URL: {record.url}, Referrer: {record.referrer}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_analytics_data()
