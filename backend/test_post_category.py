#!/usr/bin/env python3

import requests

def test_post_category():
    """Test creating a post with the new category field"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    # Test post data with new category
    post_data = {
        "title": "Test Post with Category Dropdown",
        "content": "This is a test post to verify the category dropdown works correctly.",
        "excerpt": "Test post for category dropdown functionality",
        "status": "draft",
        "category": "Technology",
        "meta_title": "Test Category Post",
        "meta_description": "Testing the category dropdown feature",
        "is_featured": False
    }
    
    try:
        print("🧪 Testing post creation with category...")
        print(f"📤 Category: {post_data['category']}")
        
        response = requests.post("http://localhost:8000/api/v1/posts/", headers=headers, json=post_data)
        
        if response.status_code == 201:
            created_post = response.json()
            print("✅ Post created successfully!")
            print(f"   📝 Title: {created_post.get('title')}")
            print(f"   🏷️  Category: {created_post.get('category')}")
            print(f"   📊 Status: {created_post.get('status')}")
            
            # Test updating the post with a different category
            update_data = {
                "title": created_post.get('title'),
                "content": created_post.get('content'),
                "excerpt": created_post.get('excerpt'),
                "status": "published",
                "category": "Business",  # Change category
                "meta_title": created_post.get('meta_title'),
                "meta_description": created_post.get('meta_description'),
                "is_featured": True
            }
            
            print(f"\n🧪 Testing post update with new category: {update_data['category']}")
            update_response = requests.put(f"http://localhost:8000/api/v1/posts/{created_post['id']}", headers=headers, json=update_data)
            
            if update_response.status_code == 200:
                updated_post = update_response.json()
                print("✅ Post updated successfully!")
                print(f"   🏷️  New Category: {updated_post.get('category')}")
                print(f"   📊 New Status: {updated_post.get('status')}")
                print(f"   ⭐ Featured: {updated_post.get('is_featured')}")
            else:
                print(f"❌ Update failed: {update_response.text}")
                
        else:
            print(f"❌ Post creation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_post_category()
