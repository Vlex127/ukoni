#!/usr/bin/env python3

import requests

def check_categories():
    """Check what categories are currently in use"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            categories = set()
            
            print("📊 Current Posts and Categories:")
            for post in posts:
                category = post.get('category', 'uncategorized')
                categories.add(category)
                print(f"   📝 '{post['title']}' - Category: {category}")
            
            print(f"\n🏷️  Available Categories: {sorted(categories)}")
            
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_categories()
