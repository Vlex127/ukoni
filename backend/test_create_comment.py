#!/usr/bin/env python3

import requests
import json

def test_create_comment():
    """Test creating a comment with different data formats"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    # Test 1: Valid comment data
    comment_data = {
        "post_id": 1,
        "author_name": "Test User",
        "author_email": "test@example.com",
        "content": "This is a test comment from API test.",
        "parent_id": None
    }
    
    print("🧪 Testing comment creation...")
    print(f"📤 Data: {json.dumps(comment_data, indent=2)}")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/comments",
            headers=headers,
            json=comment_data
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Comment created successfully!")
            created_comment = response.json()
            print(f"📝 Comment ID: {created_comment.get('id')}")
        elif response.status_code == 422:
            print("❌ Validation error:")
            error_data = response.json()
            print(f"   Details: {json.dumps(error_data, indent=2)}")
        else:
            print(f"❌ Unexpected error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

if __name__ == "__main__":
    test_create_comment()
