#!/usr/bin/env python3

import requests

def test_analytics_simple():
    """Test the analytics stats endpoint which works"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analytics Stats Working:")
            print(f"   Total Visitors: {data['current_period']['total_visitors']}")
            print(f"   Comment Visitors: {data['current_period']['comment_visitors']}")
            print(f"   Page Visitors: {data['current_period']['page_visitors']}")
            print(f"   Engagement Rate: {data['current_period']['engagement_rate']}%")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_analytics_simple()
