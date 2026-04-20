from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

class GoogleSyncData(BaseModel):
    uid: str
    email: str
    name: str | None = None
    role: str = "student"

@router.post("/google-sync")
async def google_sync(body: GoogleSyncData):
    """
    Called after Firebase Google sign-in on the frontend.
    Creates the user doc in MongoDB if it doesn't exist.
    """
    db = get_db()
    users_collection = db.users
    existing_user = users_collection.find_one({"_id": body.uid})

    if not existing_user:
        users_collection.insert_one({
            "_id": body.uid,
            "name": body.name or body.email,
            "email": body.email,
            "role": body.role,
            "provider": "google"
        })

    user = users_collection.find_one({"_id": body.uid})
    return {
        "user": {
            "id": body.uid,
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role", "student")
        }
    }
