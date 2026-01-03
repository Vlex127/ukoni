#!/bin/bash

echo "🚀 Starting UKONI Backend on Railway..."

# Wait for database to be ready (if PostgreSQL)
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️ Database URL detected, waiting for database..."
    sleep 2
fi

# Create tables if they don't exist
echo "📋 Creating database tables..."
python -c "
from app.db.database import engine, Base
from app.models import user, post, comment, subscriber, analytics
print('Creating database tables...')
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"

echo "✅ Database initialized, starting server..."
python main.py
