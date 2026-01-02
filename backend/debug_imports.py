#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.security import get_password_hash
    print("Security module imported successfully")
    
    # Test password hashing
    hashed = get_password_hash("testpass")
    print(f"Password hash works: {hashed[:20]}...")
    
    # Test database connection
    from app.db.database import engine, SessionLocal
    print("Database module imported successfully")
    
    # Test creating a session
    db = SessionLocal()
    print("Database session created successfully")
    db.close()
    
    # Test models
    from app.models.user import User
    print("User model imported successfully")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
