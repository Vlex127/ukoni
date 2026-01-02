#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from app.models import user, post, comment, subscriber, analytics

def create_all_tables():
    """Create all database tables"""
    print("Creating all tables...")
    
    try:
        # Import all models to ensure they're registered
        from app.models.user import User
        from app.models.post import Post
        from app.models.comment import Comment
        from app.models.subscriber import Subscriber
        from app.models.analytics import Analytics
        
        # Create all tables
        from app.db.database import Base
        Base.metadata.create_all(bind=engine)
        
        print("✅ All tables created successfully!")
        
        # Check what tables were created
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables created: {tables}")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_all_tables()
