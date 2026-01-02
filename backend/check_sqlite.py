#!/usr/bin/env python3

import sqlite3

def check_sqlite_db():
    """Check what's in the SQLite database"""
    db_path = "c:/Users/Vincent/Documents/ukoni/backend/ukoni.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"Tables in SQLite: {[table[0] for table in tables]}")
        
        # Check subscribers table
        cursor.execute("SELECT COUNT(*) FROM subscribers")
        count = cursor.fetchone()[0]
        print(f"Subscribers count: {count}")
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_sqlite_db()
