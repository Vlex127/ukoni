#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.database import engine
from sqlalchemy import text

def check_subscribers_schema():
    """Check the actual schema of subscribers table"""
    try:
        with engine.connect() as conn:
            print("Checking subscribers table schema...")
            
            # Get table schema
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'subscribers'
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            print("Subscribers table columns:")
            for col in columns:
                print(f"  - {col[0]}: {col[1]} (nullable: {col[2]}, default: {col[3]})")
            
            # Get sample data
            result = conn.execute(text("SELECT * FROM subscribers LIMIT 5"))
            rows = result.fetchall()
            print(f"\nSample data ({len(rows)} rows):")
            for row in rows:
                print(f"  {row}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_subscribers_schema()
