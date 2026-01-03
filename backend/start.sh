#!/bin/bash

echo "🚀 Starting UKONI Backend..."

# Get PORT from environment, default to 8000
PORT=${PORT:-8000}

echo "📡 Using port: $PORT"
echo "🌍 Host: 0.0.0.0"

# Start the application with the correct port
exec python main.py
