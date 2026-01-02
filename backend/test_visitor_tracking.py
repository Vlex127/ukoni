#!/usr/bin/env python3

import requests
import json

def test_visitor_tracking():
    """Test that new comments create visitor analytics entries"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    # Test 1: Create a new comment
    comment_data = {
        "post_id": 1,
        "author_name": "Visitor Tracker",
        "author_email": "visitor@test.com",
        "content": "This comment should create a visitor analytics entry!",
        "parent_id": None
    }
    
    print("🧪 Testing visitor tracking with new comment...")
    print(f"📤 Comment Data: {json.dumps(comment_data, indent=2)}")
    
    try:
        # Create comment
        response = requests.post(
            "http://localhost:8000/api/v1/comments",
            headers=headers,
            json=comment_data
        )
        
        print(f"📊 Comment Creation Status: {response.status_code}")
        
        if response.status_code == 201:
            created_comment = response.json()
            print(f"✅ Comment created successfully! ID: {created_comment.get('id')}")
            
            # Test 2: Check visitor analytics
            analytics_response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
            print(f"📊 Analytics Status: {analytics_response.status_code}")
            
            if analytics_response.status_code == 200:
                analytics_data = analytics_response.json()
                print("📈 Visitor Analytics:")
                print(f"   Total Visitors (Current): {analytics_data['current_period']['total_visitors']}")
                print(f"   Comment Visitors (Current): {analytics_data['current_period']['comment_visitors']}")
                print(f"   Page Visitors (Current): {analytics_data['current_period']['page_visitors']}")
                print(f"   Engagement Rate: {analytics_data['current_period']['engagement_rate']}%")
                
                # Test 3: Create a reply to track another visitor
                reply_data = {
                    "post_id": 1,
                    "author_name": "Reply User",
                    "author_email": "reply@test.com",
                    "content": "This is a reply that should also track as a visitor!",
                    "parent_id": created_comment.get('id')
                }
                
                print("\n🧪 Testing visitor tracking with reply...")
                reply_response = requests.post(
                    "http://localhost:8000/api/v1/comments",
                    headers=headers,
                    json=reply_data
                )
                
                if reply_response.status_code == 201:
                    print("✅ Reply created successfully!")
                    
                    # Check analytics again
                    analytics_response2 = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
                    if analytics_response2.status_code == 200:
                        analytics_data2 = analytics_response2.json()
                        print("📈 Updated Visitor Analytics:")
                        print(f"   Total Visitors (Current): {analytics_data2['current_period']['total_visitors']}")
                        print(f"   Comment Visitors (Current): {analytics_data2['current_period']['comment_visitors']}")
                        print(f"   Page Visitors (Current): {analytics_data2['current_period']['page_visitors']}")
                        print(f"   Engagement Rate: {analytics_data2['current_period']['engagement_rate']}%")
                        
                        # Check if comment visitors increased
                        comment_increase = analytics_data2['current_period']['comment_visitors'] - analytics_data['current_period']['comment_visitors']
                        print(f"🎉 Comment visitors increased by: {comment_increase}")
                        
                else:
                    print(f"❌ Reply creation failed: {reply_response.text}")
            else:
                print(f"❌ Analytics request failed: {analytics_response.text}")
        else:
            print(f"❌ Comment creation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_visitor_tracking()
