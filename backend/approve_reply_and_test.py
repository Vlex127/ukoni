#!/usr/bin/env python3

import requests

def approve_reply_and_test():
    """Approve the reply and test if it appears"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("✅ Approve Reply and Test")
        print("=" * 40)
        
        # Step 1: Approve reply 26
        print("\n📝 Step 1: Approving reply 26...")
        approve_response = requests.post("http://localhost:8000/api/v1/comments/26/approve", headers=headers)
        
        if approve_response.status_code == 200:
            approved_reply = approve_response.json()
            print(f"   ✅ Reply approved! Status: {approved_reply.get('status')}")
        else:
            print(f"   ❌ Approval failed: {approve_response.text}")
            return
        
        # Step 2: Check if it appears in list
        print(f"\n📝 Step 2: Checking if reply appears in list...")
        list_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if list_response.status_code == 200:
            list_comments = list_response.json()
            reply_in_list = [c for c in list_comments if c.get('id') == 26]
            print(f"   📊 Reply 26 in list: {len(reply_in_list)}")
            
            if reply_in_list:
                reply = reply_in_list[0]
                print(f"   💬 Found: {reply['author_name']} - Parent: {reply['parent_id']}")
        
        # Step 3: Check nested structure
        print(f"\n📝 Step 3: Checking nested structure...")
        nested_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true", headers=headers)
        
        if nested_response.status_code == 200:
            nested_comments = nested_response.json()
            print(f"   📊 Nested comments: {len(nested_comments)}")
            
            for comment in nested_comments:
                if comment['id'] == 2:  # Parent comment
                    replies = comment.get('replies', [])
                    print(f"   💬 Parent comment 2 has: {len(replies)} replies")
                    
                    for reply in replies:
                        print(f"      ↳ Reply {reply['id']}: {reply['author_name']}")
                        if reply['id'] == 26:
                            print(f"      ✅ Found our approved reply!")
        
        # Step 4: Test public view
        print(f"\n📝 Step 4: Testing public view...")
        public_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&include_replies=true")
        
        if public_response.status_code == 200:
            public_comments = public_response.json()
            print(f"   📊 Public sees: {len(public_comments)} comments")
            
            for comment in public_comments:
                if comment['id'] == 2:
                    replies = comment.get('replies', [])
                    print(f"   💬 Public sees: {len(replies)} replies to comment 2")
        
        print(f"\n🎯 Results:")
        print(f"✅ Reply approved successfully")
        print(f"✅ Should appear in nested structure")
        print(f"✅ Frontend should display nested comments")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    approve_reply_and_test()
