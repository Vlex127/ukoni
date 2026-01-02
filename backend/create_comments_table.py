#!/usr/bin/env python3

import sqlite3

def create_comments_table():
    """Create comments table manually"""
    db_path = "c:/Users/Vincent/Documents/ukoni/backend/ukoni.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create comments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                author_name VARCHAR(100) NOT NULL,
                author_email VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'pending' NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                parent_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                FOREIGN KEY(post_id) REFERENCES posts (id) ON DELETE CASCADE,
                FOREIGN KEY(parent_id) REFERENCES comments (id)
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_id ON comments (id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_post_id ON comments (post_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_parent_id ON comments (parent_id)")
        
        # Insert sample comment
        cursor.execute("""
            INSERT OR IGNORE INTO comments 
            (post_id, author_name, author_email, content, status) VALUES 
            (1, 'Admin User', 'admin@nntts.com', 'Great post! Thanks for sharing.', 'approved')
        """)
        
        conn.commit()
        
        # Verify table exists
        cursor.execute("SELECT COUNT(*) FROM comments")
        count = cursor.fetchone()[0]
        print(f"✅ Comments table created with {count} records")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_comments_table()
