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
    
    # Database - Support both SQLite and PostgreSQL
    DATABASE_URL: Optional[str] = None
    NEON_DATABASE_URL: Optional[str] = None  # Neon connection string
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "ukoni"
    POSTGRES_PORT: int = 5432
    USE_SQLITE: bool = False  # Default to PostgreSQL for production
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:8000", 
        "http://127.0.0.1:8000",
        "https://ukoni-production.up.railway.app",
        "https://ukoni-production.up.railway.app/*",
        "*"  # Allow all origins for Railway deployment
    ]
    
    # Frontend URLs
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"  # Default local development URL
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    @property
    def database_url(self) -> str:
        # Priority order for database URL
        if self.DATABASE_URL:
            print(f"🗄️ Using DATABASE_URL: {self.DATABASE_URL}")
            return self.DATABASE_URL
        elif self.NEON_DATABASE_URL:
            print(f"🗄️ Using NEON_DATABASE_URL: {self.NEON_DATABASE_URL}")
            return self.NEON_DATABASE_URL
        elif self.USE_SQLITE:
            print(f"🗄️ Using SQLite (local development)")
            return "sqlite:///./ukoni.db"
        else:
            # Build PostgreSQL URL from individual settings
            postgres_url = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            print(f"🗄️ Using PostgreSQL: {postgres_url}")
            return postgres_url
    
    class Config:
        env_file = ".env"
        case_sensitive = True

print(f"Current working directory: {os.getcwd()}")
print(f"Environment file being used: {os.path.abspath('.env')}")
print(f"File exists: {os.path.exists('.env')}")

# Debug Railway environment variables
print(f"🔍 Environment Variables:")
print(f"   DATABASE_URL: {os.environ.get('DATABASE_URL', 'NOT_SET')}")
print(f"   NEON_DATABASE_URL: {os.environ.get('NEON_DATABASE_URL', 'NOT_SET')}")
print(f"   POSTGRES_SERVER: {os.environ.get('POSTGRES_SERVER', 'NOT_SET')}")
print(f"   POSTGRES_USER: {os.environ.get('POSTGRES_USER', 'NOT_SET')}")
print(f"   POSTGRES_PASSWORD: {os.environ.get('POSTGRES_PASSWORD', 'NOT_SET')}")
print(f"   POSTGRES_DB: {os.environ.get('POSTGRES_DB', 'NOT_SET')}")
print(f"   POSTGRES_PORT: {os.environ.get('POSTGRES_PORT', 'NOT_SET')}")

settings = Settings()