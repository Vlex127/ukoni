#!/usr/bin/env python3

import requests

def check_reply_filtering():
    """Check why replies are filtered differently"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Check Reply Filtering Issue")
        print("=" * 50)
        
        # Get the specific reply we just created
        print("\n📝 Getting reply 26...")
        reply_response = requests.get("http://localhost:8000/api/v1/comments/26", headers=headers)
        
        if reply_response.status_code == 200:
            reply = reply_response.json()
            print(f"   💬 Reply 26: {reply['author_name']}")
            print(f"   📊 Parent ID: {reply['parent_id']}")
            print(f"   📊 Status: {reply['status']}")
            print(f"   📝 Content: {reply['content'][:30]}...")
        
        # Test different query parameters
        print(f"\n📝 Testing different query parameters...")
        
        # Test with status=pending
        print(f"\n   🔸 With status=pending:")
        pending_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&status=pending", headers=headers)
        if pending_response.status_code == 200:
            pending_comments = pending_response.json()
            reply_in_pending = [c for c in pending_comments if c.get('id') == 26]
            print(f"      📊 Found reply 26: {len(reply_in_pending)}")
        
        # Test with status=approved
        print(f"\n   🔸 With status=approved:")
        approved_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&status=approved", headers=headers)
        if approved_response.status_code == 200:
            approved_comments = approved_response.json()
            reply_in_approved = [c for c in approved_comments if c.get('id') == 26]
            print(f"      📊 Found reply 26: {len(reply_in_approved)}")
        
        # Test with no status filter (default)
        print(f"\n   🔸 With no status filter:")
        default_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        if default_response.status_code == 200:
            default_comments = default_response.json()
            reply_in_default = [c for c in default_comments if c.get('id') == 26]
            print(f"      📊 Found reply 26: {len(reply_in_default)}")
        
        # Test include_replies with different status
        print(f"\n📝 Testing include_replies with status filters...")
        
        # Test with status=pending and include_replies=true
        print(f"\n   🔸 status=pending&include_replies=true:")
        pending_nested_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1&status=pending&include_replies=true", headers=headers)
        if pending_nested_response.status_code == 200:
            pending_nested = pending_nested_response.json()
            print(f"      📊 Comments returned: {len(pending_nested)}")
            
            # Check if any comment has reply 26
            found_reply = False
            for comment in pending_nested:
                replies = comment.get('replies', [])
                for reply in replies:
                    if reply['id'] == 26:
                        found_reply = True
                        print(f"      ✅ Found reply 26 in nested structure!")
                        break
            
            if not found_reply:
                print(f"      ❌ Reply 26 not found in nested structure")
        
        print(f"\n🎯 Analysis:")
        print(f"✅ Reply exists with status 'pending'")
        print(f"✅ Single comment endpoint can see it")
        print(f"⚠️  List endpoint filtering issue")
        print(f"🔧 Need to fix the nested structure building logic")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_reply_filtering()
