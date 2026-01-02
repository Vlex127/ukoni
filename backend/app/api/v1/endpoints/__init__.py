from fastapi import APIRouter
from . import auth, users, posts, comments, uploads, subscribers, analytics

# Create a router for all endpoints
router = APIRouter()

# Include all endpoint routers
router.include_router(auth.router)
router.include_router(users.router)
router.include_router(posts.router)
router.include_router(comments.router)
router.include_router(uploads.router)
router.include_router(subscribers.router)
router.include_router(analytics.router)

__all__ = ["router", "auth", "users", "posts", "comments", "uploads", "subscribers", "analytics"]