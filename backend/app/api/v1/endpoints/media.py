from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from typing import Optional, List
import os
import tempfile
from app.core.cloudinary_config import upload_video, upload_image, upload_file, delete_resource, get_resource_info
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Supported video formats
SUPPORTED_VIDEO_FORMATS = {
    "video/mp4", "video/avi", "video/mov", "video/wmv", 
    "video/flv", "video/webm", "video/mkv", "video/3gp"
}

# Supported image formats
SUPPORTED_IMAGE_FORMATS = {
    "image/jpeg", "image/png", "image/gif", "image/webp", 
    "image/bmp", "image/tiff", "image/svg+xml"
}

# Supported file formats (documents, etc.)
SUPPORTED_FILE_FORMATS = {
    "application/pdf", "text/plain", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}

@router.post("/upload/video")
async def upload_video_endpoint(
    file: UploadFile = File(...),
    folder: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None)
):
    """
    Upload a video to Cloudinary
    """
    try:
        # Handle empty strings as None
        folder = folder if folder and folder.strip() else "videos"
        title = title if title and title.strip() else None
        description = description if description and description.strip() else None
        # Validate file type
        if file.content_type not in SUPPORTED_VIDEO_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported video format. Supported formats: {', '.join(SUPPORTED_VIDEO_FORMATS)}"
            )
        
        # Check file size (100MB limit for videos)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 100 * 1024 * 1024:  # 100MB
            raise HTTPException(
                status_code=400,
                detail="Video file too large. Maximum size is 100MB"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Upload to Cloudinary
            result = upload_video(temp_file_path, folder=folder)
            
            if not result:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to upload video to Cloudinary"
                )
            
            # Prepare response
            response_data = {
                "success": True,
                "message": "Video uploaded successfully",
                "data": {
                    "public_id": result.get("public_id"),
                    "url": result.get("url"),
                    "secure_url": result.get("secure_url"),
                    "format": result.get("format"),
                    "size": result.get("bytes"),
                    "duration": result.get("duration"),
                    "width": result.get("width"),
                    "height": result.get("height"),
                    "folder": folder,
                    "title": title,
                    "description": description,
                    "created_at": result.get("created_at")
                }
            }
            
            logger.info(f"Video uploaded successfully: {result.get('public_id')}")
            return JSONResponse(content=response_data, status_code=200)
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading video: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/upload/image")
async def upload_image_endpoint(
    file: UploadFile = File(...),
    folder: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None)
):
    """
    Upload an image to Cloudinary
    """
    try:
        # Handle empty strings as None
        folder = folder if folder and folder.strip() else "images"
        title = title if title and title.strip() else None
        description = description if description and description.strip() else None
        # Validate file type
        if file.content_type not in SUPPORTED_IMAGE_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format. Supported formats: {', '.join(SUPPORTED_IMAGE_FORMATS)}"
            )
        
        # Check file size (10MB limit for images)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=400,
                detail="Image file too large. Maximum size is 10MB"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Upload to Cloudinary
            result = upload_image(temp_file_path, folder=folder)
            
            if not result:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to upload image to Cloudinary"
                )
            
            # Prepare response
            response_data = {
                "success": True,
                "message": "Image uploaded successfully",
                "data": {
                    "public_id": result.get("public_id"),
                    "url": result.get("url"),
                    "secure_url": result.get("secure_url"),
                    "format": result.get("format"),
                    "size": result.get("bytes"),
                    "width": result.get("width"),
                    "height": result.get("height"),
                    "folder": folder,
                    "title": title,
                    "description": description,
                    "created_at": result.get("created_at")
                }
            }
            
            logger.info(f"Image uploaded successfully: {result.get('public_id')}")
            return JSONResponse(content=response_data, status_code=200)
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/upload/file")
async def upload_file_endpoint(
    file: UploadFile = File(...),
    folder: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None)
):
    """
    Upload a file (document, etc.) to Cloudinary
    """
    try:
        # Handle empty strings as None
        folder = folder if folder and folder.strip() else "files"
        title = title if title and title.strip() else None
        description = description if description and description.strip() else None
        # Validate file type
        if file.content_type not in SUPPORTED_FILE_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format. Supported formats: {', '.join(SUPPORTED_FILE_FORMATS)}"
            )
        
        # Check file size (20MB limit for files)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 20 * 1024 * 1024:  # 20MB
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 20MB"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Upload to Cloudinary
            result = upload_file(temp_file_path, folder=folder)
            
            if not result:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to upload file to Cloudinary"
                )
            
            # Prepare response
            response_data = {
                "success": True,
                "message": "File uploaded successfully",
                "data": {
                    "public_id": result.get("public_id"),
                    "url": result.get("url"),
                    "secure_url": result.get("secure_url"),
                    "format": result.get("format"),
                    "size": result.get("bytes"),
                    "folder": folder,
                    "title": title,
                    "description": description,
                    "created_at": result.get("created_at")
                }
            }
            
            logger.info(f"File uploaded successfully: {result.get('public_id')}")
            return JSONResponse(content=response_data, status_code=200)
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.delete("/delete/{public_id}")
async def delete_media_endpoint(public_id: str, resource_type: str = "auto"):
    """
    Delete a media file from Cloudinary
    """
    try:
        success = delete_resource(public_id, resource_type)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Resource not found or could not be deleted"
            )
        
        response_data = {
            "success": True,
            "message": "Resource deleted successfully",
            "data": {
                "public_id": public_id,
                "resource_type": resource_type
            }
        }
        
        logger.info(f"Resource deleted successfully: {public_id}")
        return JSONResponse(content=response_data, status_code=200)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting resource: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/info/{public_id}")
async def get_media_info_endpoint(public_id: str, resource_type: str = "auto"):
    """
    Get information about a media file from Cloudinary
    """
    try:
        result = get_resource_info(public_id, resource_type)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="Resource not found"
            )
        
        response_data = {
            "success": True,
            "message": "Resource information retrieved successfully",
            "data": result
        }
        
        return JSONResponse(content=response_data, status_code=200)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting resource info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/upload/multiple")
async def upload_multiple_files_endpoint(
    files: List[UploadFile] = File(...),
    folder: Optional[str] = Form(None),
    resource_type: Optional[str] = Form(None)
):
    """
    Upload multiple files to Cloudinary
    """
    try:
        # Handle empty strings as None
        folder = folder if folder and folder.strip() else "uploads"
        resource_type = resource_type if resource_type and resource_type.strip() else "auto"
        results = []
        errors = []
        
        for i, file in enumerate(files):
            try:
                # Determine file type and validate
                if file.content_type in SUPPORTED_VIDEO_FORMATS:
                    if len(await file.read()) > 100 * 1024 * 1024:
                        errors.append(f"File {file.filename}: Video too large (max 100MB)")
                        continue
                    upload_func = upload_video
                elif file.content_type in SUPPORTED_IMAGE_FORMATS:
                    if len(await file.read()) > 10 * 1024 * 1024:
                        errors.append(f"File {file.filename}: Image too large (max 10MB)")
                        continue
                    upload_func = upload_image
                elif file.content_type in SUPPORTED_FILE_FORMATS:
                    if len(await file.read()) > 20 * 1024 * 1024:
                        errors.append(f"File {file.filename}: File too large (max 20MB)")
                        continue
                    upload_func = upload_file
                else:
                    errors.append(f"File {file.filename}: Unsupported format")
                    continue
                
                # Reset file pointer
                await file.seek(0)
                
                # Create temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
                    content = await file.read()
                    temp_file.write(content)
                    temp_file_path = temp_file.name
                
                try:
                    # Upload to Cloudinary
                    result = upload_func(temp_file_path, folder=folder)
                    
                    if result:
                        results.append({
                            "filename": file.filename,
                            "public_id": result.get("public_id"),
                            "url": result.get("secure_url"),
                            "format": result.get("format"),
                            "size": result.get("bytes")
                        })
                    else:
                        errors.append(f"File {file.filename}: Upload failed")
                        
                finally:
                    # Clean up temporary file
                    if os.path.exists(temp_file_path):
                        os.unlink(temp_file_path)
                        
            except Exception as e:
                errors.append(f"File {file.filename}: {str(e)}")
        
        response_data = {
            "success": len(results) > 0,
            "message": f"Uploaded {len(results)} files successfully",
            "data": {
                "uploaded": results,
                "errors": errors
            }
        }
        
        return JSONResponse(content=response_data, status_code=200)
        
    except Exception as e:
        logger.error(f"Error in multiple file upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
