#!/usr/bin/env python3

import sqlite3

def check_backend_analytics():
    """Check analytics in the backend database"""
    
    db_path = "c:/Users/Vincent/Documents/ukoni/backend/ukoni.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check analytics table
        cursor.execute("SELECT COUNT(*) FROM analytics")
        count = cursor.fetchone()[0]
        print(f"📊 Analytics Records in Backend DB: {count}")
        
        if count > 0:
            cursor.execute("SELECT id, date, url, referrer FROM analytics LIMIT 5")
            records = cursor.fetchall()
            for record in records:
                print(f"   ID: {record[0]}, Date: {record[1]}, URL: {record[2]}, Referrer: {record[3]}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_backend_analytics()
