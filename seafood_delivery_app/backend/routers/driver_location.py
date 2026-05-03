"""
Driver GPS location endpoints.

POST /driver-location/ping              — receive GPS update, check proximity, push live location
POST /driver-location/live-share-toggle — admin enables/disables live tracking for an order
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Driver, Order, DriverLocationLog
from routers.drivers import get_current_driver
from services.fcm_sender import notify_customer_proximity, push_live_location
from services.route_optimizer import haversine_meters

router = APIRouter()

PROXIMITY_THRESHOLD_METERS = 1000.0  # 1 km


class LocationPingIn(BaseModel):
    order_id: int
    lat: float
    lng: float


class LiveShareToggleIn(BaseModel):
    order_id: int
    enabled: bool


@router.post("/ping")
def location_ping(
    body: LocationPingIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    # Update driver's latest position
    driver.current_lat = body.lat
    driver.current_lng = body.lng
    driver.last_location_at = now

    order = db.query(Order).filter(
        Order.id == body.order_id,
        Order.driver_id == driver.id,
    ).first()

    if not order:
        db.commit()
        return {"acknowledged": True}

    # Append to audit log
    db.add(DriverLocationLog(
        driver_id=driver.id,
        order_id=order.id,
        lat=body.lat,
        lng=body.lng,
    ))

    customer_token = order.user.fcm_token if order.user else None

    # Live location broadcast (only when admin has enabled it)
    if order.live_location_enabled and customer_token:
        push_live_location(customer_token, order.id, body.lat, body.lng)

    # Proximity check — fire once per order
    if (
        not order.proximity_notified
        and order.delivery_lat
        and order.delivery_lng
        and customer_token
    ):
        dist = haversine_meters(body.lat, body.lng, order.delivery_lat, order.delivery_lng)
        if dist <= PROXIMITY_THRESHOLD_METERS:
            notify_customer_proximity(customer_token, order.id)
            order.proximity_notified = True

    db.commit()
    return {"acknowledged": True, "live_tracking": order.live_location_enabled}


@router.post("/live-share-toggle")
def toggle_live_share(body: LiveShareToggleIn, db: Session = Depends(get_db)):
    """Admin-only endpoint — no driver auth required (add admin auth in production)."""
    order = db.query(Order).filter(Order.id == body.order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    order.live_location_enabled = body.enabled
    db.commit()
    return {"order_id": body.order_id, "live_location_enabled": body.enabled}
