#!/bin/bash

echo "🚀 Starting UKONI Backend... (Updated: 2026-01-03 01:42)"

# Get PORT from environment, default to 8000
PORT=${PORT:-8000}

echo "📡 Using port: $PORT"
echo "🌍 Host: 0.0.0.0"
echo "🔍 Environment variables:"
echo "   PORT=$PORT"
echo "   RAILWAY_ENVIRONMENT=${RAILWAY_ENVIRONMENT:-not_set}"

# Export PORT for Python to see
export PORT

# Start the application
exec python main.py
