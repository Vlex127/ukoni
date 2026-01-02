#!/usr/bin/env python3

import sqlite3

def update_comments_table():
    """Update comments table to add user_id column and proper indexes"""
    
    db_path = "c:/Users/Vincent/Documents/ukoni/backend/ukoni.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Add user_id column if it doesn't exist
        cursor.execute("ALTER TABLE comments ADD COLUMN user_id INTEGER")
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_comments_post_id ON comments (post_id)")
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
        
        # Verify table structure and data
        cursor.execute("SELECT COUNT(*) FROM comments")
        count = cursor.fetchone()[0]
        print(f"✅ Comments table updated successfully!")
        print(f"📊 Total comments: {count}")
        
        # Show table structure
        cursor.execute("PRAGMA table_info(comments)")
        columns = cursor.fetchall()
        print("📋 Table structure:")
        for col in columns:
            print(f"   {col[1]} ({col[2]})")
        
        # Show sample data
        cursor.execute("SELECT id, post_id, author_name, status FROM comments LIMIT 5")
        comments = cursor.fetchall()
        print("📝 Sample comments:")
        for comment in comments:
            print(f"   ID: {comment[0]}, Post: {comment[1]}, Author: {comment[2]}, Status: {comment[3]}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error updating comments table: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_comments_table()
