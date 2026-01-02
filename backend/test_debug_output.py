#!/usr/bin/env python3

import requests

def test_debug_output():
    """Test the debug output from the nested endpoint"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Testing Debug Output")
        print("=" * 40)
        
        print("\n📝 Calling include_replies=true endpoint...")
        response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true", headers=headers)
        
        if response.status_code == 200:
            comments = response.json()
            print(f"   📊 Response: {len(comments)} comments")
        else:
            print(f"   ❌ Error: {response.status_code} - {response.text}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_debug_output()
