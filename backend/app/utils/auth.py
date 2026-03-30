from firebase_admin import auth as firebase_auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    Verifies the Firebase ID token and attaches the user's role from Firestore.
    NOTE: makes one Firestore read per request to fetch the role.
    This is acceptable for current scale; add caching (e.g. Redis) if needed later.
    """
    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
        from app.database import get_db
        db = get_db()
        user_doc = db.collection("users").document(decoded["uid"]).get()
        decoded["role"] = user_doc.to_dict().get("role", "student") if user_doc.exists else "student"
        return decoded
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
