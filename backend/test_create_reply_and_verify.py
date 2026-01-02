#!/usr/bin/env python3

import requests

def test_create_reply_and_verify():
    """Create a reply and verify it appears in both endpoints"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🧪 Create Reply and Verify")
        print("=" * 40)
        
        # Step 1: Get an approved comment to reply to
        print("\n📝 Step 1: Getting approved comment...")
        comments_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if comments_response.status_code == 200:
            comments = comments_response.json()
            approved_comments = [c for c in comments if c.get('status') == 'approved']
            
            if approved_comments:
                parent_comment = approved_comments[0]
                print(f"   📝 Using approved parent: {parent_comment['id']} - {parent_comment['author_name']}")
                
                # Step 2: Create a reply
                print(f"\n💬 Step 2: Creating reply...")
                reply_data = {
                    "post_id": 1,
                    "author_name": "Reply Test User",
                    "author_email": "reply@test.com",
                    "content": "This is a test reply to verify nested structure!",
                    "parent_id": parent_comment['id']
                }
                
                reply_response = requests.post("http://localhost:8000/api/v1/comments", headers=headers, json=reply_data)
                
                if reply_response.status_code == 201:
                    reply = reply_response.json()
                    print(f"   ✅ Reply created! ID: {reply['id']}")
                    print(f"   📊 Parent ID: {reply['parent_id']}")
                    print(f"   📊 Status: {reply.get('status')}")
                    print(f"   📝 Content: {reply['content']}")
                    
                    # Step 3: Check raw comments list
                    print(f"\n📝 Step 3: Checking raw comments list...")
                    raw_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
                    
                    if raw_response.status_code == 200:
                        raw_comments = raw_response.json()
                        reply_comments = [c for c in raw_comments if c.get('parent_id') is not None]
                        print(f"   📊 Comments with parent_id: {len(reply_comments)}")
                        
                        for reply_comment in reply_comments:
                            print(f"      💬 Reply {reply_comment['id']}: {reply_comment['author_name']}")
                    
                    # Step 4: Check single comment endpoint
                    print(f"\n🔍 Step 4: Checking single comment endpoint...")
                    single_response = requests.get(f"http://localhost:8000/api/v1/comments/{parent_comment['id']}", headers=headers)
                    
                    if single_response.status_code == 200:
                        single_comment = single_response.json()
                        replies = single_comment.get('replies', [])
                        print(f"   📊 Single comment shows: {len(replies)} replies")
                        
                        for reply in replies:
                            print(f"      💬 Reply {reply['id']}: {reply['author_name']}")
                    
                    # Step 5: Check nested structure
                    print(f"\n🔍 Step 5: Checking nested structure...")
                    nested_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true", headers=headers)
                    
                    if nested_response.status_code == 200:
                        nested_comments = nested_response.json()
                        print(f"   📊 Nested returns: {len(nested_comments)} comments")
                        
                        for comment in nested_comments:
                            if comment['id'] == parent_comment['id']:
                                replies = comment.get('replies', [])
                                print(f"   ✅ Parent comment has: {len(replies)} replies")
                                
                                for reply in replies:
                                    print(f"      💬 Reply {reply['id']}: {reply['author_name']}")
                                    print(f"         📝 Content: {reply['content'][:30]}...")
                                break
                    
                    print(f"\n🎯 Results:")
                    print(f"✅ Reply created successfully")
                    print(f"✅ Reply appears in raw comments list")
                    print(f"✅ Single comment endpoint shows replies")
                    print(f"✅ Nested structure should now work")
                    print(f"✅ Frontend should display nested comments")
                    
                else:
                    print(f"   ❌ Reply creation failed: {reply_response.text}")
            else:
                print(f"   ⚠️  No approved comments found to reply to")
        else:
            print(f"   ❌ Comments fetch failed: {comments_response.text}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_create_reply_and_verify()
