# AlertNest Setup with MongoDB

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB (local or cloud)
- Firebase project
- Git

## Backend Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd AlertNestProject/backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On macOS/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# MongoDB Connection
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/alertnest

# Firebase
GOOGLE_CLIENT_ID=your-google-client-id-from-firebase

# JWT (optional, for future use)
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=8760
```

**For Local MongoDB Development:**
```env
MONGODB_URL=mongodb://localhost:27017/alertnest
GOOGLE_CLIENT_ID=your-google-client-id
```

### 5. Set Up Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as `backend/firebase-service-account.json`

### 6. Run Backend
```bash
python main.py
```

Backend will start on `http://localhost:8000`

Test with:
```bash
curl http://localhost:8000/api/ping
# Response: {"message":"pong"}
```

## Frontend Setup

### 1. Navigate to Frontend
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase

Update `frontend/src/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run Frontend
```bash
npm start
```

Frontend will start on `http://localhost:3000`

## MongoDB Setup

### Option 1: Local MongoDB

**Install MongoDB:**
- macOS: `brew install mongodb-community`
- Linux: Follow [MongoDB docs](https://docs.mongodb.com/manual/installation/)
- Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)

**Start MongoDB:**
```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Connection String:**
```
mongodb://localhost:27017/alertnest
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster
4. Create database user
5. Get connection string
6. Add IP to whitelist (or allow all: 0.0.0.0/0)
7. Use connection string in `.env`:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/alertnest
   ```

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable "Google"

### 3. Get Google OAuth Credentials
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key" (for backend)
3. Go to Project Settings → General
4. Copy Web API Key and other config

### 4. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - Your production domain

## Testing the System

### 1. Test Backend API
```bash
# Ping endpoint
curl http://localhost:8000/api/ping

# Should return: {"message":"pong"}
```

### 2. Test Frontend
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Create account with email
4. Should redirect to dashboard

### 3. Test Google OAuth
1. Click "Sign in with Google"
2. Select Google account
3. Should redirect to dashboard

### 4. Test Incident Creation
1. Click "Report" button
2. Fill incident form
3. Submit
4. Should appear in incidents list

### 5. Test Role-Based Access
1. Create student account
2. Create staff account
3. Create admin account
4. Verify each sees different data

## Troubleshooting

### Backend Won't Start
```
ModuleNotFoundError: No module named 'pymongo'
```
**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

### MongoDB Connection Error
```
Failed to connect to MongoDB
```
**Solutions:**
- Check `MONGODB_URL` in `.env`
- Ensure MongoDB is running
- For Atlas: Check IP whitelist
- Test connection: `mongosh "mongodb+srv://..."`

### Firebase Auth Error
```
Firebase app not initialized
```
**Solution:** Ensure `firebase-service-account.json` exists in backend/

### CORS Error in Frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Backend CORS is configured for `http://localhost:3000`. For production, update in `backend/main.py`:
```python
allow_origins=["https://yourdomain.com"]
```

### Port Already in Use
```
Address already in use
```
**Solution:** Kill process or use different port
```bash
# Backend on different port
uvicorn app.main:app --port 8001

# Frontend on different port
PORT=3001 npm start
```

## Development Workflow

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend (in new terminal)
```bash
cd backend
source venv/bin/activate
python main.py
```

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm start
```

### 4. Open Browser
```
http://localhost:3000
```

## Production Deployment

### Backend (Example: Heroku)
```bash
# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
git push heroku main
```

### Frontend (Example: Vercel)
```bash
npm install -g vercel
vercel
```

### Environment Variables
Set in production platform:
- `MONGODB_URL` - Production MongoDB connection
- `GOOGLE_CLIENT_ID` - Production Google OAuth ID
- Update CORS origin in backend

## Database Backup

### MongoDB Atlas
- Automatic backups enabled by default
- Manual backup: Cluster → Backup

### Local MongoDB
```bash
# Backup
mongodump --uri "mongodb://localhost:27017/alertnest" --out ./backup

# Restore
mongorestore --uri "mongodb://localhost:27017/alertnest" ./backup/alertnest
```

## Monitoring

### Check MongoDB Connection
```bash
# In Python shell
from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017/alertnest")
print(client.admin.command('ping'))
```

### View Database
```bash
# Using MongoDB Compass (GUI)
# Download from: https://www.mongodb.com/products/compass

# Or using mongosh (CLI)
mongosh "mongodb://localhost:27017/alertnest"
> db.incidents.find()
> db.users.find()
```

## Next Steps

1. ✅ Backend running on `http://localhost:8000`
2. ✅ Frontend running on `http://localhost:3000`
3. ✅ MongoDB connected
4. ✅ Firebase configured
5. Create test accounts and incidents
6. Test all features
7. Deploy to production

## Support

For issues:
1. Check logs in terminal
2. Review error messages
3. Check `.env` configuration
4. Verify MongoDB connection
5. Check Firebase setup
