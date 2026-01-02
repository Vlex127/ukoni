#!/usr/bin/env python3

import requests

def test_comments_endpoint():
    """Test comments endpoint"""
    try:
        response = requests.get(
            "http://localhost:8000/api/v1/comments",
            headers={
                "Origin": "http://localhost:3000",
                "Content-Type": "application/json"
            }
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_comments_endpoint()
