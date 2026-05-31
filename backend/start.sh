#!/bin/bash
# Clinic Management System - Backend Startup Script

echo "=========================================="
echo "Clinic Management System - Backend Setup"
echo "=========================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please update MONGO_URI with your MongoDB connection string."
    echo "📝 Edit .env and set your MongoDB Atlas credentials"
    exit 1
fi

# Check if MONGO_URI is set
if grep -q "^MONGO_URI=mongodb" .env; then
    MONGO_URI=$(grep "^MONGO_URI=" .env | cut -d '=' -f 2-)
    echo "✅ MONGO_URI configured: ${MONGO_URI:0:50}..."
else
    echo "⚠️  MONGO_URI not found or not configured!"
    echo "Please add your MongoDB Atlas connection string to .env"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo ""
echo "🚀 Starting backend server..."
npm run dev
