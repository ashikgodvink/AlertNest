from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Email domain rules ──────────────────────────────────────────────────────
ADMIN_DOMAIN   = "@admin.university.edu"
STUDENT_DOMAIN = "@student.campus.edu"
STAFF_DOMAIN   = "@staff.university.edu"

def get_role_from_email(email: str) -> str:
    e = email.lower()
    if e.endswith(ADMIN_DOMAIN):   return "admin"
    if e.endswith(STUDENT_DOMAIN): return "student"
    if e.endswith(STAFF_DOMAIN):   return "staff"
    return None

class SyncData(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = "student"

@router.post("/sync")
async def sync_user(data: SyncData = SyncData(), current_user: dict = Depends(get_current_user)):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    uid   = current_user["uid"]
    email = current_user.get("email", "")

    provider = "email"
    if "firebase" in current_user and "sign_in_provider" in current_user.get("firebase", {}):
        provider = current_user["firebase"]["sign_in_provider"]

    users_collection = db.users
    existing_user = users_collection.find_one({"_id": uid})

    if not existing_user:
        # New user — enforce domain
        role_from_email = get_role_from_email(email)
        if role_from_email is None:
            raise HTTPException(
                status_code=403,
                detail="Invalid email domain. Please use your institution email to sign up."
            )
        users_collection.insert_one({
            "_id": uid,
            "name": data.name or current_user.get("name", email),
            "email": email,
            "role": role_from_email,
            "provider": provider
        })
    else:
        # Existing user — never change their role, just update name if provided
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
