#!/usr/bin/env python3

import requests

def test_public_comments():
    """Test public access to comments without authentication"""
    
    try:
        print("🌐 Public Comments Access Test")
        print("=" * 40)
        
        # Test without any authentication headers (public access)
        print("\n📝 Testing public access (no auth)...")
        public_response = requests.get("http://localhost:8000/api/v1/comments?post_id=3&include_replies=true")
        
        print(f"   📊 Status Code: {public_response.status_code}")
        
        if public_response.status_code == 200:
            comments = public_response.json()
            print(f"   ✅ Public access works!")
            print(f"   📊 Found {len(comments)} comments")
            
            for comment in comments:
                print(f"   💬 {comment['author_name']}: {comment['content'][:30]}...")
                replies = comment.get('replies', [])
                if replies:
                    print(f"      ↳ {len(replies)} replies")
        else:
            print(f"   ❌ Public access failed: {public_response.text}")
        
        # Test with empty Authorization header (like frontend might send)
        print(f"\n📝 Testing with empty Authorization...")
        headers = {"Authorization": ""}
        empty_auth_response = requests.get("http://localhost:8000/api/v1/comments?post_id=3&include_replies=true", headers=headers)
        
        print(f"   📊 Status Code: {empty_auth_response.status_code}")
        
        if empty_auth_response.status_code == 200:
            comments = empty_auth_response.json()
            print(f"   ✅ Empty auth works!")
            print(f"   📊 Found {len(comments)} comments")
        else:
            print(f"   ❌ Empty auth failed: {empty_auth_response.text}")
        
        # Test with invalid token
        print(f"\n📝 Testing with invalid token...")
        headers = {"Authorization": "Bearer invalid_token"}
        invalid_token_response = requests.get("http://localhost:8000/api/v1/comments?post_id=3&include_replies=true", headers=headers)
        
        print(f"   📊 Status Code: {invalid_token_response.status_code}")
        
        if invalid_token_response.status_code == 200:
            comments = invalid_token_response.json()
            print(f"   ✅ Invalid token works!")
            print(f"   📊 Found {len(comments)} comments")
        else:
            print(f"   ❌ Invalid token failed: {invalid_token_response.text}")
        
        print(f"\n🎯 Solution:")
        print(f"✅ Backend should allow public access to approved comments")
        print(f"✅ Frontend CommentsSection should work for guests")
        print(f"✅ Article pages should display comments to all users")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_public_comments()
