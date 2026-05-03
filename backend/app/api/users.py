from fastapi import APIRouter, HTTPException, Depends
from ..database import get_database
from ..schemas import UserCreate
from ..core.security import get_password_hash, create_access_token
from .auth import serialize_document, require_admin

router = APIRouter()

@router.get("/")
def list_users(_admin=Depends(require_admin)):
    database = get_database()
    users = [serialize_document(item) for item in database.user.find({}, {"password": 0})]
    return {"items": users}

@router.post("/", status_code=201)
def create_user(payload: UserCreate):
    database = get_database()

    existing_user = database.user.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=409, detail="A user with this email already exists.")

    user_document = payload.model_dump()
    user_document["role"] = "customer"
    user_document["password"] = get_password_hash(user_document["password"])
    
    inserted = database.user.insert_one(user_document)
    created_user = database.user.find_one({"_id": inserted.inserted_id}, {"password": 0})
    serialized = serialize_document(created_user)
    
    token = create_access_token({"sub": serialized["email"], "role": serialized.get("role", "customer")})
    return {"item": serialized, "token": token}
