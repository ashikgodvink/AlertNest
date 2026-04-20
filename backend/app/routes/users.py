from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

class RoleUpdate(BaseModel):
    role: str

def _require_admin(current_user: dict):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

@router.get("")
async def list_users(current_user: dict = Depends(get_current_user)):
    _require_admin(current_user)
    db = get_db()
    users_collection = db.users
    users = list(users_collection.find({}))
    return {
        "users": [
            {"id": u["_id"], **{k: v for k, v in u.items() if k not in ["_id", "password"]}}
            for u in users
        ]
    }

@router.get("/{user_id}")
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    _require_admin(current_user)
    db = get_db()
    users_collection = db.users
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": {"id": user["_id"], **{k: v for k, v in user.items() if k not in ["_id", "password"]}}}

@router.put("/{user_id}/role")
async def update_role(user_id: str, data: RoleUpdate, current_user: dict = Depends(get_current_user)):
    _require_admin(current_user)
    if data.role not in ("student", "staff", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    db = get_db()
    users_collection = db.users
    result = users_collection.update_one({"_id": user_id}, {"$set": {"role": data.role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Role updated"}

@router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    _require_admin(current_user)
    if user_id == current_user["uid"]:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    db = get_db()
    users_collection = db.users
    result = users_collection.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
