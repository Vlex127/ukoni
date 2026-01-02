from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PostBase(BaseModel):
    title: str
    slug: Optional[str] = None
    content: str
    excerpt: Optional[str] = None
    status: str = "draft"
    category: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: bool = False


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: Optional[bool] = None


class Post(PostBase):
    id: int
    author_id: int
    view_count: int = 0
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PostWithAuthor(Post):
    author: dict


class CommentBase(BaseModel):
    author_name: str
    author_email: str
    content: str
    status: str = "pending"
    parent_id: Optional[int] = None


class CommentCreate(CommentBase):
    post_id: int


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[str] = None


class Comment(CommentBase):
    id: int
    post_id: int
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CommentWithPost(Comment):
    post: dict
