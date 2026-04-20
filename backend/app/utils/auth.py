from firebase_admin import auth as firebase_auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    Verifies the Firebase ID token and attaches the user's role from MongoDB.
    """
    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
        from app.database import get_db
        db = get_db()
        if db is not None:
            user_doc = db.users.find_one({"_id": decoded["uid"]})
            decoded["role"] = user_doc.get("role", "student") if user_doc else "student"
        else:
            decoded["role"] = "student"
        return decoded
    except Exception as e:
        print(f"Auth error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid or expired token: {str(e)}")
