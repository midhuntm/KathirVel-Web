from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..database import get_database
from ..schemas import OrnamentCreate
from .auth import serialize_document

router = APIRouter()

@router.get("/")
def list_ornaments():
    database = get_database()
    ornaments = [
        serialize_document(item)
        for item in database.ornaments.find(
            {},
            {
                "images": {"$slice": 1},
            },
        )
    ]
    return {"items": ornaments}

@router.post("/", status_code=201)
def create_ornament(payload: OrnamentCreate):
    database = get_database()
    inserted = database.ornaments.insert_one(payload.model_dump())
    created_ornament = database.ornaments.find_one({"_id": inserted.inserted_id})
    return {"item": serialize_document(created_ornament)}


@router.get("/{ornament_id}")
def get_ornament(ornament_id: str):
    database = get_database()
    try:
        object_id = ObjectId(ornament_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid ornament id.") from exc

    ornament = database.ornaments.find_one({"_id": object_id})
    if not ornament:
        raise HTTPException(status_code=404, detail="Ornament not found.")
    return {"item": serialize_document(ornament)}


@router.delete("/{ornament_id}")
def delete_ornament(ornament_id: str):
    database = get_database()
    try:
        object_id = ObjectId(ornament_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid ornament id.") from exc

    result = database.ornaments.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ornament not found.")
    return {"message": "Ornament deleted successfully."}
