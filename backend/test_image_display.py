#!/usr/bin/env python3

import requests

def test_image_display():
    """Test that Cloudinary images are accessible and displaying correctly"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            print("🖼️  Testing Image Display:")
            
            for post in posts:
                print(f"\n📝 {post['title']}")
                
                # Test the Cloudinary URL first (if available)
                if post.get('featured_image_url'):
                    cloudinary_url = post['featured_image_url']
                    print(f"   🔗 Cloudinary URL: {cloudinary_url}")
                    
                    try:
                        img_response = requests.head(cloudinary_url, timeout=5)
                        if img_response.status_code == 200:
                            print(f"   ✅ Cloudinary Image: Working (Status {img_response.status_code})")
                        else:
                            print(f"   ❌ Cloudinary Image: Failed (Status {img_response.status_code})")
                    except Exception as e:
                        print(f"   ❌ Cloudinary Image: Error - {e}")
                
                # Test the old local path (should not be used anymore)
                if post.get('featured_image') and not post.get('featured_image_url'):
                    local_path = post['featured_image']
                    if not local_path.startswith('http'):
                        constructed_url = f"http://localhost:8000/api/v1/{local_path}"
                        print(f"   📍 Local Path: {constructed_url}")
                        
                        try:
                            img_response = requests.head(constructed_url, timeout=5)
                            print(f"   📊 Local Image Status: {img_response.status_code}")
                        except Exception as e:
                            print(f"   ❌ Local Image: Error - {e}")
                
                # Show what the frontend should use
                if post.get('featured_image_url'):
                    print(f"   🎯 Frontend should use: featured_image_url")
                elif post.get('featured_image'):
                    print(f"   🎯 Frontend should use: getImageUrl(featured_image)")
                else:
                    print(f"   ⚠️  No image available")
                    
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_image_display()
