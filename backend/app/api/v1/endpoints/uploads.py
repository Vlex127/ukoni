import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from typing import Optional
import uuid
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_DIR = Path("public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def get_unique_filename(filename: str) -> str:
    """Generate a unique filename to prevent overwrites"""
    ext = filename.split('.')[-1]
    return f"{uuid.uuid4()}.{ext}"

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    # Ensure upload directory exists
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Upload directory: {UPLOAD_DIR.absolute()}")
    print(f"Directory exists: {UPLOAD_DIR.exists()}")
    print(f"Directory is writable: {os.access(str(UPLOAD_DIR), os.W_OK)}")
    
    # Generate a unique filename
    filename = get_unique_filename(file.filename)
    file_path = UPLOAD_DIR / filename
    print(f"Saving file to: {file_path.absolute()}")
    
    # Save the file
    try:
        contents = await file.read()
        print(f"Read {len(contents)} bytes from uploaded file")
        
        with open(file_path, 'wb') as f:
            f.write(contents)
        
        print(f"File saved successfully. File exists: {file_path.exists()}")
        print(f"File size: {file_path.stat().st_size} bytes")
        
    except Exception as e:
        import traceback
        print(f"Error saving file: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")
    
    return {"filename": filename, "path": f"/public/uploads/{filename}"}

@router.get("/{filename}")
async def get_uploaded_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
