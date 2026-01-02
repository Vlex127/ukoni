#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.api.v1.endpoints.subscribers import get_subscribers_count
from app.db.database import get_db

def test_subscribers_endpoint_directly():
    """Test the subscribers endpoint function directly"""
    print("Testing subscribers endpoint function directly...")
    
    try:
        # Get database session
        db_gen = get_db()
        db = next(db_gen)
        
        try:
            # Call the endpoint function directly
            result = get_subscribers_count(db=db)
            print(f"✅ Endpoint function successful: {result}")
            
        except Exception as e:
            print(f"❌ Endpoint function failed: {e}")
            import traceback
            traceback.print_exc()
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Database session failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_subscribers_endpoint_directly()
