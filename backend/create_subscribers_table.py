#!/usr/bin/env python3

import sqlite3

def create_subscribers_table():
    """Create subscribers table manually"""
    db_path = "c:/Users/Vincent/Documents/ukoni/backend/ukoni.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create subscribers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_subscribers_email ON subscribers (email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_subscribers_id ON subscribers (id)")
        
        # Insert sample data
        cursor.execute("""
            INSERT OR IGNORE INTO subscribers (email, is_active) VALUES 
            ('admin@nntts.com', 1),
            ('test@example.com', 1)
        """)
        
        conn.commit()
        
        # Verify table exists
        cursor.execute("SELECT COUNT(*) FROM subscribers")
        count = cursor.fetchone()[0]
        print(f"✅ Subscribers table created with {count} records")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_subscribers_table()
