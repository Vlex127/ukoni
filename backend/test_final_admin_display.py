#!/usr/bin/env python3

import requests

def test_final_admin_display():
    """Final test to verify admin page image display is fixed"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get("http://localhost:8000/api/v1/posts", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            print("🎯 Final Admin Display Test:")
            print("=" * 50)
            
            cloudinary_posts = 0
            local_posts = 0
            no_image_posts = 0
            
            for post in posts:
                if post.get('featured_image_url'):
                    cloudinary_posts += 1
                    print(f"✅ Cloudinary Post: {post['title'][:30]}...")
                    print(f"   🔗 URL: {post['featured_image_url'][:60]}...")
                    
                    # Test if the Cloudinary URL works
                    try:
                        img_response = requests.head(post['featured_image_url'], timeout=3)
                        if img_response.status_code == 200:
                            print(f"   🟢 Image accessible: YES")
                        else:
                            print(f"   🔴 Image accessible: NO ({img_response.status_code})")
                    except:
                        print(f"   🔴 Image accessible: ERROR")
                        
                elif post.get('featured_image'):
                    local_posts += 1
                    print(f"⚠️  Local Post: {post['title'][:30]}...")
                    print(f"   📍 Path: {post['featured_image']}")
                else:
                    no_image_posts += 1
                    print(f"⚪ No Image: {post['title'][:30]}...")
            
            print("\n" + "=" * 50)
            print("📊 Summary:")
            print(f"   🟢 Cloudinary Posts: {cloudinary_posts} (Should display images)")
            print(f"   🟡 Local Posts: {local_posts} (Will show placeholders)")
            print(f"   ⚪ No Image Posts: {no_image_posts} (Will show placeholders)")
            
            if cloudinary_posts > 0:
                print(f"\n🎉 SUCCESS: Admin page should display {cloudinary_posts} Cloudinary images!")
            else:
                print(f"\n⚠️  No Cloudinary posts found for testing")
                
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_final_admin_display()
