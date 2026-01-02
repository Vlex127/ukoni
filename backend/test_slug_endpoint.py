#!/usr/bin/env python3

import requests

def test_slug_endpoint():
    """Test the slug endpoint that the article page uses"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    # Test the Cloudinary post
    slug = "chainsaw-man-season-2"
    
    try:
        response = requests.get(f"http://localhost:8000/api/v1/posts/slug/{slug}", headers=headers)
        
        if response.status_code == 200:
            post = response.json()
            print("🔍 Slug Endpoint Test:")
            print("=" * 40)
            print(f"📝 {post['title']}")
            print(f"   🔗 Slug: {post['slug']}")
            print(f"   🖼️  featured_image: {post.get('featured_image')}")
            print(f"   🔗 featured_image_url: {post.get('featured_image_url')}")
            
            # Simulate the article page logic
            if post.get('featured_image_url'):
                article_image_url = post['featured_image_url']
                print(f"   ✅ Article page will use: {article_image_url}")
                
                # Test if the Cloudinary URL works
                try:
                    img_response = requests.head(article_image_url, timeout=3)
                    if img_response.status_code == 200:
                        print(f"   🟢 Image accessible: YES")
                    else:
                        print(f"   🔴 Image accessible: NO ({img_response.status_code})")
                except:
                    print(f"   🔴 Image accessible: ERROR")
            else:
                print(f"   ⚠️  No Cloudinary URL found")
                
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_slug_endpoint()
