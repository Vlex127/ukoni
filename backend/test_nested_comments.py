#!/usr/bin/env python3

import requests

def test_nested_comments():
    """Test getting comments with nested replies"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        # Test without include_replies (current behavior)
        print("🔍 Testing without include_replies...")
        response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if response.status_code == 200:
            comments = response.json()
            print(f"   📊 Comments without replies: {len(comments)}")
            
            # Find a comment that might have replies
            test_comment = None
            for comment in comments:
                if comment['id'] == 15:  # The parent comment we replied to
                    test_comment = comment
                    break
            
            if test_comment:
                print(f"   📝 Test comment: {test_comment['author_name']} - {test_comment['content'][:30]}...")
                print(f"   📊 Replies field: {test_comment.get('replies', 'None')}")
        
        # Test with include_replies=true
        print("\n🔍 Testing WITH include_replies=true...")
        response_with_replies = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true", headers=headers)
        
        if response_with_replies.status_code == 200:
            comments_with_replies = response_with_replies.json()
            print(f"   📊 Comments with replies: {len(comments_with_replies)}")
            
            # Find the same comment
            test_comment_with_replies = None
            for comment in comments_with_replies:
                if comment['id'] == 15:
                    test_comment_with_replies = comment
                    break
            
            if test_comment_with_replies:
                print(f"   📝 Test comment: {test_comment_with_replies['author_name']} - {test_comment_with_replies['content'][:30]}...")
                replies = test_comment_with_replies.get('replies', [])
                print(f"   📊 Replies field: {len(replies)} replies")
                
                for reply in replies:
                    print(f"      💬 Reply {reply['id']}: {reply['author_name']} - {reply['content'][:30]}...")
                    
                    if reply['id'] == 16:  # Our test reply
                        print("   ✅ Our test reply found in nested structure!")
            else:
                print("   ⚠️  Test comment not found in nested results")
        else:
            print(f"   ❌ Error with nested comments: {response_with_replies.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_nested_comments()
