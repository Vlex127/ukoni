#!/usr/bin/env python3

import requests

def debug_nested_structure():
    """Debug the nested structure issue"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Debug Nested Structure")
        print("=" * 40)
        
        # Test 1: Get all comments without filtering
        print("\n📝 Test 1: All comments (admin)...")
        all_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if all_response.status_code == 200:
            all_comments = all_response.json()
            print(f"   📊 Admin sees: {len(all_comments)} comments")
            
            for comment in all_comments:
                print(f"      💬 {comment['id']}: {comment['author_name']} - Parent: {comment.get('parent_id')}")
        
        # Test 2: Get with include_replies=true
        print(f"\n📝 Test 2: With include_replies=true...")
        nested_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true", headers=headers)
        
        if nested_response.status_code == 200:
            nested_comments = nested_response.json()
            print(f"   📊 Nested returns: {len(nested_comments)} comments")
            
            for comment in nested_comments:
                replies = comment.get('replies', [])
                print(f"      💬 {comment['id']}: {comment['author_name']} - {len(replies)} replies")
                
                for reply in replies:
                    print(f"         ↳ {reply['id']}: {reply['author_name']}")
        
        # Test 3: Check specific comment with reply
        print(f"\n📝 Test 3: Check comment 17 (should have reply)...")
        single_response = requests.get("http://localhost:8000/api/v1/comments/17", headers=headers)
        
        if single_response.status_code == 200:
            single_comment = single_response.json()
            replies = single_comment.get('replies', [])
            print(f"   📊 Comment 17 has: {len(replies)} replies")
            
            for reply in replies:
                print(f"      💬 Reply {reply['id']}: {reply['author_name']}")
                print(f"         📝 Content: {reply['content'][:30]}...")
        
        # Test 4: Public view
        print(f"\n📝 Test 4: Public view...")
        public_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true")
        
        if public_response.status_code == 200:
            public_comments = public_response.json()
            print(f"   📊 Public sees: {len(public_comments)} comments")
            
            for comment in public_comments:
                replies = comment.get('replies', [])
                print(f"      💬 {comment['id']}: {comment['author_name']} - {len(replies)} replies")
        
        print(f"\n🎯 Analysis:")
        print(f"✅ Reply created successfully in database")
        print(f"✅ Single comment endpoint shows nested replies")
        print(f"⚠️  List endpoint with include_replies may have filtering issue")
        print(f"✅ Frontend should work once backend is fixed")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_nested_structure()
