# AlertNest

Centralized incident reporting and management system for university campuses.

Students report incidents, staff resolve them, admins oversee everything — with role-based dashboards, real-time status tracking, and auto severity classification.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Server | Uvicorn (ASGI) |

---

## Features

- Email/password and Google sign-in via Firebase Auth
- Three roles: Student, Staff, Admin — each with different screens and permissions
- Incident lifecycle: Reported → In Progress → Resolved
- Auto severity classification (High / Medium / Low) from description keywords
- Role-scoped dashboards with stats, resolution rate, and recent activity
- Admin: assign incidents, manage users, change roles, delete
- Staff: update status on assigned incidents
- Student: submit and track own reports, delete unreported ones
- Search, filter by status/severity, and pagination on incidents list
- Loading spinners and error/success toasts on all async actions
- Settings screen with real user info and logout

---

## Project Structure

```
AlertNest/
├── backend/
│   ├── main.py                        # FastAPI app entry, lifespan, CORS, routers
│   ├── firebase-service-account.json  # Firebase credentials (not in repo)
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── config.py                  # Env config
│       ├── database.py                # Firestore client init
│       ├── models/user.py             # Pydantic models
│       ├── utils/auth.py              # Firebase token verification, get_current_user
│       └── routes/
│           ├── auth.py                # /api/auth/sync, /api/auth/me
│           ├── incidents.py           # Incidents CRUD
│           ├── dashboard.py           # Summary + recent
│           ├── users.py               # User management (admin)
│           ├── google_auth.py         # Google sign-in sync
│           └── forgot_password.py     # Firebase password reset
└── frontend/
    ├── public/
    └── src/
        ├── firebase.js                # Firebase SDK init
        ├── context/AuthContext.js     # Global auth state
        ├── services/api.js            # Axios instance + all API calls
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   └── Dashboard.js           # Main app — all tabs, role-based
        └── components/
            ├── Sidebar.js
            ├── StatCard.js
            ├── ProgressChart.js
            ├── ActivityList.js
            ├── ForgotPassword.js
            └── SocialButtons.js
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/sync | Create or update user profile in Firestore |
| GET | /api/auth/me | Get current user info |
| POST | /api/auth/google-sync | Sync Google sign-in user to Firestore |
| POST | /api/auth/forgot-password | Generate Firebase password reset link |

### Incidents
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/incidents | Report a new incident |
| GET | /api/incidents | Get incidents (role-scoped, supports ?status= ?severity= ?category=) |
| GET | /api/incidents/{id} | Get single incident |
| PUT | /api/incidents/{id}/assign | Assign to department (admin only) |
| PUT | /api/incidents/{id}/status | Update status (admin / assigned staff) |
| DELETE | /api/incidents/{id} | Delete incident (admin, or student on own reported) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard/summary | Totals, severity breakdown, resolution rate |
| GET | /api/dashboard/recent | Last 5 incidents (role-scoped) |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users | List all users (admin only) |
| GET | /api/users/{id} | Get single user (admin only) |
| PUT | /api/users/{id}/role | Update user role (admin only) |
| DELETE | /api/users/{id} | Delete user (admin only) |

---

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> Requires `backend/.env` and `backend/firebase-service-account.json` — copy from `.env.example` and download service account from Firebase console.

**Frontend**
```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`. Backend runs on `http://localhost:8000`.

---

## Environment Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id
```

Firebase credentials are handled via the service account JSON file, not env vars.
