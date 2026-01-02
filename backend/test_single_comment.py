#!/usr/bin/env python3

import requests

def test_single_comment():
    """Test getting a single comment with replies"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        # Test the single comment endpoint with replies
        print("🔍 Testing single comment endpoint with replies...")
        response = requests.get("http://localhost:8000/api/v1/comments/15", headers=headers)
        
        if response.status_code == 200:
            comment = response.json()
            print(f"   📝 Comment: {comment['author_name']} - {comment['content'][:30]}...")
            print(f"   📊 Comment ID: {comment['id']}")
            print(f"   📊 Parent ID: {comment.get('parent_id')}")
            
            replies = comment.get('replies', [])
            print(f"   💬 Replies: {len(replies)}")
            
            for reply in replies:
                print(f"      💬 Reply {reply['id']}: {reply['author_name']} - {reply['content'][:30]}...")
                print(f"         📊 Parent ID: {reply.get('parent_id')}")
                
                if reply['id'] == 16:  # Our test reply
                    print("   ✅ Our test reply found!")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_single_comment()
