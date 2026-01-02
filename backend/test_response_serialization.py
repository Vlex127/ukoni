#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.database import engine
from app.models.subscriber import Subscriber as SubscriberModel
from sqlalchemy.orm import Session
import json

def test_response_serialization():
    """Test response serialization"""
    print("Testing response serialization...")
    
    try:
        with engine.connect() as conn:
            db = Session(bind=conn)
            
            try:
                # Test the query
                count = db.query(SubscriberModel).filter(
                    SubscriberModel.status == "active"
                ).count()
                print(f"Query result: {count}")
                
                # Test JSON serialization
                result = {"count": count}
                json_str = json.dumps(result)
                print(f"JSON serialization successful: {json_str}")
                
                # Test model serialization
                subscriber = db.query(SubscriberModel).first()
                if subscriber:
                    print(f"Subscriber object: {subscriber}")
                    print(f"Subscriber dict: {subscriber.__dict__}")
                    
            except Exception as e:
                print(f"❌ Serialization failed: {e}")
                import traceback
                traceback.print_exc()
            finally:
                db.close()
                
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_response_serialization()
