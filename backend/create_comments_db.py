#!/usr/bin/env python3

import sqlite3
import os

def create_comments_database():
    """Create comments table in the correct SQLite database"""
    
    # Use the correct database path
    db_path = "c:/Users/Vincent/Documents/ukoni/backend/ukoni.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create comments table with proper schema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                user_id INTEGER,
                author_name VARCHAR(100) NOT NULL,
                author_email VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                ip_address VARCHAR(45),
                user_agent TEXT,
                parent_id INTEGER,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
                FOREIGN KEY (parent_id) REFERENCES comments (id)
            )
        """)
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_post_id ON comments (post_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_user_id ON comments (user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_parent_id ON comments (parent_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_status ON comments (status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_created_at ON comments (created_at)")
        
        # Insert sample comments for testing
        cursor.execute("""
            INSERT OR IGNORE INTO comments 
            (post_id, author_name, author_email, content, status) VALUES 
            (1, 'Admin User', 'admin@nntts.com', 'Great post! Thanks for sharing.', 'approved'),
            (1, 'Test User', 'test@example.com', 'This is a test comment.', 'approved'),
            (2, 'Visitor', 'visitor@example.com', 'Interesting article!', 'pending')
        """)
        
        conn.commit()
        
        # Verify table creation and data
        cursor.execute("SELECT COUNT(*) FROM comments")
        count = cursor.fetchone()[0]
        print(f"✅ Comments table created successfully!")
        print(f"📊 Total comments: {count}")
        
        # Show sample data
        cursor.execute("SELECT id, post_id, author_name, status FROM comments LIMIT 5")
        comments = cursor.fetchall()
        print("📝 Sample comments:")
        for comment in comments:
            print(f"   ID: {comment[0]}, Post: {comment[1]}, Author: {comment[2]}, Status: {comment[3]}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating comments table: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_comments_database()
