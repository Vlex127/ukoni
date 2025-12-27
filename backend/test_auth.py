#!/usr/bin/env python3

import requests
import json

# Test backend health
try:
    response = requests.get("http://localhost:8000/health")
    print(f"Health check: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"Health check failed: {e}")

# Test registration
try:
    user_data = {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass",
        "full_name": "Test User"
    }
    response = requests.post(
        "http://localhost:8000/api/v1/auth/register",
        json=user_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Registration: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Registration failed: {e}")

# Test login
try:
    login_data = {
        "username": "testuser",
        "password": "testpass"
    }
    response = requests.post(
        "http://localhost:8000/api/v1/auth/login",
        data=login_data  # Form data for login
    )
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Login failed: {e}")
