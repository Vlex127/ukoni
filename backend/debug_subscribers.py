#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.database import engine, get_db
from app.models.subscriber import Subscriber as SubscriberModel
from sqlalchemy.orm import Session

def debug_subscribers_endpoint():
    """Debug the subscribers count endpoint"""
    print("Debugging subscribers endpoint...")
    print(f"Database URL: {settings.database_url}")
    
    try:
        # Test database connection
        with engine.connect() as conn:
            print("✅ Database connection successful")
            
            # Test the actual query that the endpoint uses
            db = Session(bind=conn)
            try:
                print("Testing subscribers count query...")
                count = db.query(SubscriberModel).filter(
                    SubscriberModel.status == "active"
                ).count()
                print(f"✅ Query successful: {count} active subscribers")
                
                # Test the model properties
                print("Testing model properties...")
                subscriber = db.query(SubscriberModel).first()
                if subscriber:
                    print(f"Sample subscriber: {subscriber.email}")
                    print(f"Status: {subscriber.status}")
                    print(f"is_active property: {subscriber.is_active}")
                else:
                    print("No subscribers found")
                    
            except Exception as e:
                print(f"❌ Query failed: {e}")
                import traceback
                traceback.print_exc()
            finally:
                db.close()
                
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_subscribers_endpoint()
