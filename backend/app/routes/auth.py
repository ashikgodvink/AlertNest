from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.utils.auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

class SyncData(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = "student"

@router.post("/sync")
async def sync_user(data: SyncData = SyncData(), current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    uid = current_user["uid"]
    
    # Determine provider from Firebase token
    provider = "email"  # default for email/password
    if "firebase" in current_user and "sign_in_provider" in current_user.get("firebase", {}):
        provider = current_user["firebase"]["sign_in_provider"]

    users_collection = db.users
    existing_user = users_collection.find_one({"_id": uid})

    if not existing_user:
        users_collection.insert_one({
            "_id": uid,
            "name": data.name or current_user.get("name", current_user.get("email", "")),
            "email": current_user.get("email", ""),
            "role": data.role or "student",
            "provider": provider
        })
    else:
        # Only update name if provided — never overwrite role on subsequent logins
        updates = {}
        if data.name and data.name != existing_user.get("name"):
            updates["name"] = data.name
        if updates:
            users_collection.update_one({"_id": uid}, {"$set": updates})

    user = users_collection.find_one({"_id": uid})
    return {
        "user": {
            "id": uid,
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role", "student")
        }
    }

@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    db = get_db()
    uid = current_user["uid"]
    users_collection = db.users
    user = users_collection.find_one({"_id": uid})
    
    if not user:
        return {"user": {"id": uid, "email": current_user.get("email"), "role": "student"}}
    
    return {"user": {"id": uid, "name": user.get("name"), "email": user.get("email"), "role": user.get("role", "student")}}
