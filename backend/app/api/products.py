from fastapi import APIRouter
from ..database import get_database
from ..schemas import OrnamentCreate
from .auth import serialize_document

router = APIRouter()

@router.get("/")
def list_ornaments():
    database = get_database()
    ornaments = [serialize_document(item) for item in database.ornaments.find()]
    return {"items": ornaments}

@router.post("/", status_code=201)
def create_ornament(payload: OrnamentCreate):
    database = get_database()
    inserted = database.ornaments.insert_one(payload.model_dump())
    created_ornament = database.ornaments.find_one({"_id": inserted.inserted_id})
    return {"item": serialize_document(created_ornament)}
