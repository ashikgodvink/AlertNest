#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AlertNest Development Startup${NC}"
echo "=================================="
echo ""

# Check if backend is already running
if curl -s http://localhost:8000/api/ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is already running${NC}"
else
    echo -e "${YELLOW}⚠️  Backend is not running${NC}"
    echo ""
    echo "Starting backend in a new terminal..."
    echo ""
    
    # Open new terminal and start backend
    osascript -e 'tell application "Terminal"
        do script "cd \"'$(pwd)'/backend\" && source venv/bin/activate && echo \"🔧 Starting Backend...\" && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
        activate
    end tell'
    
    echo "Waiting for backend to start..."
    sleep 5
    
    # Check again
    if curl -s http://localhost:8000/api/ping > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend started successfully${NC}"
    else
        echo -e "${RED}❌ Backend failed to start. Please start manually:${NC}"
        echo "  cd backend && source venv/bin/activate && uvicorn main:app --reload"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Starting Frontend...${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

# Start frontend
cd frontend && npm start
