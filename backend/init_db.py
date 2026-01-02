import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

from app.db.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.subscriber import Subscriber
from app.core.security import get_password_hash

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create a default admin user if it doesn't exist
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.email == "admin@nntts.com").first()
        if not admin:
            print("Creating default admin user...")
            admin_user = User(
                email="admin@nntts.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                is_active=True,
                is_admin=True,
                bio="System Administrator"
            )
            db.add(admin_user)
            db.commit()
            print("Default admin user created with email: admin@nntts.com and password: admin123")
        else:
            print("Admin user already exists")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialization complete!")
