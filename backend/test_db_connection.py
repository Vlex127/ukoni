#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.database import engine
from sqlalchemy import inspect, text

def test_database_connection():
    """Test database connection and check tables"""
    print(f"Database URL: {settings.database_url}")
    print(f"USE_SQLITE: {settings.USE_SQLITE}")
    print(f"NEON_DATABASE_URL: {settings.NEON_DATABASE_URL}")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    
    try:
        # Test connection
        with engine.connect() as conn:
            print("✅ Database connection successful")
            
            # Check database type
            if "sqlite" in str(engine.url):
                result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
                tables = [row[0] for row in result.fetchall()]
            else:
                # PostgreSQL query
                inspector = inspect(engine)
                tables = inspector.get_table_names()
            
            print(f"Tables in database: {tables}")
            
            # Check if subscribers table exists
            if 'subscribers' in tables:
                print("✅ Subscribers table exists")
                
                # Count subscribers
                if "sqlite" in str(engine.url):
                    result = conn.execute(text("SELECT COUNT(*) FROM subscribers"))
                else:
                    result = conn.execute(text("SELECT COUNT(*) FROM subscribers"))
                count = result.fetchone()[0]
                print(f"Total subscribers: {count}")
                
                # Count active subscribers
                if "sqlite" in str(engine.url):
                    result = conn.execute(text("SELECT COUNT(*) FROM subscribers WHERE is_active = 1"))
                else:
                    result = conn.execute(text("SELECT COUNT(*) FROM subscribers WHERE is_active = true"))
                active_count = result.fetchone()[0]
                print(f"Active subscribers: {active_count}")
            else:
                print("❌ Subscribers table does not exist")
                
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    test_database_connection()
