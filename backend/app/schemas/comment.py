# schemas/comment.py
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List, ForwardRef
import re
from enum import Enum

class CommentStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    SPAM = "spam"
    TRASH = "trash"

class CommentBase(BaseModel):
    """Base schema for comment operations"""
    content: str = Field(..., min_length=1, max_length=5000)
    author_name: str = Field(..., min_length=2, max_length=100)
    author_email: EmailStr = Field(..., max_length=255)
    parent_id: Optional[int] = None
    
    @validator('content')
    def content_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Comment content cannot be empty')
        return v.strip()
    
    @validator('author_name')
    def validate_author_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Name is required')
        if not re.match(r'^[\w\s\-\.,\']+$', v.strip()):
            raise ValueError('Name contains invalid characters')
        return v.strip()

class CommentCreate(CommentBase):
    """Schema for creating a new comment"""
    post_id: int
    status: CommentStatus = CommentStatus.PENDING
    
    class Config:
        use_enum_values = True
        schema_extra = {
            "example": {
                "post_id": 1,
                "author_name": "John Doe",
                "author_email": "john@example.com",
                "content": "This is a great post!",
                "parent_id": None,
                "status": "pending"
            }
        }

class CommentUpdate(BaseModel):
    """Schema for updating an existing comment"""
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    status: Optional[CommentStatus] = None
    
    @validator('content')
    def content_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Comment content cannot be empty')
        return v.strip() if v else v
    
    class Config:
        use_enum_values = True

class CommentInDBBase(CommentBase):
    """Base schema for comment in database"""
    id: int
    post_id: int
    status: CommentStatus
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        use_enum_values = True

class Comment(CommentInDBBase):
    """Schema for returning comment data"""
    replies: List['Comment'] = []
    
    class Config:
        orm_mode = True
        use_enum_values = True

class CommentWithReplies(CommentInDBBase):
    """Schema for comment with nested replies"""
    replies: List['CommentWithReplies'] = []
    
    class Config:
        orm_mode = True
        use_enum_values = True

class CommentWithPost(CommentInDBBase):
    """Schema for comment with post information"""
    post: Optional['Post'] = None

    class Config:
        from_attributes = True

# Import Post model for relationship
from app.schemas.post import Post

# Update forward reference for nested models
CommentWithReplies.update_forward_refs()
CommentWithPost.update_forward_refs()