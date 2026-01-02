from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints import comments, subscribers

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# --- CORS SETUP ---
# Define allowed origins explicitly
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # IMPORTANT: Add your deployed Frontend URL here once you deploy it (e.g. Vercel/Netlify)
    "https://ukoni.vercel.app", 
    "https://ukoni.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r'https?://(localhost|127\.0\.0\.1)(:\d+)?',  # Allow any port on localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(comments.router, prefix="/api/v1/comments", tags=["comments"])
app.include_router(subscribers.router, prefix="/api/v1/subscribers", tags=["subscribers"])

# Mount static files
BASE_DIR = Path(__file__).resolve().parent  
PUBLIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "public"))
UPLOADS_DIR = os.path.join(PUBLIC_DIR, "uploads")

# Mount the main public directory
if os.path.exists(PUBLIC_DIR):
    print(f"Serving static files from: {PUBLIC_DIR}")
    app.mount("/public", StaticFiles(directory=PUBLIC_DIR), name="public")
else:
    print(f"WARNING: Public directory not found at {PUBLIC_DIR}")

# Mount uploads directory to /api/v1/uploads
if os.path.exists(UPLOADS_DIR):
    print(f"Serving uploads from: {UPLOADS_DIR}")
    app.mount("/api/v1/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
else:
    print(f"WARNING: Uploads directory not found at {UPLOADS_DIR}")

@app.get("/")
async def root():
    return {"message": "Welcome to UKONI Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Get the PORT from Render's environment variable, default to 8000 if running locally
    port = int(os.environ.get("PORT", 8000))
    
    # Run the server using the dynamic port
    uvicorn.run(app, host="0.0.0.0", port=port)