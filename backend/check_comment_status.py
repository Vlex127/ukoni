#!/usr/bin/env python3

import requests

def check_comment_status():
    """Check the status of comments to see if they're being filtered"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Checking Comment Status")
        print("=" * 40)
        
        # Test as admin (should see all comments)
        print("\n👑 Admin view (all comments):")
        admin_response = requests.get("http://localhost:8000/api/v1/comments?post_id=3", headers=headers)
        
        if admin_response.status_code == 200:
            admin_comments = admin_response.json()
            print(f"   📊 Admin sees: {len(admin_comments)} comments")
            
            for comment in admin_comments:
                print(f"   📝 {comment['author_name']} - Status: {comment.get('status', 'unknown')}")
        
        # Test as guest (should only see approved comments)
        print("\n👤 Guest view (approved comments only):")
        guest_response = requests.get("http://localhost:8000/api/v1/comments?post_id=3")
        guest_comments = []
        
        if guest_response.status_code == 200:
            guest_comments = guest_response.json()
            print(f"   📊 Guest sees: {len(guest_comments)} comments")
            
            for comment in guest_comments:
                print(f"   📝 {comment['author_name']} - Status: {comment.get('status', 'unknown')}")
        
        # Check if there are pending comments
        print(f"\n⚠️  Status Analysis:")
        if len(admin_comments) > len(guest_comments):
            print(f"   📊 {len(admin_comments) - len(guest_comments)} comments are not approved")
            print(f"   🔒 These comments are hidden from public view")
            
            # Approve a comment to test
            pending_comment = None
            for comment in admin_comments:
                if comment.get('status') == 'pending':
                    pending_comment = comment
                    break
            
            if pending_comment:
                print(f"\n✅ Approving comment {pending_comment['id']}...")
                approve_response = requests.post(
                    f"http://localhost:8000/api/v1/comments/{pending_comment['id']}/approve", 
                    headers=headers
                )
                
                if approve_response.status_code == 200:
                    print(f"   ✅ Comment approved!")
                    
                    # Test guest view again
                    new_guest_response = requests.get("http://localhost:8000/api/v1/comments?post_id=3")
                    if new_guest_response.status_code == 200:
                        new_guest_comments = new_guest_response.json()
                        print(f"   📊 Guest now sees: {len(new_guest_comments)} comments")
                        print(f"   ✅ Comment should appear in article page!")
                else:
                    print(f"   ❌ Approval failed: {approve_response.text}")
        else:
            print(f"   ✅ All comments are approved")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_comment_status()
