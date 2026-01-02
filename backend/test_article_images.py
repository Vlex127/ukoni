#!/usr/bin/env python3

import requests

def test_article_images():
    """Test that article pages receive correct image data"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            print("📰 Article Page Image Test:")
            print("=" * 50)
            
            for post in posts:
                print(f"\n📝 {post['title']}")
                print(f"   🔗 Slug: /articles/{post['slug']}")
                print(f"   🖼️  featured_image: {post.get('featured_image')}")
                print(f"   🔗 featured_image_url: {post.get('featured_image_url')}")
                
                # Simulate the article page logic
                if post.get('featured_image_url'):
                    article_image_url = post['featured_image_url']
                    print(f"   ✅ Article will show: {article_image_url}")
                    
                    # Test if the Cloudinary URL works
                    try:
                        img_response = requests.head(article_image_url, timeout=3)
                        if img_response.status_code == 200:
                            print(f"   🟢 Image accessible: YES")
                        else:
                            print(f"   🔴 Image accessible: NO ({img_response.status_code})")
                    except:
                        print(f"   🔴 Image accessible: ERROR")
                        
                elif post.get('featured_image'):
                    article_image_url = f"http://localhost:8000/api/v1/{post['featured_image'].replace('/+', '')}"
                    print(f"   ⚠️  Article will show (old logic): {article_image_url}")
                else:
                    print(f"   ⚪ Article will show: No image")
                    
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_article_images()
