from fastapi import APIRouter, HTTPException, status
from app.models.user import UserRegister, UserLogin, UserOut
from app.database import get_db
from app.utils.auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", status_code=201)
async def register(data: UserRegister):
    db = get_db()
    users_ref = db.collection("users")
    existing = users_ref.where("email", "==", data.email).get()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    doc_ref = users_ref.document()
    user_data = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "role": data.role,
    }
    doc_ref.set(user_data)
    return {
        "message": "User registered successfully",
        "user": UserOut(id=doc_ref.id, name=data.name, email=data.email, role=data.role)
    }

@router.post("/login")
async def login(data: UserLogin):
    db = get_db()
    users = db.collection("users").where("email", "==", data.email).get()
    if not users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_doc = users[0]
    user = user_doc.to_dict()
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": user_doc.id, "role": user["role"]})
    return {
        "token": token,
        "user": UserOut(id=user_doc.id, name=user["name"], email=user["email"], role=user["role"])
    }

@router.get("/me")
async def me():
    return {"message": "use JWT token to identify user"}
