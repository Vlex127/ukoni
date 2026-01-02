#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.database import get_db, engine
from app.models.analytics import Analytics
from sqlalchemy import func, and_

def debug_analytics():
    """Debug the analytics data structure"""
    
    db = next(get_db())
    
    try:
        # Get some sample data
        result = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('total_visitors')
        ).limit(5).all()
        
        print("🔍 Debug Analytics Data:")
        for item in result:
            print(f"   Date: {item.date}, Type: {type(item.date)}, Total: {item.total_visitors}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_analytics()
