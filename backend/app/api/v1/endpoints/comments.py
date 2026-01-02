from fastapi import APIRouter, Depends, HTTPException, status, Request, Header, Query, Path
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime
from app.db.database import get_db
from app.models.comment import Comment as CommentModel
from app.models.post import Post as PostModel
from app.models.user import User
from app.schemas.comment import (
    Comment, CommentCreate, CommentUpdate, CommentWithReplies,
    CommentStatus, CommentWithPost
)
from app.api.v1.endpoints.auth import get_current_user, get_current_user_optional
from fastapi import BackgroundTasks
from sqlalchemy import or_, func

router = APIRouter(tags=["comments"])

# Rate limiting and spam prevention would be implemented here
# You might want to add Redis or similar for production use

def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    if x_forwarded_for := request.headers.get('X-Forwarded-For'):
        return x_forwarded_for.split(',')[0]
    return request.client.host if request.client else "0.0.0.0"

@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment(
    request: Request,
    comment: CommentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
    user_agent: Optional[str] = Header(None, include_in_schema=False)
):
    """
    Create a new comment.
    
    - **post_id**: ID of the post to comment on (required)
    - **author_name**: Name of the comment author (required)
    - **author_email**: Email of the comment author (required)
    - **content**: Comment content (required)
    - **parent_id**: ID of the parent comment if this is a reply (optional)
    - **status**: Comment status (default: pending)
    """
    # Verify post exists
    post = db.query(PostModel).filter(PostModel.id == comment.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Verify parent comment exists if parent_id is provided
    if comment.parent_id:
        parent_comment = db.query(CommentModel).filter(
            CommentModel.id == comment.parent_id,
            CommentModel.post_id == comment.post_id
        ).first()
        if not parent_comment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent comment not found"
            )
    
    # Create comment data - ensure status is always set to pending for new comments
    comment_data = comment.dict(exclude_unset=True)
    comment_data['status'] = CommentStatus.PENDING  # Force status to pending
    
    # Add client info for moderation
    comment_data.update({
        "ip_address": get_client_ip(request),
        "user_agent": user_agent
    })
    
    # Create and save comment
    db_comment = CommentModel(**comment_data)
    db.add(db_comment)
    
    try:
        db.commit()
        db.refresh(db_comment)
        
        # You could add background tasks here for:
        # - Sending email notifications to post author
        # - Running spam checks
        # - Updating comment counts
        
        return db_comment
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating comment: {str(e)}"
        )


@router.get("/", response_model=List[CommentWithPost])  # Updated response model
async def get_comments(
    post_id: Optional[int] = Query(None, description="Filter by post ID"),
    status: Optional[CommentStatus] = Query(None, description="Filter by comment status"),
    author_email: Optional[str] = Query(None, description="Filter by author email"),
    include_replies: bool = Query(False, description="Include nested replies"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(100, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get a list of comments with optional filtering.
    
    - Regular users can only see approved comments
    - Admins can see all comments including pending ones
    - Comments are ordered by creation date (newest first)
    - Includes post data for each comment
    """
    # Start building the query with joinedload for the post relationship
    query = db.query(CommentModel).options(joinedload(CommentModel.post))
    
    # Apply filters
    if post_id is not None:
        query = query.filter(CommentModel.post_id == post_id)
    
    if status:
        query = query.filter(CommentModel.status == status)
    
    if author_email:
        query = query.filter(CommentModel.author_email.ilike(f"%{author_email}%"))
    
    # Non-admin users can only see approved comments
    if not (current_user and current_user.is_admin):
        query = query.filter(CommentModel.status == CommentStatus.APPROVED)
    
    # Only show top-level comments unless include_replies is True
    if not include_replies:
        query = query.filter(CommentModel.parent_id.is_(None))
    
    # Apply ordering and pagination
    comments = (
        query.order_by(CommentModel.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return comments

@router.get("/count")
async def get_comments_count(
    post_id: Optional[int] = Query(None, description="Filter by post ID"),
    status: Optional[CommentStatus] = Query(None, description="Filter by comment status"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get the count of comments with optional filtering.
    
    - Regular users can only see counts of approved comments
    - Admins can see counts of all comments
    """
    query = db.query(func.count(CommentModel.id))
    
    # Apply filters
    if post_id is not None:
        query = query.filter(CommentModel.post_id == post_id)
    
    if status:
        query = query.filter(CommentModel.status == status)
    
    # Non-admin users can only see approved comments
    if not (current_user and current_user.is_admin):
        query = query.filter(CommentModel.status == CommentStatus.APPROVED)
    
    count = query.scalar()
    return {"count": count}

@router.post("/{comment_id}/approve", response_model=Comment)
async def approve_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Approve a pending comment (admin only).
    
    - Only admin users can approve comments
    - Updates the comment status to 'approved'
    """
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can approve comments"
        )
    
    # Get the comment
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Update status to approved
    comment.status = CommentStatus.APPROVED
    comment.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(comment)
        return comment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error approving comment: {str(e)}"
        )

@router.get("/{comment_id}", response_model=CommentWithReplies)
async def get_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get a comment by ID with its replies.
    
    - Regular users can only see approved comments
    - Admins can see all comments including pending ones
    """
    # Start with the main comment
    comment = (
        db.query(CommentModel)
        .filter(CommentModel.id == comment_id)
        .options(joinedload(CommentModel.replies))
        .first()
    )
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check permissions
    if comment.status != CommentStatus.APPROVED and \
       not (current_user and current_user.is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this comment"
        )
    
    return comment

@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: int,
    comment_update: CommentUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a comment.
    
    - Only the comment author or an admin can update a comment
    - Only content and status can be updated
    """
    # Get the comment
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check permissions
    is_comment_author = (
        comment.author_email and 
        current_user.email and 
        comment.author_email.lower() == current_user.email.lower()
    )
    
    if not (is_comment_author or current_user.is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    # Update fields
    update_data = comment_update.dict(exclude_unset=True)
    
    # Only admins can change status
    if 'status' in update_data and not current_user.is_admin:
        del update_data['status']
    
    # Update the comment
    for field, value in update_data.items():
        setattr(comment, field, value)
    
    # Update the updated_at timestamp
    comment.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(comment)
        return comment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating comment: {str(e)}"
        )

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a comment.
    
    - Only admin users can delete comments
    - Deletes all replies as well (cascade)
    """
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete comments"
        )
    
    # Get the comment with post relationship loaded
    comment = (
        db.query(CommentModel)
        .filter(CommentModel.id == comment_id)
        .first()
    )
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    try:
        # This will also delete all replies due to the cascade setting
        db.delete(comment)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting comment: {str(e)}"
        )


@router.get("/{comment_id}", response_model=CommentWithPost)
async def get_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Get a specific comment by ID.
    - Regular users can only see approved comments
    - Admins can see all comments including pending ones
    """
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if the comment is visible to the current user
    if not comment.is_approved and not (current_user and current_user.is_admin):
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment_dict = {
        "id": comment.id,
        "post_id": comment.post_id,
        "author_name": comment.author_name,
        "author_email": comment.author_email,
        "content": comment.content,
        "status": comment.status,
        "parent_id": comment.parent_id,
        "ip_address": comment.ip_address,
        "user_agent": comment.user_agent,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "post": {
            "id": comment.post.id,
            "title": comment.post.title,
            "slug": comment.post.slug
        }
    }
    return CommentWithPost(**comment_dict)


@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: int,
    comment_update: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a comment.
    - Only the comment author or an admin can update a comment
    - Guest comments cannot be updated (only deleted and recreated)
    """
    db_comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # If it's a guest comment, don't allow updates (only deletion)
    if db_comment.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Guest comments cannot be updated. Please delete and create a new one."
        )
    
    # Only the comment author or an admin can update the comment
    if db_comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    # Update only the allowed fields
    update_data = comment_update.dict(exclude_unset=True)
    for field in ["content"]:  # Only allow updating content for now
        if field in update_data:
            setattr(db_comment, field, update_data[field])
    
    db_comment.updated_at = datetime.utcnow()
    
    try:
        db.commit()
        db.refresh(db_comment)
        return db_comment
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating comment: {str(e)}"
        )


@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
