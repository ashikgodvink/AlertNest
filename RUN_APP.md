# 🚀 How to Run AlertNest

## Quick Start (Recommended)

### Option 1: Automatic Startup Script
```bash
./start-dev.sh
```
This script will:
- Check if backend is running
- Start backend in a new terminal if needed
- Install frontend dependencies if needed
- Start the frontend

---

### Option 2: Manual Startup (2 Terminals)

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

---

## 🔍 Troubleshooting

### Check Backend Status
```bash
./check-backend.sh
```

### Common Issues

#### 1. "Failed to load resource: net::ERR_CONNECTION_TIMED_OUT"

**Cause:** Backend is not running

**Solution:**
```bash
# Terminal 1
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Wait until you see:
```
✅ Connected to MongoDB
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Then refresh your browser.

---

#### 2. "Cannot connect to backend"

**Cause:** Backend crashed or MongoDB connection failed

**Solution:**
1. Check backend terminal for errors
2. Verify MongoDB connection string in `backend/.env`
3. Restart backend:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

---

#### 3. Port Already in Use

**Backend (Port 8000):**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Then restart backend
cd backend && source venv/bin/activate && uvicorn main:app --reload
```

**Frontend (Port 3000):**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart frontend
cd frontend && npm start
```

---

#### 4. Module Not Found Errors

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Verify Everything is Working

### 1. Check Backend
Open browser: http://localhost:8000/api/ping

Should see: `{"message":"pong"}`

### 2. Check Frontend
Open browser: http://localhost:3000

Should see: AlertNest login page

### 3. Check Browser Console
Press F12 → Console tab

Should NOT see any red errors about "Failed to load resource"

---

## 📝 Environment Files

### Backend `.env` (already configured)
```
MONGODB_URL=mongodb+srv://...
GOOGLE_CLIENT_ID=...
```

### Frontend `.env` (now created)
```
REACT_APP_API_URL=http://localhost:8000
```

---

## 🔄 Daily Workflow

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend && source venv/bin/activate && uvicorn main:app --reload
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend && npm start
   ```

3. **Develop** 🎨
   - Both servers auto-reload on file changes
   - Backend: Python files
   - Frontend: React files

4. **Stop Servers**
   - Press `Ctrl+C` in each terminal

---

## 🎉 Success Indicators

### Backend Terminal:
```
✅ Connected to MongoDB
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Frontend Terminal:
```
Compiled successfully!

You can now view alertnest-frontend in the browser.

  Local:            http://localhost:3000
```

### Browser Console:
- No red errors
- Can login/signup
- Dashboard loads with data

---

## 🆘 Still Having Issues?

1. **Check Backend Logs** - Look for errors in Terminal 1
2. **Check Browser Console** - Press F12, look for errors
3. **Verify MongoDB** - Ensure connection string is correct
4. **Restart Everything**:
   ```bash
   # Kill all processes
   lsof -ti:8000 | xargs kill -9
   lsof -ti:3000 | xargs kill -9
   
   # Start fresh
   ./start-dev.sh
   ```

---

## 🔐 First Time Setup Checklist

- [x] Backend `.env` file exists
- [x] Frontend `.env` file exists (now created)
- [x] MongoDB connection string configured
- [x] Python virtual environment activated
- [x] Backend dependencies installed (`pip install -r requirements.txt`)
- [x] Frontend dependencies installed (`npm install`)
- [x] Firebase configuration in `frontend/src/firebase.js`

---

## 📦 Production Deployment

For production deployment, see `docs/SETUP.md`

---

**Happy Coding! 🚀**
