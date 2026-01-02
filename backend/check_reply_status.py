#!/usr/bin/env python3

import requests

def check_reply_status():
    """Check the status of replies to see if they're being filtered"""
    
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBubnR0cy5jb20iLCJleHAiOjE3NjgwNjYwNzl9.yHteKgbo3EQL9ElFTUHoemPGtqpRGNJ1FJI6K2h_ams",
        "Content-Type": "application/json"
    }
    
    try:
        print("🔍 Check Reply Status")
        print("=" * 40)
        
        # Get all comments to check their status
        print("\n📝 Getting all comments with status...")
        all_response = requests.get("http://localhost:8000/api/v1/comments?post_id=1", headers=headers)
        
        if all_response.status_code == 200:
            all_comments = all_response.json()
            print(f"   📊 Total comments: {len(all_comments)}")
            
            # Group by parent
            parent_child_map = {}
            for comment in all_comments:
                parent_id = comment.get('parent_id')
                if parent_id is None:
                    parent_child_map[comment['id']] = {
                        'parent': comment,
                        'replies': []
                    }
                else:
                    if parent_id not in parent_child_map:
                        parent_child_map[parent_id] = {'parent': None, 'replies': []}
                    parent_child_map[parent_id]['replies'].append(comment)
            
            print(f"\n📊 Parent-Child Relationships:")
            for parent_id, data in parent_child_map.items():
                if data['parent']:
                    print(f"   📝 Parent {parent_id}: {data['parent']['author_name']} - Status: {data['parent'].get('status')}")
                    
                    for reply in data['replies']:
                        print(f"      ↳ Reply {reply['id']}: {reply['author_name']} - Status: {reply.get('status')}")
                else:
                    print(f"   ⚠️  Orphan replies for parent {parent_id}:")
                    for reply in data['replies']:
                        print(f"      ↳ Reply {reply['id']}: {reply['author_name']} - Status: {reply.get('status')}")
        
        print(f"\n🎯 Issue Analysis:")
        print(f"✅ Replies exist in database")
        print(f"✅ Single comment endpoint shows them")
        print(f"⚠️  List endpoint with include_replies doesn't show them")
        print(f"🔍 Possible causes:")
        print(f"   - Status filtering issue")
        print(f"   - Query building issue")
        print(f"   - Schema serialization issue")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_reply_status()
