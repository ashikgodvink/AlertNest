from fastapi import APIRouter, HTTPException, status
from app.models.user import UserRegister, UserLogin, UserOut
from app.database import get_db
from app.utils.auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", status_code=201)
async def register(data: UserRegister):
    db = get_db()
    existing = await db["users"].find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "role": data.role
    }
    result = await db["users"].insert_one(user)
    return {
        "message": "User registered successfully",
        "user": UserOut(id=str(result.inserted_id), name=data.name, email=data.email, role=data.role)
    }

@router.post("/login")
async def login(data: UserLogin):
    db = get_db()
    user = await db["users"].find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": str(user["_id"]), "role": user["role"]})
    return {
        "token": token,
        "user": UserOut(id=str(user["_id"]), name=user["name"], email=user["email"], role=user["role"])
    }
