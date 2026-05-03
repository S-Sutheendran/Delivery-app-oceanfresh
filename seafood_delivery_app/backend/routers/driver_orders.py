"""
Driver order management endpoints.

GET  /driver-orders/assigned                — list driver's active orders
GET  /driver-orders/optimized-route         — optimized route for active orders
PATCH /driver-orders/{order_id}/status      — update to picked_up / in_transit / delivered
POST  /driver-orders/{order_id}/delivery-photo — upload proof-of-delivery photo
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Order, Driver
from routers.drivers import get_current_driver
from services.storage import save_upload
from services.route_optimizer import optimize_route
from services.fcm_sender import notify_customer_status

router = APIRouter()

VALID_DRIVER_TRANSITIONS = {
    "assigned":   {"picked_up"},
    "picked_up":  {"in_transit"},
    "in_transit": {"delivered"},
}


class StatusUpdateIn(BaseModel):
    status: str


def _order_to_dict(order: Order) -> dict:
    return {
        "order_id": order.id,
        "status": order.status,
        "delivery_address": order.delivery_address,
        "delivery_lat": order.delivery_lat,
        "delivery_lng": order.delivery_lng,
        "total": order.total,
        "item_count": len(order.items),
        "items": [
            {
                "name": item.product.name if item.product else "Unknown",
                "quantity": item.quantity,
                "unit_price": item.unit_price,
            }
            for item in order.items
        ],
        "delivery_photo_url": order.delivery_photo_url,
        "driver_assigned_at": order.driver_assigned_at.isoformat() if order.driver_assigned_at else None,
        "picked_up_at": order.picked_up_at.isoformat() if order.picked_up_at else None,
        "delivered_at": order.delivered_at.isoformat() if order.delivered_at else None,
    }


@router.get("/assigned")
def get_assigned_orders(
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    active_statuses = ("assigned", "picked_up", "in_transit")
    orders = (
        db.query(Order)
        .filter(Order.driver_id == driver.id, Order.status.in_(active_statuses))
        .order_by(Order.driver_assigned_at)
        .all()
    )
    return {"orders": [_order_to_dict(o) for o in orders]}


@router.get("/optimized-route")
def get_optimized_route(
    driver_lat: float,
    driver_lng: float,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    active_statuses = ("assigned", "picked_up", "in_transit")
    orders = (
        db.query(Order)
        .filter(Order.driver_id == driver.id, Order.status.in_(active_statuses))
        .all()
    )
    # Only optimise orders that have valid coordinates
    stops = [
        {
            "order_id": o.id,
            "delivery_lat": o.delivery_lat,
            "delivery_lng": o.delivery_lng,
            "delivery_address": o.delivery_address,
            "status": o.status,
            "total": o.total,
        }
        for o in orders
        if o.delivery_lat and o.delivery_lng
    ]
    optimized = optimize_route(driver_lat, driver_lng, stops)
    return {"route": optimized, "total_stops": len(optimized)}


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    body: StatusUpdateIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id, Order.driver_id == driver.id).first()
    if not order:
        raise HTTPException(404, "Order not found or not assigned to you")

    allowed = VALID_DRIVER_TRANSITIONS.get(order.status, set())
    if body.status not in allowed:
        raise HTTPException(
            422,
            f"Cannot transition from '{order.status}' to '{body.status}'. "
            f"Allowed: {list(allowed)}",
        )

    # Delivery requires a proof photo — server-side gate
    if body.status == "delivered" and not order.delivery_photo_url:
        raise HTTPException(422, "Upload delivery proof photo before marking as delivered")

    now = datetime.now(timezone.utc)
    order.status = body.status
    if body.status == "picked_up":
        order.picked_up_at = now
    elif body.status == "delivered":
        order.delivered_at = now

    db.commit()

    # Notify customer
    if order.user and order.user.fcm_token:
        notify_customer_status(order.user.fcm_token, order.id, body.status)

    return {"order_id": order_id, "new_status": body.status}


@router.post("/{order_id}/delivery-photo")
async def upload_delivery_photo(
    order_id: int,
    file: UploadFile = File(...),
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id, Order.driver_id == driver.id).first()
    if not order:
        raise HTTPException(404, "Order not found or not assigned to you")
    if order.status not in ("in_transit", "picked_up"):
        raise HTTPException(422, f"Cannot upload photo for order in status '{order.status}'")

    contents = await file.read()
    url = save_upload(contents, file.filename or "delivery.jpg", sub_dir="delivery_proofs")
    order.delivery_photo_url = url
    db.commit()
    return {"order_id": order_id, "photo_url": url}
