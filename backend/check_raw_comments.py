#!/usr/bin/env python3

import requests

def check_raw_comments():
    """Check raw comments without any filtering"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Raw Comment Check")
        print("=" * 40)
        
        # Get all comments without status filtering
        print("\n📝 Getting ALL comments (admin, no status filter)...")
        all_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if all_response.status_code == 200:
            all_comments = all_response.json()
            print(f"   📊 Total comments: {len(all_comments)}")
            
            # Check each comment's parent_id
            parent_ids = [c.get('parent_id') for c in all_comments]
            non_null_parents = [p for p in parent_ids if p is not None]
            
            print(f"   📊 Comments with parent_id (replies): {len(non_null_parents)}")
            print(f"   📊 Parent IDs found: {non_null_parents}")
            
            # Show all comments with their parent_id
            print(f"\n📝 All comments with parent_id:")
            for comment in all_comments:
                parent_id = comment.get('parent_id')
                status = comment.get('status')
                print(f"   💬 Comment {comment['id']}: {comment['author_name']}")
                print(f"      📊 Parent ID: {parent_id}")
                print(f"      📊 Status: {status}")
                print(f"      📝 Content: {comment['content'][:30]}...")
        
        # Now test with include_replies=true
        print(f"\n📝 Testing include_replies=true...")
        nested_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true", headers=headers)
        
        if nested_response.status_code == 200:
            nested_comments = nested_response.json()
            print(f"   📊 Nested returns: {len(nested_comments)} comments")
            
            total_replies = 0
            for comment in nested_comments:
                replies = comment.get('replies', [])
                total_replies += len(replies)
                if replies:
                    print(f"   💬 Comment {comment['id']}: {len(replies)} replies")
            
            print(f"   📊 Total replies in nested: {total_replies}")
        
        print(f"\n🎯 Diagnosis:")
        if len(non_null_parents) == 0:
            print(f"⚠️  No replies found in database - replies may have been deleted")
        else:
            print(f"✅ {len(non_null_parents)} replies exist in database")
            print(f"⚠️  But nested structure not working - backend logic issue")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_raw_comments()
