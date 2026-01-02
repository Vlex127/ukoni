#!/usr/bin/env python3

import requests
import json

def test_subscribers_endpoint():
    """Test the subscribers count endpoint"""
    base_url = "http://localhost:8000"
    
    print("Testing subscribers endpoint...")
    
    try:
        # Test the count endpoint
        response = requests.get(f"{base_url}/api/v1/subscribers/count", 
                               headers={
                                   "Origin": "http://localhost:3000",
                                   "Content-Type": "application/json"
                               })
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error Response: {response.text}")
            print(f"Full Response: {response.__dict__}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request Exception: {e}")
        if hasattr(e, 'response'):
            print(f"Response Status: {e.response.status_code}")
            print(f"Response Text: {e.response.text}")
    except Exception as e:
        print(f"General Exception: {e}")

if __name__ == "__main__":
    test_subscribers_endpoint()
