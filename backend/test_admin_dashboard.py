#!/usr/bin/env python3

import requests

def test_admin_dashboard_endpoints():
    """Test all admin dashboard endpoints"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    endpoints = [
        ("Posts", "http://localhost:8000/api/v1/posts"),
        ("Comments", "http://localhost:8000/api/v1/comments"),
        ("Subscribers Count", "http://localhost:8000/api/v1/subscribers/count"),
        ("Visitor Stats", "http://localhost:8000/api/v1/analytics/visitors/stats"),
        ("Auth Me", "http://localhost:8000/api/v1/auth/me")
    ]
    
    print("🧪 Testing Admin Dashboard Endpoints:")
    print("=" * 50)
    
    all_working = True
    
    for name, url in endpoints:
        try:
            response = requests.get(url, headers=headers)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"{status} {name}: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if name == "Posts":
                    print(f"   📊 Posts: {len(data)} posts")
                elif name == "Comments":
                    print(f"   💬 Comments: {len(data)} comments")
                elif name == "Subscribers Count":
                    print(f"   👥 Subscribers: {data.get('count', 0)}")
                elif name == "Visitor Stats":
                    current = data['current_period']
                    print(f"   📈 Total Visitors: {current['total_visitors']}")
                    print(f"   💬 Comment Visitors: {current['comment_visitors']}")
                    print(f"   📄 Page Visitors: {current['page_visitors']}")
                    print(f"   📊 Engagement Rate: {current['engagement_rate']}%")
                elif name == "Auth Me":
                    print(f"   👤 User: {data.get('email', 'Unknown')}")
            else:
                print(f"   ❌ Error: {response.text}")
                all_working = False
                
        except Exception as e:
            print(f"❌ {name}: Error - {e}")
            all_working = False
    
    print("=" * 50)
    if all_working:
        print("🎉 All admin dashboard endpoints are working!")
    else:
        print("⚠️  Some endpoints have issues")
    
    # Test comment creation (visitor tracking)
    print("\n🧪 Testing Comment Creation (Visitor Tracking):")
    try:
        comment_data = {
            "post_id": 1,
            "author_name": "Dashboard Test",
            "author_email": "dashboard@test.com",
            "content": "Testing visitor tracking from admin dashboard!",
            "parent_id": None
        }
        
        response = requests.post("http://localhost:8000/api/v1/comments", headers=headers, json=comment_data)
        if response.status_code == 201:
            print("✅ Comment created successfully!")
            
            # Check if visitor count increased
            visitor_response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
            if visitor_response.status_code == 200:
                visitor_data = visitor_response.json()
                print(f"📈 Updated Total Visitors: {visitor_data['current_period']['total_visitors']}")
                print("🎉 Visitor tracking is working!")
        else:
            print(f"❌ Comment creation failed: {response.text}")
    except Exception as e:
        print(f"❌ Comment creation error: {e}")

if __name__ == "__main__":
    test_admin_dashboard_endpoints()
