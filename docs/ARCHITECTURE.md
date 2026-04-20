# AlertNest Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  - Login/Signup pages                                        │
│  - Dashboard (role-specific views)                           │
│  - Incident reporting form                                   │
│  - User management (admin only)                              │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Firebase Auth                               │
│  - Email/Password authentication                             │
│  - Google OAuth 2.0                                          │
│  - Password reset links                                      │
│  - Session management                                        │
└────────────────────┬────────────────────────────────────────┘
                     │ ID Token
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (FastAPI + Python)                      │
│                                                              │
│  Routes:                                                     │
│  ├─ /api/auth/* - User authentication & sync                │
│  ├─ /api/incidents/* - Incident CRUD operations             │
│  ├─ /api/dashboard/* - Dashboard stats & recent             │
│  ├─ /api/users/* - User management (admin)                  │
│  └─ /api/auth/forgot-password - Password reset              │
│                                                              │
│  Middleware:                                                 │
│  ├─ CORS - Allow frontend requests                          │
│  └─ Auth - Verify Firebase tokens                           │
└────────────────────┬────────────────────────────────────────┘
                     │ PyMongo Driver
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB                                   │
│                                                              │
│  Collections:                                                │
│  ├─ users - User profiles & roles                           │
│  └─ incidents - Incident reports & status                   │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### Email/Password Login
```
1. User enters email & password in frontend
2. Firebase Auth verifies credentials
3. Firebase returns ID token
4. Frontend sends token to backend
5. Backend verifies token with Firebase
6. Backend syncs user to MongoDB (POST /api/auth/sync)
7. User logged in with role from MongoDB
```

### Google OAuth
```
1. User clicks "Sign in with Google"
2. Firebase handles OAuth flow
3. Firebase returns ID token
4. Frontend calls POST /api/auth/google-sync
5. Backend creates/updates user in MongoDB
6. User logged in with role from MongoDB
```

### Password Reset
```
1. User clicks "Forgot Password"
2. Frontend sends email to backend (POST /api/auth/forgot-password)
3. Firebase generates reset link
4. Link sent to user's email
5. User clicks link and resets password in Firebase
6. No database changes needed
```

## Role-Based Access Control

### Student Role
- **Can do:**
  - View own incidents
  - Create new incidents
  - Delete own unreported incidents
  - View dashboard with own stats
- **Cannot do:**
  - View other users' incidents
  - Assign incidents
  - Change incident status
  - Manage users

### Staff Role
- **Can do:**
  - View own incidents
  - View incidents assigned to them
  - Update status of assigned incidents
  - View dashboard with own + assigned stats
- **Cannot do:**
  - View all incidents
  - Assign incidents to others
  - Manage users

### Admin Role
- **Can do:**
  - View all incidents
  - Assign incidents to staff
  - Update any incident status
  - Manage user roles
  - Delete users
  - View dashboard with all stats

## Data Flow: Creating an Incident

```
1. User fills incident form (title, description, category, location)
2. Frontend sends POST /api/incidents
3. Backend receives request with Firebase token
4. Backend verifies token → extracts user ID
5. Backend classifies severity using keyword analysis
6. Backend creates document in MongoDB incidents collection
7. Document includes: title, description, category, location, severity, 
   status="reported", reported_by=uid, created_at=now
8. Frontend receives incident ID
9. Dashboard refreshes to show new incident
```

## Data Flow: Assigning an Incident (Admin)

```
1. Admin views incident in dashboard
2. Admin enters department/staff ID and clicks "Assign"
3. Frontend sends PUT /api/incidents/{id}/assign
4. Backend verifies user is admin
5. Backend updates MongoDB document:
   - assigned_to = staff_id
   - status = "in_progress"
   - updated_at = now
6. Staff member now sees incident in their dashboard
7. Staff can update status to "resolved"
```

## Database Schema

### Users Collection
```javascript
{
  _id: "firebase-uid-string",           // Firebase UID as primary key
  name: "John Doe",
  email: "john@university.edu",
  role: "student|staff|admin",
  provider: "email|google",
  created_at: "2024-01-01T12:00:00Z"   // Optional
}
```

### Incidents Collection
```javascript
{
  _id: ObjectId("..."),                 // MongoDB auto-generated ID
  title: "Broken Window in Building A",
  description: "Window on 3rd floor is cracked",
  category: "Infrastructure",
  location: "Building A, Room 301",
  severity: "high|medium|low",          // Auto-classified
  status: "reported|in_progress|resolved",
  reported_by: "firebase-uid",          // References users._id
  assigned_to: "firebase-uid|null",     // References users._id
  created_at: "2024-01-01T12:00:00Z",
  updated_at: "2024-01-01T12:00:00Z"
}
```

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* operation-specific data */ }
}
```

### Error Response
```json
{
  "detail": "Error message describing what went wrong"
}
```

### Incident Object
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Broken Window",
  "description": "Window is cracked",
  "category": "Infrastructure",
  "location": "Building A",
  "severity": "high",
  "status": "reported",
  "reported_by": "firebase-uid",
  "assigned_to": null,
  "created_at": "2024-01-01T12:00:00.000000+00:00"
}
```

## Severity Classification

The backend automatically classifies incident severity based on keywords in the description:

**High Severity Keywords:**
- fire, flood, emergency, critical, danger, urgent, injury, attack

**Medium Severity Keywords:**
- broken, damaged, leak, fault, issue, problem, failure

**Low Severity:**
- Default if no keywords match

## Security Features

1. **Firebase Authentication**
   - Passwords never stored in MongoDB
   - Firebase handles password hashing & verification
   - Secure token-based authentication

2. **Role-Based Access Control**
   - Backend verifies user role before operations
   - Students can only access own data
   - Staff can only access assigned data
   - Admins have full access

3. **CORS Protection**
   - Only frontend domain allowed
   - Prevents cross-origin attacks

4. **Input Validation**
   - Pydantic models validate all inputs
   - Field length limits enforced
   - Invalid data rejected before database

5. **Authorization Checks**
   - Every endpoint verifies user permissions
   - Incident access checked by role
   - Admin operations require admin role

## Performance Considerations

1. **MongoDB Indexes** (recommended for production)
   ```python
   db.incidents.create_index("reported_by")
   db.incidents.create_index("assigned_to")
   db.incidents.create_index("created_at")
   db.users.create_index("email")
   ```

2. **Query Optimization**
   - Filtering done in Python for simplicity
   - For large datasets, move filtering to MongoDB

3. **Caching** (future enhancement)
   - Cache dashboard stats
   - Cache user roles
   - Invalidate on updates

## Deployment Checklist

- [ ] MongoDB cluster created and secured
- [ ] `MONGODB_URL` configured in production environment
- [ ] Firebase project configured
- [ ] `GOOGLE_CLIENT_ID` set in environment
- [ ] Frontend CORS origin updated if needed
- [ ] Backend running on production server
- [ ] SSL/TLS enabled for all connections
- [ ] Database backups configured
- [ ] Monitoring and logging set up
- [ ] Rate limiting configured (optional)
