from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.config import JWT_SECRET, JWT_ALGORITHM
from datetime import datetime, timedelta
from jose import jwt, JWTError

router = APIRouter(prefix="/api/auth", tags=["auth"])

class ForgotRequest(BaseModel):
    email: EmailStr

class ResetRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(body: ForgotRequest):
    db = get_db()
    users = db.collection("users").where("email", "==", body.email).get()
    if not users:
        return {"message": "If that email exists, a reset token has been sent."}

    user_doc = users[0]
    payload = {
        "user_id": user_doc.id,
        "purpose": "reset",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"message": "Password reset token generated.", "reset_token": token}

@router.post("/reset-password")
async def reset_password(body: ResetRequest):
    try:
        payload = jwt.decode(body.token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    if payload.get("purpose") != "reset":
        raise HTTPException(status_code=400, detail="Invalid token purpose")

    from app.utils.auth import hash_password
    db = get_db()
    db.collection("users").document(payload["user_id"]).update(
        {"password": hash_password(body.new_password)}
    )
    return {"message": "Password reset successfully"}
