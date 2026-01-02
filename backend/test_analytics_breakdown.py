#!/usr/bin/env python3

import requests
import json

def test_analytics_breakdown():
    """Test the enhanced visitor analytics breakdown"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        # Test detailed visitor stats
        response = requests.get("http://localhost:8000/api/v1/analytics/visitors/stats", headers=headers)
        print(f"📊 Visitor Stats Status: {response.status_code}")
        
        if response.status_code == 200:
            stats = response.json()
            print("📈 Detailed Visitor Statistics:")
            print(json.dumps(stats, indent=2))
            
            print("\n🎯 Key Insights:")
            current = stats['current_period']
            growth = stats['growth']
            
            print(f"   📊 Total Visitors: {current['total_visitors']}")
            print(f"   💬 Comment Visitors: {current['comment_visitors']}")
            print(f"   📄 Page Visitors: {current['page_visitors']}")
            print(f"   📈 Engagement Rate: {current['engagement_rate']}%")
            
            print(f"\n📊 Growth Trends:")
            print(f"   📈 Total Growth: {growth['total_visitors']}%")
            print(f"   💬 Comment Growth: {growth['comment_visitors']}%")
            print(f"   📄 Page Growth: {growth['page_visitors']}%")
            print(f"   📈 Engagement Change: {growth['engagement_rate']:.1f}%")
        
        # Test time-series data
        response2 = requests.get("http://localhost:8000/api/v1/analytics/visitors", headers=headers)
        print(f"\n📊 Time Series Status: {response2.status_code}")
        
        if response2.status_code == 200:
            time_series = response2.json()
            print("📈 Time Series Data (Last 5 days):")
            
            current_period = time_series['current_period'][-5:]  # Last 5 days
            for day in current_period:
                if day['count'] > 0:  # Only show days with activity
                    print(f"   📅 {day['date']}: Total={day['count']}, Comments={day['comment_visitors']}, Pages={day['page_visitors']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_analytics_breakdown()
