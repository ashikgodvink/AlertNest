from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_db, close_db
from app.routes.auth import router as auth_router
from app.routes.incidents import router as incidents_router
from app.routes.dashboard import router as dashboard_router
from app.routes.google_auth import router as google_auth_router
from app.routes.forgot_password import router as forgot_password_router
from app.routes.users import router as users_router
import firebase_admin
from firebase_admin import credentials
import os
import json

# Initialize Firebase Admin SDK
firebase_creds_path = os.path.join(os.path.dirname(__file__), 'firebase-service-account.json')

if os.path.exists(firebase_creds_path):
    cred = credentials.Certificate(firebase_creds_path)
    firebase_admin.initialize_app(cred)
else:
    print("Warning: firebase-service-account.json not found. Firebase Admin SDK not initialized.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_db()
    yield
    close_db()


app = FastAPI(title="AlertNest API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(incidents_router)
app.include_router(dashboard_router)
app.include_router(google_auth_router)
app.include_router(forgot_password_router)
app.include_router(users_router)


@app.get("/api/ping")
async def ping():
    return {"message": "pong"}
