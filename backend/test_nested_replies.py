#!/usr/bin/env python3

import requests

def test_nested_replies():
    """Test that nested replies are properly returned"""
    
    try:
        print("🔍 Testing Nested Replies Structure")
        print("=" * 50)
        
        # Test with include_replies=true
        print("\n📝 Testing with include_replies=true...")
        response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true")
        
        if response.status_code == 200:
            comments = response.json()
            print(f"   📊 Status: {response.status_code}")
            print(f"   📊 Comments found: {len(comments)}")
            
            for comment in comments:
                print(f"\n   💬 Comment {comment['id']}: {comment['author_name']}")
                print(f"      📝 Content: {comment['content'][:40]}...")
                print(f"      📊 Parent ID: {comment.get('parent_id')}")
                
                replies = comment.get('replies', [])
                print(f"      💬 Replies: {len(replies)}")
                
                for reply in replies:
                    print(f"         ↳ Reply {reply['id']}: {reply['author_name']}")
                    print(f"            📝 Content: {reply['content'][:30]}...")
                    print(f"            📊 Parent ID: {reply.get('parent_id')}")
        else:
            print(f"   ❌ Error: {response.status_code} - {response.text}")
        
        # Test without include_replies for comparison
        print(f"\n📝 Testing without include_replies...")
        response_no_replies = requests.get("http://localhost:8000/api/v1/comments?post_id=1")
        
        if response_no_replies.status_code == 200:
            comments_no_replies = response_no_replies.json()
            print(f"   📊 Comments found: {len(comments_no_replies)}")
            
            for comment in comments_no_replies:
                replies = comment.get('replies', [])
                print(f"   💬 Comment {comment['id']}: {len(replies)} replies")
        
        print(f"\n🎯 Expected Behavior:")
        print(f"✅ include_replies=true should show nested replies")
        print(f"✅ Without include_replies should show flat structure")
        print(f"✅ Frontend should display nested comments correctly")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_nested_replies()
