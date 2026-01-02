import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Optional, Dict, Any
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure Cloudinary
def configure_cloudinary():
    """Configure Cloudinary with settings from environment"""
    try:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET
        )
        logger.info("Cloudinary configured successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to configure Cloudinary: {e}")
        return False

# Initialize Cloudinary configuration
configure_cloudinary()

def upload_video(file_path: str, folder: str = "videos", resource_type: str = "video") -> Optional[Dict[str, Any]]:
    """
    Upload a video to Cloudinary
    
    Args:
        file_path: Path to the video file
        folder: Cloudinary folder to store the video
        resource_type: Type of resource (video, auto, etc.)
    
    Returns:
        Dictionary with upload response or None if failed
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type=resource_type,
            chunk_size=6000000,  # 6MB chunks for large files
            eager=[
                {"quality": "auto", "fetch_format": "mp4"},
                {"quality": "auto", "fetch_format": "webm"}
            ],
            eager_async=True
        )
        logger.info(f"Video uploaded successfully: {result['public_id']}")
        return result
    except Exception as e:
        logger.error(f"Failed to upload video: {e}")
        return None

def upload_image(file_path: str, folder: str = "images") -> Optional[Dict[str, Any]]:
    """
    Upload an image to Cloudinary
    
    Args:
        file_path: Path to the image file
        folder: Cloudinary folder to store the image
    
    Returns:
        Dictionary with upload response or None if failed
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="image",
            quality="auto",
            fetch_format="auto"
        )
        logger.info(f"Image uploaded successfully: {result['public_id']}")
        return result
    except Exception as e:
        logger.error(f"Failed to upload image: {e}")
        return None

def upload_file(file_path: str, folder: str = "files", resource_type: str = "auto") -> Optional[Dict[str, Any]]:
    """
    Upload any file to Cloudinary
    
    Args:
        file_path: Path to the file
        folder: Cloudinary folder to store the file
        resource_type: Type of resource (auto, image, video, raw)
    
    Returns:
        Dictionary with upload response or None if failed
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type=resource_type
        )
        logger.info(f"File uploaded successfully: {result['public_id']}")
        return result
    except Exception as e:
        logger.error(f"Failed to upload file: {e}")
        return None

def delete_resource(public_id: str, resource_type: str = "auto") -> bool:
    """
    Delete a resource from Cloudinary
    
    Args:
        public_id: Public ID of the resource to delete
        resource_type: Type of resource (auto, image, video, raw)
    
    Returns:
        True if deleted successfully, False otherwise
    """
    try:
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        logger.info(f"Resource deleted: {public_id}")
        return result.get("result") == "ok"
    except Exception as e:
        logger.error(f"Failed to delete resource {public_id}: {e}")
        return False

def get_resource_info(public_id: str, resource_type: str = "auto") -> Optional[Dict[str, Any]]:
    """
    Get information about a resource from Cloudinary
    
    Args:
        public_id: Public ID of the resource
        resource_type: Type of resource (auto, image, video, raw)
    
    Returns:
        Dictionary with resource information or None if failed
    """
    try:
        result = cloudinary.api.resource(public_id, resource_type=resource_type)
        return result
    except Exception as e:
        logger.error(f"Failed to get resource info for {public_id}: {e}")
        return None

def generate_video_url(public_id: str, transformations: Optional[Dict[str, Any]] = None) -> str:
    """
    Generate a URL for a video with optional transformations
    
    Args:
        public_id: Public ID of the video
        transformations: Dictionary of Cloudinary transformations
    
    Returns:
        URL string
    """
    try:
        url = cloudinary.utils.cloudinary_url(
            public_id,
            resource_type="video",
            **(transformations or {})
        )
        return url[0]  # cloudinary_url returns (url, options)
    except Exception as e:
        logger.error(f"Failed to generate video URL for {public_id}: {e}")
        return f"https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/video/upload/{public_id}"

def generate_image_url(public_id: str, transformations: Optional[Dict[str, Any]] = None) -> str:
    """
    Generate a URL for an image with optional transformations
    
    Args:
        public_id: Public ID of the image
        transformations: Dictionary of Cloudinary transformations
    
    Returns:
        URL string
    """
    try:
        url = cloudinary.utils.cloudinary_url(
            public_id,
            resource_type="image",
            **(transformations or {})
        )
        return url[0]  # cloudinary_url returns (url, options)
    except Exception as e:
        logger.error(f"Failed to generate image URL for {public_id}: {e}")
        return f"https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/image/upload/{public_id}"
