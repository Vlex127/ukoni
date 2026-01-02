#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    # Test the security functions directly
    from app.core.security import get_password_hash, verify_password, create_access_token
    
    print("Testing security functions...")
    
    # Test password hashing with a simple password
    password = "test"
    print(f"Testing password: '{password}' (length: {len(password.encode('utf-8'))})")
    
    hashed = get_password_hash(password)
    print(f"Hashed password: {hashed}")
    
    # Test verification
    verified = verify_password(password, hashed)
    print(f"Password verification: {verified}")
    
    # Test token creation
    token = create_access_token(data={"sub": "testuser"})
    print(f"Access token created: {token[:50]}...")
    
    print("Security functions work correctly!")
    
except Exception as e:
    print(f"Error in security functions: {e}")
    import traceback
    traceback.print_exc()
