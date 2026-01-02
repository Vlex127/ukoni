import requests
import os
from pathlib import Path

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_image_upload():
    """Test image upload functionality"""
    print("Testing Image Upload...")
    
    # Create a test image file (you can replace this with an actual image file)
    test_image_path = "test_image.jpg"
    
    # If you have an actual image file, use it instead
    # For now, let's create a simple text file to test the upload mechanism
    if not os.path.exists(test_image_path):
        with open(test_image_path, "w") as f:
            f.write("This is a test file for upload testing")
    
    try:
        with open(test_image_path, "rb") as f:
            files = {"file": (test_image_path, f, "image/jpeg")}
            data = {
                "folder": "test_images",
                "title": "Test Image",
                "description": "This is a test image upload"
            }
            
            response = requests.post(f"{BASE_URL}/api/v1/media/upload/image", files=files, data=data)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except Exception as e:
        print(f"Error uploading image: {e}")
    finally:
        # Clean up test file
        if os.path.exists(test_image_path):
            os.remove(test_image_path)

def test_video_upload():
    """Test video upload functionality"""
    print("\nTesting Video Upload...")
    
    # Create a test video file path (you need to provide an actual video file)
    test_video_path = "test_video.mp4"
    
    # Check if you have a test video file
    if not os.path.exists(test_video_path):
        print(f"Please place a test video file at: {test_video_path}")
        print("Or modify the path to point to an existing video file")
        return
    
    try:
        with open(test_video_path, "rb") as f:
            files = {"file": (test_video_path, f, "video/mp4")}
            data = {
                "folder": "test_videos",
                "title": "Test Video",
                "description": "This is a test video upload"
            }
            
            response = requests.post(f"{BASE_URL}/api/v1/media/upload/video", files=files, data=data)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except Exception as e:
        print(f"Error uploading video: {e}")

def test_file_upload():
    """Test file upload functionality"""
    print("\nTesting File Upload...")
    
    # Create a test PDF file
    test_file_path = "test_document.pdf"
    
    if not os.path.exists(test_file_path):
        with open(test_file_path, "w") as f:
            f.write("This is a test document for upload testing")
    
    try:
        with open(test_file_path, "rb") as f:
            files = {"file": (test_file_path, f, "application/pdf")}
            data = {
                "folder": "test_files",
                "title": "Test Document",
                "description": "This is a test document upload"
            }
            
            response = requests.post(f"{BASE_URL}/api/v1/media/upload/file", files=files, data=data)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except Exception as e:
        print(f"Error uploading file: {e}")
    finally:
        # Clean up test file
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

def test_health_check():
    """Test if the server is running"""
    print("Testing Health Check...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error connecting to server: {e}")
        return False

def check_cloudinary_config():
    """Check if Cloudinary is configured"""
    print("Checking Cloudinary Configuration...")
    
    try:
        from app.core.config import settings
        print(f"Cloud Name: {settings.CLOUDINARY_CLOUD_NAME}")
        print(f"API Key: {settings.CLOUDINARY_API_KEY}")
        print(f"API Secret: {'*' * len(settings.CLOUDINARY_API_SECRET) if settings.CLOUDINARY_API_SECRET else 'None'}")
        
        if not all([settings.CLOUDINARY_CLOUD_NAME, settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET]):
            print("⚠️  Cloudinary is not fully configured. Please update your .env file with actual Cloudinary credentials.")
            return False
        else:
            print("✅ Cloudinary configuration found")
            return True
    except Exception as e:
        print(f"Error checking configuration: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Cloudinary Upload Functionality")
    print("=" * 50)
    
    # Check Cloudinary configuration
    cloudinary_configured = check_cloudinary_config()
    
    # Test server health
    if test_health_check():
        print("\n✅ Server is running!")
        
        if cloudinary_configured:
            # Run upload tests
            test_image_upload()
            test_file_upload()
            test_video_upload()
        else:
            print("\n⚠️  Skipping upload tests - Cloudinary not configured")
            print("Please update your .env file with Cloudinary credentials:")
            print("CLOUDINARY_CLOUD_NAME=your_cloud_name")
            print("CLOUDINARY_API_KEY=your_api_key")
            print("CLOUDINARY_API_SECRET=your_api_secret")
    else:
        print("\n❌ Server is not running. Please start the server first.")
