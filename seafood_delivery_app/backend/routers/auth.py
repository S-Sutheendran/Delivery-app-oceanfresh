import os
import uuid
import random
import hashlib
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from twilio.rest import Client as TwilioClient
from database import get_db
from models import OtpToken
from schemas import (
    SendWhatsAppOtpRequest, SendWhatsAppOtpResponse,
    VerifyWhatsAppOtpRequest, VerifyWhatsAppOtpResponse,
    CheckWhatsAppResponse,
)

router = APIRouter()

TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
TWILIO_SMS_FROM = os.getenv("TWILIO_SMS_FROM", "+14155238886")
OTP_EXPIRY_MINUTES = 10


def _hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


def _get_twilio() -> TwilioClient:
    return TwilioClient(TWILIO_SID, TWILIO_TOKEN)


@router.get("/check-whatsapp", response_model=CheckWhatsAppResponse)
async def check_whatsapp_availability(phone: str):
    """
    Check if a phone number has WhatsApp.
    Uses Twilio Lookup API (requires channels add-on) or a simple heuristic.
    Falls back to False if Twilio isn't configured.
    """
    try:
        if not TWILIO_SID or not TWILIO_TOKEN:
            return CheckWhatsAppResponse(phone=phone, whatsapp_available=False)

        client = _get_twilio()
        lookup = client.lookups.v2.phone_numbers(phone).fetch(
            fields=["line_type_intelligence"]
        )
        # If lookup succeeds and line_type is mobile, assume WhatsApp possible
        line_type = (lookup.line_type_intelligence or {}).get("type", "")
        whatsapp_available = line_type in ("mobile", "personal", "voip")
        return CheckWhatsAppResponse(phone=phone, whatsapp_available=whatsapp_available)
    except Exception:
        # Safe default — fall back to SMS
        return CheckWhatsAppResponse(phone=phone, whatsapp_available=False)


@router.post("/send-whatsapp-otp", response_model=SendWhatsAppOtpResponse)
async def send_whatsapp_otp(
    payload: SendWhatsAppOtpRequest,
    db: Session = Depends(get_db),
):
    otp = _generate_otp()
    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    # Store hashed OTP
    db_token = OtpToken(
        token=token,
        phone_number=payload.phone,
        otp_hash=_hash_otp(otp),
        channel="whatsapp",
        expires_at=expires_at,
    )
    db.add(db_token)
    db.commit()

    # Send via Twilio WhatsApp
    if TWILIO_SID and TWILIO_TOKEN:
        try:
            client = _get_twilio()
            client.messages.create(
                from_=TWILIO_WHATSAPP_FROM,
                to=f"whatsapp:{payload.phone}",
                body=(
                    f"🐟 Your OceanFresh OTP is: *{otp}*\n"
                    f"Valid for {OTP_EXPIRY_MINUTES} minutes. Do not share this code."
                ),
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"WhatsApp send failed: {e}")
    else:
        # Dev mode: log OTP
        print(f"[DEV] WhatsApp OTP for {payload.phone}: {otp}")

    return SendWhatsAppOtpResponse(
        token=token,
        message=f"OTP sent via WhatsApp to {payload.phone}",
        channel="whatsapp",
    )


@router.post("/verify-whatsapp-otp", response_model=VerifyWhatsAppOtpResponse)
async def verify_whatsapp_otp(
    payload: VerifyWhatsAppOtpRequest,
    db: Session = Depends(get_db),
):
    record = db.query(OtpToken).filter(OtpToken.token == payload.token).first()

    if not record:
        raise HTTPException(status_code=404, detail="OTP token not found")

    now = datetime.now(timezone.utc)
    if record.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=400, detail="OTP has expired")

    if record.is_used:
        raise HTTPException(status_code=400, detail="OTP already used")

    if record.otp_hash != _hash_otp(payload.otp):
        return VerifyWhatsAppOtpResponse(verified=False, message="Invalid OTP")

    record.is_used = True
    db.commit()

    return VerifyWhatsAppOtpResponse(verified=True, message="OTP verified successfully")
