#!/usr/bin/env python3

import requests
import json

def test_comment_analytics_creation():
    """Test that creating a comment also creates analytics"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    # Check analytics before
    before_response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
    if before_response.status_code == 200:
        before_stats = before_response.json()
        print(f"📊 Before Comment - Total Visitors: {before_stats['current_period']['total_visitors']}")
    
    # Create a comment
    comment_data = {
        "post_id": 1,
        "author_name": "Analytics Test",
        "author_email": "analytics@test.com",
        "content": "Testing analytics creation from comment!",
        "parent_id": None
    }
    
    print("🧪 Creating comment...")
    response = requests.post("http://localhost:8000/api/v1/comments", headers=headers, json=comment_data)
    
    if response.status_code == 201:
        print("✅ Comment created successfully!")
        
        # Check analytics after
        after_response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
        if after_response.status_code == 200:
            after_stats = after_response.json()
            print(f"📊 After Comment - Total Visitors: {after_stats['current_period']['total_visitors']}")
            
            increase = after_stats['current_period']['total_visitors'] - before_stats['current_period']['total_visitors']
            print(f"🎉 Visitor increase: {increase}")
    else:
        print(f"❌ Comment creation failed: {response.text}")

if __name__ == "__main__":
    test_comment_analytics_creation()
