"""
Driver onboarding and profile management endpoints.

POST /drivers/register                 — create driver record after OTP
GET  /drivers/me                       — fetch own profile (JWT-auth)
PATCH /drivers/me/personal             — save Step 1 personal details
PATCH /drivers/me/vehicle              — save Step 2 vehicle details
PATCH /drivers/me/documents            — save Step 3 document numbers
POST  /drivers/me/upload-document      — multipart file upload (govt_id / license_copy / rc_copy)
POST  /drivers/me/upload-vehicle-photo — multipart upload (front/back/left/right)
POST  /drivers/me/submit-onboarding    — finalise → pending_review
PATCH /drivers/me/fcm-token            — update FCM registration token
PATCH /drivers/me/availability         — toggle online/offline
"""
import os
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Driver, DriverVehicle, DriverDocument
from services.storage import save_upload

router = APIRouter()
security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))


# ── JWT helpers ───────────────────────────────────────────────────────────────

def create_driver_token(driver_id: int, phone: str) -> str:
    payload = {
        "sub": str(driver_id),
        "phone": phone,
        "role": "driver",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_driver(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> Driver:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        driver_id = int(payload["sub"])
        if payload.get("role") != "driver":
            raise HTTPException(status_code=403, detail="Not a driver token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver


# ── Schemas ───────────────────────────────────────────────────────────────────

class DriverRegisterIn(BaseModel):
    phone_number: str
    firebase_uid: Optional[str] = None


class PersonalDetailsIn(BaseModel):
    full_name: str
    dob: Optional[str] = None
    email: Optional[str] = None
    emergency_contact: Optional[str] = None


class VehicleDetailsIn(BaseModel):
    vehicle_type: str
    make: str
    model: str
    year: Optional[int] = None
    color: Optional[str] = None
    plate_number: str
    license_number: Optional[str] = None
    rc_number: Optional[str] = None
    license_expiry: Optional[str] = None
    rc_expiry: Optional[str] = None


class DocumentDetailsIn(BaseModel):
    doc_type: str        # govt_id | license_copy | rc_copy
    doc_number: Optional[str] = None
    expiry_date: Optional[str] = None


class FcmTokenIn(BaseModel):
    fcm_token: str


class AvailabilityIn(BaseModel):
    is_online: bool


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/register", status_code=201)
def register_driver(body: DriverRegisterIn, db: Session = Depends(get_db)):
    """Called once after a successful OTP verification to create/fetch driver record."""
    driver = db.query(Driver).filter(Driver.phone_number == body.phone_number).first()
    if not driver:
        driver = Driver(
            phone_number=body.phone_number,
            firebase_uid=body.firebase_uid,
            onboarding_status="pending_personal",
        )
        db.add(driver)
        db.commit()
        db.refresh(driver)
    token = create_driver_token(driver.id, driver.phone_number)
    return {
        "driver_id": driver.id,
        "onboarding_status": driver.onboarding_status,
        "access_token": token,
        "token_type": "bearer",
        "is_new": driver.full_name is None,
    }


@router.get("/me")
def get_profile(driver: Driver = Depends(get_current_driver)):
    vehicle = driver.vehicle
    docs = {d.doc_type: {"file_url": d.file_url, "verified": d.verified} for d in driver.documents}
    return {
        "id": driver.id,
        "phone_number": driver.phone_number,
        "full_name": driver.full_name,
        "email": driver.email,
        "dob": driver.dob,
        "emergency_contact": driver.emergency_contact,
        "onboarding_status": driver.onboarding_status,
        "is_online": driver.is_online,
        "vehicle": {
            "vehicle_type": vehicle.vehicle_type if vehicle else None,
            "make": vehicle.make if vehicle else None,
            "model": vehicle.model if vehicle else None,
            "plate_number": vehicle.plate_number if vehicle else None,
            "photo_front_url": vehicle.photo_front_url if vehicle else None,
            "photo_back_url": vehicle.photo_back_url if vehicle else None,
            "photo_left_url": vehicle.photo_left_url if vehicle else None,
            "photo_right_url": vehicle.photo_right_url if vehicle else None,
        } if vehicle else None,
        "documents": docs,
    }


@router.patch("/me/personal")
def update_personal(
    body: PersonalDetailsIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver.full_name = body.full_name
    driver.dob = body.dob
    driver.email = body.email
    driver.emergency_contact = body.emergency_contact
    if driver.onboarding_status == "pending_personal":
        driver.onboarding_status = "pending_vehicle"
    db.commit()
    return {"onboarding_status": driver.onboarding_status}


@router.patch("/me/vehicle")
def update_vehicle(
    body: VehicleDetailsIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    vehicle = driver.vehicle
    if not vehicle:
        vehicle = DriverVehicle(driver_id=driver.id)
        db.add(vehicle)
    vehicle.vehicle_type = body.vehicle_type
    vehicle.make = body.make
    vehicle.model = body.model
    vehicle.year = body.year
    vehicle.color = body.color
    vehicle.plate_number = body.plate_number
    vehicle.license_number = body.license_number
    vehicle.rc_number = body.rc_number
    vehicle.license_expiry = body.license_expiry
    vehicle.rc_expiry = body.rc_expiry
    if driver.onboarding_status == "pending_vehicle":
        driver.onboarding_status = "pending_documents"
    db.commit()
    return {"onboarding_status": driver.onboarding_status}


@router.patch("/me/documents")
def update_document_meta(
    body: DocumentDetailsIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    doc = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver.id, DriverDocument.doc_type == body.doc_type)
        .first()
    )
    if not doc:
        doc = DriverDocument(driver_id=driver.id, doc_type=body.doc_type)
        db.add(doc)
    doc.doc_number = body.doc_number
    doc.expiry_date = body.expiry_date
    db.commit()
    return {"doc_type": body.doc_type, "saved": True}


@router.post("/me/upload-document")
async def upload_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    """doc_type: govt_id | license_copy | rc_copy"""
    if doc_type not in ("govt_id", "license_copy", "rc_copy"):
        raise HTTPException(400, "Invalid doc_type")
    contents = await file.read()
    url = save_upload(contents, file.filename or "doc.jpg", sub_dir="documents")
    doc = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver.id, DriverDocument.doc_type == doc_type)
        .first()
    )
    if not doc:
        doc = DriverDocument(driver_id=driver.id, doc_type=doc_type)
        db.add(doc)
    doc.file_url = url
    db.commit()
    return {"doc_type": doc_type, "file_url": url}


@router.post("/me/upload-vehicle-photo")
async def upload_vehicle_photo(
    side: str = Form(...),
    file: UploadFile = File(...),
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    """side: front | back | left | right"""
    if side not in ("front", "back", "left", "right"):
        raise HTTPException(400, "Invalid side; must be front/back/left/right")
    contents = await file.read()
    url = save_upload(contents, file.filename or "photo.jpg", sub_dir="vehicle_photos")
    vehicle = driver.vehicle
    if not vehicle:
        vehicle = DriverVehicle(driver_id=driver.id)
        db.add(vehicle)
    setattr(vehicle, f"photo_{side}_url", url)
    db.commit()
    return {"side": side, "file_url": url}


@router.post("/me/submit-onboarding")
def submit_onboarding(
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    """Final step: validate all uploads are present, then set status → pending_review."""
    vehicle = driver.vehicle
    if not vehicle:
        raise HTTPException(422, "Vehicle details not saved")
    missing = [
        side for side in ("front", "back", "left", "right")
        if not getattr(vehicle, f"photo_{side}_url")
    ]
    if missing:
        raise HTTPException(422, f"Missing vehicle photos: {', '.join(missing)}")
    uploaded_types = {d.doc_type for d in driver.documents if d.file_url}
    required_docs = {"govt_id", "license_copy", "rc_copy"}
    missing_docs = required_docs - uploaded_types
    if missing_docs:
        raise HTTPException(422, f"Missing document uploads: {', '.join(missing_docs)}")
    driver.onboarding_status = "pending_review"
    db.commit()
    return {"onboarding_status": "pending_review", "message": "Application submitted for review"}


@router.patch("/me/fcm-token")
def update_fcm_token(
    body: FcmTokenIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver.fcm_token = body.fcm_token
    db.commit()
    return {"updated": True}


@router.patch("/me/availability")
def toggle_availability(
    body: AvailabilityIn,
    driver: Driver = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    if driver.onboarding_status != "approved":
        raise HTTPException(403, "Account not yet approved")
    driver.is_online = body.is_online
    db.commit()
    return {"is_online": driver.is_online}
