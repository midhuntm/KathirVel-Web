from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from ..database import get_database
from ..schemas import OrderCreate
from .auth import get_current_user, require_admin, serialize_document

router = APIRouter()


@router.get("/")
def list_orders(current_user=Depends(get_current_user)):
    database = get_database()
    query = {}
    if (current_user.get("role") or "").lower() != "admin":
        query["user_email"] = current_user.get("email")

    orders = [serialize_document(item) for item in database.orders.find(query).sort("created_at", -1)]
    return {"items": orders}


@router.post("/", status_code=201)
def create_order(payload: OrderCreate, current_user=Depends(get_current_user)):
    database = get_database()
    line_items = []

    # Backward compatibility: support old single-item payload.
    if payload.ornament_id and not payload.items:
        payload.items = [{"ornament_id": payload.ornament_id, "quantity": payload.quantity}]

    if not payload.items:
        raise HTTPException(status_code=400, detail="At least one order item is required.")

    total_price = 0.0
    for item in payload.items:
        ornament_id = item.get("ornament_id")
        quantity = int(item.get("quantity", 1) or 1)
        if not ornament_id or quantity < 1:
            raise HTTPException(status_code=400, detail="Invalid order item payload.")
        try:
            ornament_object_id = ObjectId(ornament_id)
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid ornament id.") from exc

        ornament = database.ornaments.find_one({"_id": ornament_object_id})
        if not ornament:
            raise HTTPException(status_code=404, detail="Ornament not found.")

        unit_price = float(ornament.get("price", 0) or 0)
        line_total = unit_price * quantity
        total_price += line_total
        line_items.append(
            {
                "ornament_id": ornament_id,
                "ornament_name": ornament.get("name"),
                "category": ornament.get("category"),
                "image": ornament.get("image"),
                "quantity": quantity,
                "unit_price": unit_price,
                "line_total": line_total,
            }
        )

    order_document = {
        "user_email": current_user.get("email"),
        "user_name": current_user.get("name"),
        "items": line_items,
        "item_count": len(line_items),
        "quantity": sum(item["quantity"] for item in line_items),
        "total_price": total_price,
        "status": "placed",
        "shipping_name": payload.shipping_name,
        "shipping_email": payload.shipping_email,
        "shipping_address": payload.shipping_address,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    inserted = database.orders.insert_one(order_document)
    created_order = database.orders.find_one({"_id": inserted.inserted_id})
    return {"item": serialize_document(created_order)}


@router.patch("/{order_id}/status")
def update_order_status(order_id: str, status: str, _admin=Depends(require_admin)):
    database = get_database()
    try:
        order_object_id = ObjectId(order_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid order id.") from exc

    allowed_statuses = {"placed", "processing", "shipped", "delivered", "cancelled"}
    normalized_status = (status or "").strip().lower()
    if normalized_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid order status.")

    result = database.orders.update_one(
        {"_id": order_object_id},
        {"$set": {"status": normalized_status}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found.")

    updated_order = database.orders.find_one({"_id": order_object_id})
    return {"item": serialize_document(updated_order)}
