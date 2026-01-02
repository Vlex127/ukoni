#!/usr/bin/env python3

import requests

def test_post_update():
    """Test updating a post with different category"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        # Get the test post we just created
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            test_post = next((p for p in posts if p['title'] == 'Test Post with Category Dropdown'), None)
            
            if test_post:
                print(f"🧪 Found test post: {test_post['title']} (ID: {test_post['id']})")
                print(f"📅 Current Category: {test_post['category']}")
                
                # Update the post with a new category
                update_data = {
                    "title": test_post['title'],
                    "content": test_post['content'],
                    "excerpt": test_post['excerpt'],
                    "status": "published",
                    "category": "Business",  # Change to Business
                    "meta_title": test_post['meta_title'],
                    "meta_description": test_post['meta_description'],
                    "is_featured": True
                }
                
                print(f"🔄 Updating to category: {update_data['category']}")
                update_response = requests.put(f"http://localhost:8000/api/v1/posts/{test_post['id']}", headers=headers, json=update_data)
                
                if update_response.status_code == 200:
                    updated_post = update_response.json()
                    print("✅ Post updated successfully!")
                    print(f"   🏷️  New Category: {updated_post['category']}")
                    print(f"   📊 New Status: {updated_post['status']}")
                    print(f"   ⭐ Featured: {updated_post['is_featured']}")
                else:
                    print(f"❌ Update failed: {update_response.text}")
            else:
                print("❌ Test post not found")
        else:
            print(f"❌ Failed to get posts: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_post_update()
