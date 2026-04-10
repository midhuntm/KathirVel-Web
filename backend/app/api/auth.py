from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
from bson import ObjectId

from ..database import get_database
from ..core.security import create_access_token, verify_password, get_password_hash
from ..schemas import LoginRequest

router = APIRouter()

def serialize_document(document):
    if not document:
        return None
    return {
        "id": str(document.get("_id")),
        **{key: value for key, value in document.items() if key != "_id"},
    }

@router.post("/login")
def login(payload: LoginRequest):
    database = get_database()
    
    # Try to find user by email
    user = database.user.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    # Check password
    stored_password = user.get("password", "")
    is_valid = False
    
    if stored_password.startswith("$2b$"):
        is_valid = verify_password(payload.password, stored_password)
    else:
        # Fallback to plain text for legacy, but we should upgrade it
        is_valid = (payload.password == stored_password)
        if is_valid:
            # Upgrade password silently
            database.user.update_one(
                {"_id": user["_id"]}, 
                {"$set": {"password": get_password_hash(payload.password)}}
            )

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    user_data = {k: v for k, v in user.items() if k != "password"}
    serialized = serialize_document(user_data)
    token = create_access_token({"sub": serialized["email"], "role": serialized.get("role", "customer")})
    
    return {"message": "Login successful.", "user": serialized, "token": token}
