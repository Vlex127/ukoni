#!/usr/bin/env python3

import requests

def check_replies_detailed():
    """Check detailed reply information"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Detailed Reply Check")
        print("=" * 40)
        
        # Get all comments
        print("\n📝 Getting all comments...")
        all_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if all_response.status_code == 200:
            all_comments = all_response.json()
            print(f"   📊 Total comments: {len(all_comments)}")
            
            # Separate parents and replies
            parents = []
            replies = []
            
            for comment in all_comments:
                if comment.get('parent_id') is None:
                    parents.append(comment)
                else:
                    replies.append(comment)
            
            print(f"   📝 Parents: {len(parents)}")
            print(f"   💬 Replies: {len(replies)}")
            
            print(f"\n📝 All Replies:")
            for reply in replies:
                print(f"   💬 Reply {reply['id']}: {reply['author_name']}")
                print(f"      📊 Parent ID: {reply['parent_id']}")
                print(f"      📝 Content: {reply['content'][:30]}...")
                print(f"      📊 Status: {reply.get('status')}")
            
            print(f"\n📝 Parents with their expected replies:")
            for parent in parents:
                parent_replies = [r for r in replies if r['parent_id'] == parent['id']]
                print(f"   📝 Parent {parent['id']}: {parent['author_name']} - {len(parent_replies)} replies")
                
                for reply in parent_replies:
                    print(f"      ↳ {reply['id']}: {reply['author_name']} - {reply.get('status')}")
        
        print(f"\n🎯 Next Steps:")
        print(f"✅ Identified replies exist")
        print(f"✅ Need to check why nested structure isn't working")
        print(f"🔧 Will fix the backend nested building logic")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_replies_detailed()
