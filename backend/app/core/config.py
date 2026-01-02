from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "UKONI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"
    
    # Database - SQLite for local development
    DATABASE_URL: Optional[str] = None
    NEON_DATABASE_URL: Optional[str] = None  # Neon connection string
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "ukoni"
    POSTGRES_PORT: int = 5432
    USE_SQLITE: bool = True  # Force SQLite for local development
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://127.0.0.1:8000"]
    
    # Frontend URLs
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"  # Default local development URL
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    @property
    def database_url(self) -> str:
        # Force SQLite for local development - ignore all environment variables
        return "sqlite:///./ukoni.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

print(f"Current working directory: {os.getcwd()}")
print(f"Environment file being used: {os.path.abspath('.env')}")
print(f"File exists: {os.path.exists('.env')}")

settings = Settings()