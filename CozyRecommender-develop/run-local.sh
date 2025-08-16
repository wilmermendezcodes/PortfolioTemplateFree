#!/bin/bash

echo "🚀 Starting Cozy Recommendations locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️ Please edit .env file with your database credentials"
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Function to check if port is in use
port_in_use() {
    if command -v lsof &> /dev/null; then
        lsof -i :$1 &> /dev/null
    elif command -v netstat &> /dev/null; then
        netstat -an | grep :$1 &> /dev/null
    else
        return 1
    fi
}

# Find available port
echo "🔍 Finding available port..."
PORT=3000

for port in 3000 3001 5000 5001 8000 8080 4000; do
    if ! port_in_use $port; then
        PORT=$port
        break
    fi
done

echo "✅ Using port $PORT"
echo "🌐 Server will be available at: http://localhost:$PORT"
echo "📱 Also try: http://127.0.0.1:$PORT"

# Start the server
export PORT=$PORT
export NODE_ENV=development
npm run dev