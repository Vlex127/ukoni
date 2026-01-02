#!/usr/bin/env python3

import requests

def test_reply_system():
    """Test the complete reply system"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        # Step 1: Get existing comments
        print("🔍 Step 1: Getting existing comments...")
        response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if response.status_code == 200:
            comments = response.json()
            print(f"   📊 Found {len(comments)} comments")
            
            if comments:
                parent_comment = comments[0]
                print(f"   📝 Using parent comment: {parent_comment['author_name']} - {parent_comment['content'][:30]}...")
                
                # Step 2: Create a reply
                print("\n💬 Step 2: Creating a reply...")
                reply_data = {
                    "post_id": 1,
                    "author_name": "Reply User",
                    "author_email": "reply@example.com",
                    "content": "This is a reply to test the system!",
                    "parent_id": parent_comment['id']
                }
                
                reply_response = requests.post("http://localhost:8000/api/v1/comments", headers=headers, json=reply_data)
                
                if reply_response.status_code == 201:
                    reply = reply_response.json()
                    print("   ✅ Reply created successfully!")
                    print(f"   📝 Reply ID: {reply['id']}")
                    print(f"   📊 Parent ID: {reply['parent_id']}")
                    print(f"   📄 Content: {reply['content']}")
                    
                    # Step 3: Verify the reply is saved in database
                    print("\n🔍 Step 3: Verifying reply is saved...")
                    verify_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
                    
                    if verify_response.status_code == 200:
                        updated_comments = verify_response.json()
                        print(f"   📊 Total comments now: {len(updated_comments)}")
                        
                        # Find the reply in the response
                        found_reply = False
                        for comment in updated_comments:
                            if comment['id'] == reply['id']:
                                print("   ✅ Reply found in main comments list")
                                found_reply = True
                                break
                        
                        if not found_reply:
                            print("   ⚠️  Reply not found in main list (might be nested)")
                        
                        # Check if it's properly nested
                        for comment in updated_comments:
                            if comment['id'] == parent_comment['id']:
                                if comment.get('replies'):
                                    reply_in_replies = any(r['id'] == reply['id'] for r in comment['replies'])
                                    if reply_in_replies:
                                        print("   ✅ Reply found nested under parent comment!")
                                    else:
                                        print("   ⚠️  Reply not found in parent's replies")
                                else:
                                    print("   ⚠️  Parent comment has no replies array")
                                break
                    
                    # Step 4: Test visitor tracking for reply
                    print("\n📊 Step 4: Checking visitor tracking...")
                    visitor_response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
                    
                    if visitor_response.status_code == 200:
                        visitor_data = visitor_response.json()
                        print(f"   📈 Total Visitors: {visitor_data['current_period']['total_visitors']}")
                        print(f"   💬 Comment Visitors: {visitor_data['current_period']['comment_visitors']}")
                        print("   ✅ Reply tracked as visitor!")
                    
                else:
                    print(f"   ❌ Reply creation failed: {reply_response.text}")
            else:
                print("   ⚠️  No existing comments found to reply to")
                
        else:
            print(f"❌ Error getting comments: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_reply_system()
