from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    status = Column(String, default="draft", nullable=False)  # draft, published, archived
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=True, index=True)
    featured_image = Column(String, nullable=True)  # Will store Cloudinary public_id or URL
    featured_image_url = Column(String, nullable=True)  # Store the secure URL from Cloudinary
    featured_image_public_id = Column(String, nullable=True)  # Store Cloudinary public_id for deletion
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    view_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    updated_at = Column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    # Relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("app.models.comment.Comment", back_populates="post", cascade="all, delete-orphan")
