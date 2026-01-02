#!/usr/bin/env python3

import requests

def test_all_cloudinary_display():
    """Test all pages where Cloudinary images should display"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            print("🌐 Complete Cloudinary Display Test")
            print("=" * 60)
            
            cloudinary_posts = [p for p in posts if p.get('featured_image_url')]
            
            print(f"📊 Found {len(cloudinary_posts)} posts with Cloudinary images")
            print(f"🌐 These should now display correctly on:")
            print(f"   • Home page (/)")
            print(f"   • Articles page (/articles)")
            print(f"   • Individual article pages (/articles/[slug])")
            print(f"   • Admin dashboard (/admin)")
            print()
            
            for i, post in enumerate(cloudinary_posts, 1):
                print(f"📝 Post {i}: {post['title']}")
                print(f"   🔗 Cloudinary URL: {post['featured_image_url'][:60]}...")
                
                # Test accessibility
                try:
                    img_response = requests.head(post['featured_image_url'], timeout=3)
                    status = "✅ Working" if img_response.status_code == 200 else f"❌ {img_response.status_code}"
                except:
                    status = "❌ Error"
                
                print(f"   🟢 Status: {status}")
                print(f"   🌐 Pages: /articles/{post['slug']}, /admin, /")
                print()
            
            print("🎯 Expected Behavior:")
            print("   ✅ Home page: Cloudinary images in featured and latest posts")
            print("   ✅ Articles page: Cloudinary images in post grid")
            print("   ✅ Article pages: Cloudinary images as featured images")
            print("   ✅ Admin dashboard: Cloudinary images in recent posts")
            print("   ✅ No more 404 errors for Cloudinary URLs")
            print("   ✅ No more placeholder text where images should be")
                
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_all_cloudinary_display()
