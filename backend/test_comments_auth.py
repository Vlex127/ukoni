#!/usr/bin/env python3

import requests

def test_comments_with_auth():
    """Test comments endpoint with authentication"""
    try:
        # Test without auth first
        response = requests.get("http://localhost:8000/api/v1/comments")
        print(f"Without auth: {response.status_code}")
        
        # Test with auth token (using the token from browser logs)
        headers = {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
            "Content-Type": "application/json"
        }
        response = requests.get("http://localhost:8000/api/v1/comments", headers=headers)
        print(f"With auth: {response.status_code}")
        if response.status_code != 200:
            print(f"Auth response: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_comments_with_auth()
