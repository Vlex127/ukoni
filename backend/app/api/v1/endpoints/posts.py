from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.post import Post as PostModel
from app.models.user import User
from app.schemas.post import Post, PostCreate, PostUpdate, PostWithAuthor
from app.api.v1.endpoints.auth import get_current_user
from app.core.cloudinary_config import upload_image
import slugify

router = APIRouter()


@router.post("/", response_model=Post)
def create_post(
    post: PostCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Generate slug from title if not provided
    if not post.slug:
        post.slug = slugify.slugify(post.title)
    
    # Check if slug already exists
    existing_post = db.query(PostModel).filter(PostModel.slug == post.slug).first()
    if existing_post:
        raise HTTPException(
            status_code=400, 
            detail="Post with this slug already exists"
        )
    
    db_post = PostModel(
        **post.dict(),
        author_id=current_user.id
    )
    
    # Set published_at if status is published
    if post.status == "published":
        from datetime import datetime
        db_post.published_at = datetime.utcnow()
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.get("/slug/{slug}", response_model=PostWithAuthor)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(PostModel).join(User).filter(PostModel.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment view count
    post.view_count = (post.view_count or 0) + 1
    db.commit()
    db.refresh(post)
    
    return {
        **post.__dict__,
        "author": {
            "id": post.author.id,
            "username": post.author.username,
            "email": post.author.email,
            "full_name": post.author.full_name
        }
    }


@router.get("/", response_model=List[PostWithAuthor])
def get_posts(
    skip: int = 0, 
    limit: int = 100,
    status: str = None,
    is_featured: bool = None,
    db: Session = Depends(get_db)
):
    query = db.query(PostModel).join(User)
    
    if status:
        query = query.filter(PostModel.status == status)
    
    if is_featured is not None:
        query = query.filter(PostModel.is_featured == is_featured)
    
    posts = query.order_by(PostModel.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for post in posts:
        post_dict = {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "content": post.content,
            "excerpt": post.excerpt,
            "status": post.status,
            "author_id": post.author_id,
            "category": post.category,
            "featured_image": post.featured_image,
            "featured_image_url": post.featured_image_url,
            "featured_image_public_id": post.featured_image_public_id,
            "meta_title": post.meta_title,
            "meta_description": post.meta_description,
            "view_count": post.view_count,
            "is_featured": post.is_featured,
            "published_at": post.published_at,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "author": {
                "id": post.author.id,
                "username": post.author.username,
                "email": post.author.email,
                "full_name": post.author.full_name
            }
        }
        result.append(PostWithAuthor(**post_dict))
    
    return result


@router.get("/{post_id}", response_model=PostWithAuthor)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(PostModel).join(User).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post_dict = {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "content": post.content,
        "excerpt": post.excerpt,
        "status": post.status,
        "author_id": post.author_id,
        "category": post.category,
        "featured_image": post.featured_image,
        "meta_title": post.meta_title,
        "meta_description": post.meta_description,
        "view_count": post.view_count,
        "is_featured": post.is_featured,
        "published_at": post.published_at,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
        "author": {
            "id": post.author.id,
            "username": post.author.username,
            "email": post.author.email,
            "full_name": post.author.full_name
        }
    }
    return PostWithAuthor(**post_dict)


@router.put("/{post_id}", response_model=Post)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Update fields
    update_data = post_update.dict(exclude_unset=True)
    
    # Generate slug if title is updated and slug not provided
    if "title" in update_data and "slug" not in update_data:
        update_data["slug"] = slugify.slugify(update_data["title"])
    
    # Check if new slug already exists (if slug is being updated)
    if "slug" in update_data:
        existing_post = db.query(PostModel).filter(
            PostModel.slug == update_data["slug"],
            PostModel.id != post_id
        ).first()
        if existing_post:
            raise HTTPException(
                status_code=400, 
                detail="Post with this slug already exists"
            )
    
    # Set published_at if status is being changed to published
    if "status" in update_data and update_data["status"] == "published" and post.status != "published":
        from datetime import datetime
        update_data["published_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import os
    from pathlib import Path
    post = db.query(PostModel).filter(PostModel.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Delete associated image from Cloudinary if it exists
    if post.featured_image_public_id:
        try:
            from app.core.cloudinary_config import delete_resource
            success = delete_resource(post.featured_image_public_id, resource_type="image")
            if success:
                print(f"Deleted image from Cloudinary: {post.featured_image_public_id}")
            else:
                print(f"Failed to delete image from Cloudinary: {post.featured_image_public_id}")
        except Exception as e:
            print(f"Error deleting Cloudinary image: {e}")
            # Don't fail the request if Cloudinary deletion fails
    
    db.delete(post)
    db.commit()
    return {"message": "Post and associated image deleted successfully"}


@router.post("/upload-image")
async def upload_post_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload an image to Cloudinary for use in posts
    """
    try:
        # Validate file type
        if file.content_type not in ["image/jpeg", "image/png", "image/gif", "image/webp"]:
            raise HTTPException(
                status_code=400,
                detail="Unsupported image format. Supported formats: JPEG, PNG, GIF, WebP"
            )
        
        # Check file size (10MB limit)
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=400,
                detail="Image file too large. Maximum size is 10MB"
            )
        
        # Create temporary file
        import tempfile
        import os
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Upload to Cloudinary
            result = upload_image(temp_file_path, folder="post_images")
            
            if not result:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to upload image to Cloudinary"
                )
            
            # Return the Cloudinary response
            return {
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
                    "created_at": result.get("created_at")
                }
            }
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
