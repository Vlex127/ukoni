#!/usr/bin/env python3

import requests

def check_post_images():
    """Check what image URLs are stored in posts"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            print("📊 Post Image URLs:")
            for post in posts:
                print(f"\n📝 {post['title']}")
                print(f"   🖼️  featured_image: {post.get('featured_image')}")
                print(f"   🔗 featured_image_url: {post.get('featured_image_url')}")
                print(f"   🆔 featured_image_public_id: {post.get('featured_image_public_id')}")
                
                # Test if the URL is accessible
                if post.get('featured_image_url'):
                    try:
                        img_response = requests.head(post['featured_image_url'], timeout=5)
                        print(f"   ✅ URL Status: {img_response.status_code}")
                    except Exception as e:
                        print(f"   ❌ URL Error: {e}")
                else:
                    print(f"   ⚠️  No image URL")
                    
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_post_images()
