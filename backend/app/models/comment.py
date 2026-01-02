# In your backend code, find the Comment model and schema
# It should look something like this:
# models/comment.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    author_name = Column(String(100), nullable=False)
    author_email = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, server_default="pending")
    ip_address = Column(String(45), nullable=True)  # Store IP for rate limiting/abuse prevention
    user_agent = Column(Text, nullable=True)  # Store browser info for moderation
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)  # For nested comments
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=True)

    # Relationships
    post = relationship("Post", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], back_populates="replies")
    replies = relationship("Comment", back_populates="parent", cascade="all, delete-orphan")

    @property
    def is_approved(self):
        """Check if the comment is approved"""
        return self.status == "approved"

    @property
    def is_guest_comment(self):
        """Check if this is a guest comment (no associated user)"""
        return not hasattr(self, 'user_id') or self.user_id is None

    def __repr__(self):
        return f"<Comment {self.id} on post {self.post_id} by {self.author_name}>"