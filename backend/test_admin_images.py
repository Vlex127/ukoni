#!/usr/bin/env python3

import requests

def test_admin_images():
    """Test that admin page receives correct image data"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            print("🔍 Admin Page Image Data Test:")
            
            for post in posts[:4]:  # Test first 4 posts (recent posts)
                print(f"\n📝 {post['title']}")
                print(f"   🖼️  featured_image: {post.get('featured_image')}")
                print(f"   🔗 featured_image_url: {post.get('featured_image_url')}")
                
                # Simulate the admin page logic
                if post.get('featured_image_url'):
                    admin_image_url = post['featured_image_url']
                    print(f"   ✅ Admin will use: {admin_image_url}")
                elif post.get('featured_image'):
                    # This would be the old logic (should not happen for Cloudinary images)
                    admin_image_url = f"http://localhost:8000/api/v1/{post['featured_image'].replace('/+', '')}"
                    print(f"   ⚠️  Admin would use (old logic): {admin_image_url}")
                else:
                    print(f"   ⚠️  Admin will show: placeholder")
                    
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_admin_images()
