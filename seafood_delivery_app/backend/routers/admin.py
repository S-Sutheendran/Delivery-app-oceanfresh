"""
Admin endpoints — driver approval and order-to-driver assignment.
In production, protect these with an admin JWT or API key middleware.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Driver, Order
from services.fcm_sender import notify_driver_new_order

router = APIRouter()


class AssignDriverIn(BaseModel):
    driver_id: int


class ApproveDriverIn(BaseModel):
    approved: bool
    rejection_reason: str = ""


@router.get("/drivers")
def list_drivers(
    onboarding_status: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Driver)
    if onboarding_status:
        query = query.filter(Driver.onboarding_status == onboarding_status)
    drivers = query.order_by(Driver.created_at.desc()).all()
    return {
        "drivers": [
            {
                "id": d.id,
                "full_name": d.full_name,
                "phone_number": d.phone_number,
                "onboarding_status": d.onboarding_status,
                "is_online": d.is_online,
                "vehicle": d.vehicle.plate_number if d.vehicle else None,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in drivers
        ]
    }


@router.patch("/drivers/{driver_id}/approve")
def approve_driver(
    driver_id: int,
    body: ApproveDriverIn,
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(404, "Driver not found")
    driver.onboarding_status = "approved" if body.approved else "rejected"
    db.commit()

    if driver.fcm_token:
        from services.fcm_sender import send_notification
        if body.approved:
            send_notification(
                driver.fcm_token,
                title="Application approved!",
                body="Congratulations! Your driver account is now active. Go online to start receiving orders.",
                data={"type": "account_approved"},
            )
        else:
            send_notification(
                driver.fcm_token,
                title="Application update",
                body=f"Your application needs attention. {body.rejection_reason}",
                data={"type": "account_rejected"},
            )
    return {"driver_id": driver_id, "onboarding_status": driver.onboarding_status}


@router.patch("/orders/{order_id}/assign-driver")
def assign_driver_to_order(
    order_id: int,
    body: AssignDriverIn,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    if order.driver_id:
        raise HTTPException(409, "Order already has a driver assigned")

    driver = db.query(Driver).filter(
        Driver.id == body.driver_id,
        Driver.onboarding_status == "approved",
        Driver.is_online == True,
    ).first()
    if not driver:
        raise HTTPException(404, "Driver not found, not approved, or not online")

    order.driver_id = driver.id
    order.driver_assigned_at = datetime.now(timezone.utc)
    order.status = "assigned"
    db.commit()

    if driver.fcm_token:
        notify_driver_new_order(driver.fcm_token, order.id, order.delivery_address or "")

    return {
        "order_id": order_id,
        "driver_id": driver.id,
        "driver_name": driver.full_name,
        "status": "assigned",
    }
