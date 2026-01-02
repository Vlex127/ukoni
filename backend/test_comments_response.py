#!/usr/bin/env python3

import requests
import json

def test_comments_response():
    """Test comments endpoint and show response data"""
    try:
        headers = {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
            "Content-Type": "application/json"
        }
        response = requests.get("http://localhost:8000/api/v1/comments", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Comments endpoint working!")
            print(f"📊 Total comments returned: {len(data)}")
            
            for i, comment in enumerate(data[:3]):  # Show first 3 comments
                print(f"\n📝 Comment {i+1}:")
                print(f"   ID: {comment.get('id')}")
                print(f"   Post: {comment.get('post_id')}")
                print(f"   Author: {comment.get('author_name')}")
                print(f"   Email: {comment.get('author_email')}")
                print(f"   Status: {comment.get('status')}")
                print(f"   Content: {comment.get('content', '')[:50]}...")
        else:
            print(f"❌ Error: {response.text}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_comments_response()
