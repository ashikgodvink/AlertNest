# MongoDB Migration Guide

## Overview
AlertNest has been migrated from Firestore to MongoDB while keeping Firebase Authentication. This provides better control over the database layer while maintaining secure authentication.

## Architecture
- **Authentication**: Firebase Auth (email/password + Google OAuth)
- **Database**: MongoDB (incidents, users collections)
- **Backend**: FastAPI with PyMongo driver

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

New dependencies added:
- `pymongo==4.6.0` - MongoDB driver
- `motor==3.3.2` - Async MongoDB driver (optional, for future async support)

### 2. Configure MongoDB Connection

Update your `.env` file with MongoDB connection string:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/alertnest
JWT_SECRET=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=8760
GOOGLE_CLIENT_ID=your-google-client-id
```

**For local development:**
```env
MONGODB_URL=mongodb://localhost:27017/alertnest
```

### 3. Database Collections

The system automatically uses these collections:

#### `users` Collection
```json
{
  "_id": "firebase-uid",
  "name": "User Name",
  "email": "user@example.com",
  "role": "student|staff|admin",
  "provider": "email|google"
}
```

#### `incidents` Collection
```json
{
  "_id": ObjectId,
  "title": "Incident Title",
  "description": "Detailed description",
  "category": "Safety|Infrastructure|Operational",
  "location": "Building/Location",
  "severity": "high|medium|low",
  "status": "reported|in_progress|resolved",
  "reported_by": "firebase-uid",
  "assigned_to": "firebase-uid or null",
  "created_at": "2024-01-01T12:00:00.000000+00:00",
  "updated_at": "2024-01-01T12:00:00.000000+00:00"
}
```

### 4. Running the Backend

```bash
cd backend
python main.py
```

Or with uvicorn:
```bash
uvicorn app.main:app --reload
```

## Key Changes from Firestore

### Document IDs
- **Firestore**: String IDs (auto-generated or custom)
- **MongoDB**: ObjectId for incidents, Firebase UID for users

### Query Syntax
```python
# Firestore
db.collection("incidents").where("reported_by", "==", uid).get()

# MongoDB
db.incidents.find({"reported_by": uid})
```

### Updates
```python
# Firestore
db.collection("incidents").document(id).update({"status": "resolved"})

# MongoDB
db.incidents.update_one({"_id": ObjectId(id)}, {"$set": {"status": "resolved"}})
```

### Deletions
```python
# Firestore
db.collection("incidents").document(id).delete()

# MongoDB
db.incidents.delete_one({"_id": ObjectId(id)})
```

## Authentication Flow (Unchanged)

1. **Email/Password Login**
   - Firebase Auth verifies credentials
   - Backend syncs user to MongoDB via `/api/auth/sync`
   - Provider field shows "email"

2. **Google OAuth**
   - Firebase handles OAuth flow
   - Frontend calls `/api/auth/google-sync`
   - Provider field shows "google"

3. **Forgot Password**
   - Firebase generates reset link via `/api/auth/forgot-password`
   - No database changes needed

## Role-Based Access (Unchanged)

- **Students**: See only their own incidents
- **Staff**: See own incidents + assigned incidents
- **Admins**: See all incidents and can manage users

## API Endpoints (Unchanged)

All endpoints remain the same:
- `POST /api/auth/sync` - Sync user after login
- `POST /api/auth/google-sync` - Sync user after Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/incidents` - Create incident
- `GET /api/incidents` - List incidents (role-filtered)
- `PUT /api/incidents/{id}/status` - Update status
- `PUT /api/incidents/{id}/assign` - Assign incident (admin only)
- `DELETE /api/incidents/{id}` - Delete incident
- `GET /api/dashboard/summary` - Get dashboard stats
- `GET /api/dashboard/recent` - Get recent incidents
- `GET /api/users` - List users (admin only)
- `PUT /api/users/{id}/role` - Update user role (admin only)
- `DELETE /api/users/{id}` - Delete user (admin only)

## Troubleshooting

### Connection Issues
```
Failed to connect to MongoDB
```
- Check `MONGODB_URL` in `.env`
- Ensure MongoDB server is running
- Verify network access (for cloud MongoDB)

### ObjectId Errors
```
bson.errors.InvalidId: invalid ObjectId hex string
```
- Ensure incident IDs are valid ObjectIds
- Check that user IDs are Firebase UIDs (strings)

### Missing Collections
MongoDB creates collections automatically on first insert. If collections don't exist:
- Create an incident (creates `incidents` collection)
- Sync a user (creates `users` collection)

## Migration from Firestore

If migrating existing data:

1. Export Firestore data as JSON
2. Transform to MongoDB format
3. Import using MongoDB tools:
   ```bash
   mongoimport --uri "mongodb+srv://..." --collection incidents --file incidents.json
   ```

## Performance Notes

- MongoDB queries are generally faster than Firestore for complex filters
- No composite index setup needed (unlike Firestore)
- Sorting and filtering done in Python for simplicity
- For large datasets, consider adding MongoDB indexes:
  ```python
  db.incidents.create_index("reported_by")
  db.incidents.create_index("assigned_to")
  db.incidents.create_index("created_at")
  ```

## Frontend Changes

**No changes required** - Frontend continues to use the same API endpoints.

## Next Steps

1. Update `.env` with MongoDB connection string
2. Install dependencies: `pip install -r requirements.txt`
3. Start backend: `python main.py`
4. Test endpoints with Postman or frontend
5. Verify role-based filtering works correctly
