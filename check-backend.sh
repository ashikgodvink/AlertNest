#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking Backend Status..."
echo ""

# Check if backend is running on port 8000
if curl -s http://localhost:8000/api/ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:8000${NC}"
    echo ""
    
    # Test MongoDB connection
    response=$(curl -s http://localhost:8000/api/ping)
    echo "Backend response: $response"
    echo ""
    echo -e "${GREEN}🎉 Everything looks good!${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo ""
    echo -e "${YELLOW}To start the backend:${NC}"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    echo ""
    exit 1
fi
