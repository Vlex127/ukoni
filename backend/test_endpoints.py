#!/usr/bin/env python3

import requests

def test_endpoints():
    """Test various endpoints to see what's available"""
    endpoints = [
        "/api/v1/auth/me",
        "/api/v1/posts",
        "/api/v1/comments",
        "/api/v1/subscribers/count",
        "/api/v1/analytics/visitors"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"http://localhost:8000{endpoint}")
            print(f"{endpoint}: {response.status_code}")
        except Exception as e:
            print(f"{endpoint}: Error - {e}")

if __name__ == "__main__":
    test_endpoints()
