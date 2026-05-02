from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ─── Category ───────────────────────────────────────────────────────────────

class CategoryOut(BaseModel):
    id: int
    name: str
    emoji: str
    image_url: Optional[str]
    description: Optional[str]
    product_count: int = 0

    class Config:
        from_attributes = True


# ─── Product ────────────────────────────────────────────────────────────────

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    original_price: Optional[float]
    image_url: Optional[str]
    category_id: int
    category_name: str = ""
    rating: float
    review_count: int
    is_best_seller: bool
    is_top_rated: bool
    is_seasonal: bool
    in_stock: bool
    stock_quantity: int
    unit: str
    origin: Optional[str]
    cooking_tip: Optional[str]
    tags: List[str] = []

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    description: Optional[str]
    price: float
    original_price: Optional[float]
    image_url: Optional[str]
    category_id: int
    unit: str = "per kg"
    origin: Optional[str]
    cooking_tip: Optional[str]
    tags: List[str] = []


# ─── Auth ───────────────────────────────────────────────────────────────────

class SendWhatsAppOtpRequest(BaseModel):
    phone: str = Field(..., example="+919876543210")


class SendWhatsAppOtpResponse(BaseModel):
    token: str
    message: str
    channel: str


class VerifyWhatsAppOtpRequest(BaseModel):
    token: str
    otp: str


class VerifyWhatsAppOtpResponse(BaseModel):
    verified: bool
    message: str


class CheckWhatsAppResponse(BaseModel):
    phone: str
    whatsapp_available: bool


# ─── Order ──────────────────────────────────────────────────────────────────

class OrderItemIn(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItemIn]
    delivery_address: str
    total: float
    notes: Optional[str] = None


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    status: str
    delivery_address: str
    subtotal: float
    delivery_fee: float
    total: float
    estimated_delivery_mins: int
    created_at: datetime
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True
