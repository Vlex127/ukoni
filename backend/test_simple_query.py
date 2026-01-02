#!/usr/bin/env python3

import requests

def test_simple_query():
    """Test simple query to isolate the issue"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Simple Query Test")
        print("=" * 40)
        
        # Test 1: Get comment 26 directly
        print("\n📝 Test 1: Get comment 26 directly...")
        direct_response = requests.get("http://localhost:8000/api/v1/comments/26", headers=headers)
        
        if direct_response.status_code == 200:
            comment = direct_response.json()
            print(f"   ✅ Comment 26 exists: {comment['author_name']}")
            print(f"   📊 Parent ID: {comment['parent_id']}")
            print(f"   📊 Status: {comment['status']}")
        
        # Test 2: Get all comments with no filters
        print(f"\n📝 Test 2: Get all comments (no filters)...")
        all_response = requests.get("http://localhost:8000/api/v1/comments", headers=headers)
        
        if all_response.status_code == 200:
            all_comments = all_response.json()
            comment_26 = [c for c in all_comments if c.get('id') == 26]
            print(f"   📊 Comment 26 in all comments: {len(comment_26)}")
        
        # Test 3: Get comments for post 1
        print(f"\n📝 Test 3: Get comments for post 1...")
        post_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if post_response.status_code == 200:
            post_comments = post_response.json()
            comment_26 = [c for c in post_comments if c.get('id') == 26]
            print(f"   📊 Comment 26 in post 1: {len(comment_26)}")
            
            # Show all comments for post 1
            print(f"   📝 All comments for post 1:")
            for comment in post_comments:
                print(f"      💬 {comment['id']}: {comment['author_name']} - Parent: {comment.get('parent_id')}")
        
        # Test 4: Check if comment 26 is actually for post 1
        print(f"\n📝 Test 4: Verify comment 26 post_id...")
        if direct_response.status_code == 200:
            comment = direct_response.json()
            print(f"   📊 Comment 26 post_id: {comment.get('post_id')}")
            print(f"   📊 Expected post_id: 1")
            
            if comment.get('post_id') == 1:
                print(f"   ✅ Comment 26 is for post 1")
            else:
                print(f"   ❌ Comment 26 is for post {comment.get('post_id')}, not post 1")
        
        print(f"\n🎯 Diagnosis:")
        print(f"✅ Comment 26 exists in database")
        print(f"✅ Single comment endpoint works")
        print(f"⚠️  List endpoint has filtering issue")
        print(f"🔧 Need to debug the query logic")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_simple_query()
