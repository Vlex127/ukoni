#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.db.database import SessionLocal
    from app.models.user import User
    from app.core.security import get_password_hash
    
    print("Testing database operations...")
    
    # Create database session
    db = SessionLocal()
    
    # Check if user table exists and is accessible
    try:
        # Try to query users
        users = db.query(User).all()
        print(f"Current users in database: {len(users)}")
    except Exception as e:
        print(f"Error querying users: {e}")
        # Try to create the table
        try:
            User.metadata.create_all(bind=db.bind)
            print("Created user table")
        except Exception as e2:
            print(f"Error creating table: {e2}")
    
    # Test creating a user
    try:
        hashed_password = get_password_hash("testpass")
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=hashed_password,
            full_name="Test User"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Created user: {user.username} (ID: {user.id})")
        
        # Test querying the user
        found_user = db.query(User).filter(User.username == "testuser").first()
        if found_user:
            print(f"Found user: {found_user.username}")
        else:
            print("User not found")
            
    except Exception as e:
        print(f"Error creating user: {e}")
        db.rollback()
    finally:
        db.close()
    
    print("Database test completed!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
