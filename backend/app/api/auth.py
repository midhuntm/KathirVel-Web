from fastapi import APIRouter, HTTPException, Header, Depends

from ..database import get_database
from ..core.security import create_access_token, verify_password, get_password_hash, decode_access_token
from ..schemas import LoginRequest

router = APIRouter()

def serialize_document(document):
    if not document:
        return None
    return {
        "id": str(document.get("_id")),
        **{key: value for key, value in document.items() if key != "_id"},
    }


def get_current_user(authorization: str = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header.")

    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = decode_access_token(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token.") from exc

    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid token payload.")

    database = get_database()
    user = database.user.find_one({"email": user_email}, {"password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found for token.")

    return serialize_document(user)


def require_admin(current_user=Depends(get_current_user)):
    if (current_user.get("role") or "").lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    return current_user

@router.post("/login")
def login(payload: LoginRequest):
    database = get_database()
    
    # Try to find user by email
    user = database.user.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    # Check password
    stored_password = user.get("password", "")
    if not isinstance(stored_password, str):
        stored_password = ""
    is_valid = False
    
    if stored_password.startswith("$2"):
        try:
            is_valid = verify_password(payload.password, stored_password)
        except Exception:
            # Malformed hash in legacy data should not crash login.
            is_valid = False
    else:
        # Fallback to plain text for legacy, but we should upgrade it
        is_valid = (payload.password == stored_password)
        if is_valid:
            # Upgrade password silently, but never fail login if upgrade fails.
            try:
                database.user.update_one(
                    {"_id": user["_id"]},
                    {"$set": {"password": get_password_hash(payload.password)}}
                )
            except Exception:
                pass

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    user_data = {k: v for k, v in user.items() if k != "password"}
    serialized = serialize_document(user_data)
    token = create_access_token({"sub": serialized["email"], "role": serialized.get("role", "customer")})
    
    return {"message": "Login successful.", "user": serialized, "token": token}
