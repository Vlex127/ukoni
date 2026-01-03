from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path
import os
from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints import comments, subscribers, media

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
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    # IMPORTANT: Add your deployed Frontend URL here once you deploy it (e.g. Vercel/Netlify)
    "https://ukoni.vercel.app", 
    "https://ukoni.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,  # Use settings from config
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(subscribers.router, prefix="/api/v1/subscribers", tags=["subscribers"])
app.include_router(media.router, prefix="/api/v1/media", tags=["media"])

# Mount static files
BASE_DIR = Path(__file__).resolve().parent  

# Try different paths for public directory (container vs local)
PUBLIC_DIR = None
possible_paths = [
    os.path.abspath(os.path.join(BASE_DIR, "..", "public")),  # Local development
    os.path.abspath(os.path.join(BASE_DIR, "public")),       # Container
    "/public",                                                 # Container absolute path
]

for path in possible_paths:
    if os.path.exists(path):
        PUBLIC_DIR = path
        break

# If no public directory found, create one in the backend directory
if not PUBLIC_DIR:
    PUBLIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "public"))
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    print(f"Created public directory at: {PUBLIC_DIR}")

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
    # Create the uploads directory if it doesn't exist
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    print(f"Created uploads directory at: {UPLOADS_DIR}")
    print(f"Serving uploads from: {UPLOADS_DIR}")
    app.mount("/api/v1/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Mount test HTML file
TEST_HTML_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "test_upload.html"))
if os.path.exists(TEST_HTML_PATH):
    print(f"Serving test upload page at: /test-upload")
    @app.get("/test-upload", response_class=HTMLResponse)
    async def serve_test_upload():
        with open(TEST_HTML_PATH, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
else:
    print(f"WARNING: Test HTML file not found at {TEST_HTML_PATH}")

# Mount Cloudinary post test HTML file
CLOUDINARY_TEST_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "test_post_cloudinary.html"))
if os.path.exists(CLOUDINARY_TEST_PATH):
    print(f"Serving Cloudinary post test page at: /test-post-cloudinary")
    @app.get("/test-post-cloudinary", response_class=HTMLResponse)
    async def serve_cloudinary_test():
        with open(CLOUDINARY_TEST_PATH, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
else:
    print(f"WARNING: Cloudinary test HTML file not found at {CLOUDINARY_TEST_PATH}")

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