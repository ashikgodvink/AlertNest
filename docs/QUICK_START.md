# Quick Start Guide - AlertNest with MongoDB

## 30-Second Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
# Edit .env with MONGODB_URL
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`

## Environment Variables

Create `backend/.env`:
```env
MONGODB_URL=mongodb://localhost:27017/alertnest
GOOGLE_CLIENT_ID=your-google-client-id
```

## MongoDB Connection

### Local (Development)
```
mongodb://localhost:27017/alertnest
```

### Cloud (MongoDB Atlas)
```
mongodb+srv://username:password@cluster.mongodb.net/alertnest
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/sync` | Sync user after login |
| POST | `/api/auth/google-sync` | Sync user after Google OAuth |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/incidents` | Create incident |
| GET | `/api/incidents` | List incidents (role-filtered) |
| PUT | `/api/incidents/{id}/status` | Update status |
| PUT | `/api/incidents/{id}/assign` | Assign incident (admin) |
| DELETE | `/api/incidents/{id}` | Delete incident |
| GET | `/api/dashboard/summary` | Dashboard stats |
| GET | `/api/dashboard/recent` | Recent incidents |
| GET | `/api/users` | List users (admin) |
| PUT | `/api/users/{id}/role` | Update role (admin) |
| DELETE | `/api/users/{id}` | Delete user (admin) |

## Test Endpoints

```bash
# Ping backend
curl http://localhost:8000/api/ping

# Get current user (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/auth/me
```

## Database Collections

### Users
```javascript
{
  _id: "firebase-uid",
  name: "John Doe",
  email: "john@example.com",
  role: "student|staff|admin",
  provider: "email|google"
}
```

### Incidents
```javascript
{
  _id: ObjectId,
  title: "Incident Title",
  description: "Description",
  category: "Category",
  location: "Location",
  severity: "high|medium|low",
  status: "reported|in_progress|resolved",
  reported_by: "firebase-uid",
  assigned_to: "firebase-uid|null",
  created_at: "ISO timestamp",
  updated_at: "ISO timestamp"
}
```

## Common Tasks

### View Database
```bash
# Using MongoDB Compass (GUI)
# Download: https://www.mongodb.com/products/compass

# Or using mongosh (CLI)
mongosh "mongodb://localhost:27017/alertnest"
> db.incidents.find()
> db.users.find()
```

### Create Admin User
1. Sign up with email
2. Connect to MongoDB
3. Update user role:
   ```javascript
   db.users.updateOne(
     { _id: "firebase-uid" },
     { $set: { role: "admin" } }
   )
   ```

### Check Incident Status
```javascript
db.incidents.find({ status: "reported" })
```

### View User Roles
```javascript
db.users.find({}, { name: 1, email: 1, role: 1 })
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: pymongo` | Run `pip install -r requirements.txt` |
| `Failed to connect to MongoDB` | Check `MONGODB_URL` in `.env` |
| `CORS error` | Backend CORS configured for `localhost:3000` |
| `Port already in use` | Kill process or use different port |
| `Firebase not initialized` | Check `firebase-service-account.json` exists |

## Architecture

```
Frontend (React)
    ↓ HTTP
Backend (FastAPI)
    ↓ PyMongo
MongoDB (Database)

Firebase Auth (separate)
    ↓ ID Token
Backend (FastAPI)
```

## Key Features

✅ Email/Password authentication via Firebase
✅ Google OAuth sign-in
✅ Role-based access (Student/Staff/Admin)
✅ Incident reporting with auto-severity classification
✅ Real-time dashboard with stats
✅ Incident lifecycle management
✅ User management (admin only)
✅ MongoDB for data persistence

## File Structure

```
backend/
├── main.py                 # Entry point
├── requirements.txt        # Dependencies
├── .env                    # Configuration
├── firebase-service-account.json
└── app/
    ├── database.py         # MongoDB connection
    ├── config.py
    ├── models/
    │   └── user.py
    ├── routes/
    │   ├── auth.py
    │   ├── incidents.py
    │   ├── dashboard.py
    │   ├── users.py
    │   ├── google_auth.py
    │   └── forgot_password.py
    └── utils/
        └── auth.py

frontend/
├── package.json
├── src/
│   ├── App.js
│   ├── firebase.js
│   ├── pages/
    │   ├── Login.js
    │   ├── Signup.js
    │   └── Dashboard.js
    ├── components/
    │   ├── Sidebar.js
    │   ├── StatCard.js
    │   ├── ProgressChart.js
    │   └── ActivityList.js
    ├── services/
    │   └── api.js
    └── context/
        └── AuthContext.js
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure MongoDB
3. ✅ Set up Firebase
4. ✅ Start backend
5. ✅ Start frontend
6. Create test accounts
7. Test all features
8. Deploy to production

## Documentation

- `docs/MONGODB_MIGRATION.md` - Detailed migration guide
- `docs/ARCHITECTURE.md` - System architecture
- `docs/SETUP_MONGODB.md` - Complete setup
- `MIGRATION_SUMMARY.md` - What changed

## Support

For detailed information, see:
- Architecture: `docs/ARCHITECTURE.md`
- Setup: `docs/SETUP_MONGODB.md`
- Migration: `docs/MONGODB_MIGRATION.md`
