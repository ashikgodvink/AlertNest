# Week 4 Progress Update

## Deliverables Status

| Deliverable | Status |
|---|---|
| GitHub repository organized | ✅ Done |
| FastAPI backend running | ✅ Done |
| React frontend initialized | ✅ Done |
| MongoDB connected | ✅ Done |
| Register API working | ✅ Done |
| Login API returning JWT | ✅ Done |
| React login page integrated with backend | ✅ Done |

## Details

**GitHub**
- Repo: https://github.com/tanzilaaaaa/AlertNest
- Branch: main
- Clean structure — no venv, pycache, .env, or .db files committed

**Backend**
- FastAPI + Uvicorn running on port 8000
- MongoDB Atlas connected via Motor (async)
- `POST /api/auth/register` — creates user with bcrypt hashed password
- `POST /api/auth/login` — validates credentials, returns JWT token + user object
- `GET /api/ping` — health check endpoint

**Frontend**
- React app running on port 3000
- Landing page with project name and live backend status indicator
- AuthContext wired up for login state management
- Login page integrated with backend via axios
- API service pointing to `http://localhost:8000`
