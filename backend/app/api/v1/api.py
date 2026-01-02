from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, posts, comments, uploads, subscribers, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(subscribers.router, prefix="/subscribers", tags=["subscribers"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
