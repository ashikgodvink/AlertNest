#!/bin/bash
# Start backend in background
cd backend && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
# Wait for backend to start
sleep 3
# Start frontend
cd ../frontend && npm start
