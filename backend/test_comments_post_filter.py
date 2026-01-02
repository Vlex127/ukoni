#!/usr/bin/env python3

import requests

def test_comments_with_post_filter():
    """Test comments endpoint with post_id filter"""
    try:
        headers = {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
            "Content-Type": "application/json"
        }
        
        # Test without post_id filter
        response = requests.get("http://localhost:8000/api/v1/comments", headers=headers)
        print(f"Without post_id filter: {response.status_code}")
        if response.status_code == 200:
            all_comments = response.json()
            print(f"   Total comments: {len(all_comments)}")
        
        # Test with post_id=1 filter
        response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        print(f"With post_id=1 filter: {response.status_code}")
        if response.status_code == 200:
            post1_comments = response.json()
            print(f"   Comments for post 1: {len(post1_comments)}")
            for comment in post1_comments:
                print(f"     - {comment['author_name']}: {comment['content'][:30]}...")
        
        # Test with post_id=2 filter
        response = requests.get("http://localhost:8000/api/v1/comments?post_id=2", headers=headers)
        print(f"With post_id=2 filter: {response.status_code}")
        if response.status_code == 200:
            post2_comments = response.json()
            print(f"   Comments for post 2: {len(post2_comments)}")
            for comment in post2_comments:
                print(f"     - {comment['author_name']}: {comment['content'][:30]}...")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_comments_with_post_filter()
