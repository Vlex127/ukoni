#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

def check_config():
    """Check configuration values"""
    print(f"USE_SQLITE: {settings.USE_SQLITE} (type: {type(settings.USE_SQLITE)})")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    print(f"NEON_DATABASE_URL: {settings.NEON_DATABASE_URL}")
    print(f"database_url: {settings.database_url}")
    
    # Check if USE_SQLITE is actually True
    if settings.USE_SQLITE:
        print("✅ USE_SQLITE is True - should use SQLite")
    else:
        print("❌ USE_SQLITE is False - will use PostgreSQL")

if __name__ == "__main__":
    check_config()
