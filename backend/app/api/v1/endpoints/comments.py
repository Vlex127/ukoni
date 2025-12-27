from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.post import Comment as CommentModel, Post as PostModel
from app.models.user import User
from app.schemas.post import Comment, CommentCreate, CommentUpdate, CommentWithPost
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=Comment)
def create_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db)
):
    # Verify post exists
    post = db.query(PostModel).filter(PostModel.id == comment.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_comment = CommentModel(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


@router.get("/", response_model=List[CommentWithPost])
def get_comments(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    post_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(CommentModel).join(PostModel)
    
    if status:
        query = query.filter(CommentModel.status == status)
    
    if post_id:
        query = query.filter(CommentModel.post_id == post_id)
    
    comments = query.order_by(CommentModel.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for comment in comments:
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
        result.append(CommentWithPost(**comment_dict))
    
    return result


@router.get("/{comment_id}", response_model=CommentWithPost)
def get_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(CommentModel).join(PostModel).filter(CommentModel.id == comment_id).first()
    if not comment:
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
def update_comment(
    comment_id: int,
    comment_update: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    update_data = comment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(comment, field, value)
    
    db.commit()
    db.refresh(comment)
    return comment


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
