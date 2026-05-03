from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    emoji = Column(String(10), default="🐟")
    image_url = Column(String(500))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    image_url = Column(String(500))
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    rating = Column(Float, default=4.0)
    review_count = Column(Integer, default=0)
    is_best_seller = Column(Boolean, default=False)
    is_top_rated = Column(Boolean, default=False)
    is_seasonal = Column(Boolean, default=False)
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=100)
    unit = Column(String(50), default="per kg")
    origin = Column(String(100))
    cooking_tip = Column(Text)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(128), unique=True, index=True)
    phone_number = Column(String(20), unique=True, index=True)
    display_name = Column(String(150))
    email = Column(String(200))
    profile_image_url = Column(String(500))
    delivery_address = Column(Text)
    lat = Column(Float)
    lng = Column(Float)
    fcm_token = Column(String(512))  # for push notifications to customer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    orders = relationship("Order", back_populates="user")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # Status: pending → confirmed → assigned → picked_up → in_transit → delivered | cancelled
    status = Column(String(50), default="pending")
    delivery_address = Column(Text)
    delivery_lat = Column(Float)
    delivery_lng = Column(Float)
    subtotal = Column(Float)
    delivery_fee = Column(Float, default=0.0)
    total = Column(Float)
    notes = Column(Text)
    estimated_delivery_mins = Column(Integer, default=40)

    # Driver assignment fields
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    driver_assigned_at = Column(DateTime(timezone=True), nullable=True)
    picked_up_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    delivery_photo_url = Column(String(500), nullable=True)

    # Live location tracking
    live_location_enabled = Column(Boolean, default=False)
    proximity_notified = Column(Boolean, default=False)  # prevents duplicate <1km alerts

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="orders")
    driver = relationship("Driver", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class OtpToken(Base):
    __tablename__ = "otp_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(64), unique=True, index=True)
    phone_number = Column(String(20), nullable=False)
    otp_hash = Column(String(128), nullable=False)
    channel = Column(String(20), default="whatsapp")  # whatsapp | sms
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ─── Driver Tables ────────────────────────────────────────────────────────────

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(128), unique=True, index=True)
    phone_number = Column(String(20), unique=True, index=True)
    full_name = Column(String(200))
    dob = Column(String(20))
    email = Column(String(200))
    emergency_contact = Column(String(20))
    profile_image_url = Column(String(500))

    # Onboarding progress: pending_personal → pending_vehicle → pending_documents → pending_review → approved | rejected
    onboarding_status = Column(String(50), default="pending_personal")

    # Availability
    is_active = Column(Boolean, default=True)
    is_online = Column(Boolean, default=False)

    # Live location
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    last_location_at = Column(DateTime(timezone=True), nullable=True)

    # FCM token for push notifications to driver
    fcm_token = Column(String(512))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    vehicle = relationship("DriverVehicle", back_populates="driver", uselist=False)
    documents = relationship("DriverDocument", back_populates="driver")
    orders = relationship("Order", back_populates="driver")
    location_logs = relationship("DriverLocationLog", back_populates="driver")


class DriverVehicle(Base):
    __tablename__ = "driver_vehicles"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False, unique=True)

    vehicle_type = Column(String(20), default="bike")  # bike | scooter | van
    make = Column(String(100))
    model = Column(String(100))
    year = Column(Integer)
    color = Column(String(50))
    plate_number = Column(String(30))
    license_number = Column(String(50))
    rc_number = Column(String(50))
    license_expiry = Column(String(20))
    rc_expiry = Column(String(20))

    # Vehicle photos
    photo_front_url = Column(String(500))
    photo_back_url = Column(String(500))
    photo_left_url = Column(String(500))
    photo_right_url = Column(String(500))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    driver = relationship("Driver", back_populates="vehicle")


class DriverDocument(Base):
    __tablename__ = "driver_documents"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    # doc_type: govt_id | license_copy | rc_copy
    doc_type = Column(String(30), nullable=False)
    file_url = Column(String(500))
    doc_number = Column(String(100))
    expiry_date = Column(String(20))
    verified = Column(Boolean, default=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    driver = relationship("Driver", back_populates="documents")


class DriverLocationLog(Base):
    """Audit trail of driver GPS pings during active deliveries."""
    __tablename__ = "driver_location_logs"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    driver = relationship("Driver", back_populates="location_logs")


# ─── Review Tables ────────────────────────────────────────────────────────────

class DeliveryReview(Base):
    """Customer review for a delivery — one per order."""
    __tablename__ = "delivery_reviews"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    delivery_rating = Column(Integer, nullable=False)   # 1–5
    # JSON list of tag keys e.g. ["fast_delivery", "polite", "neat_packaging"]
    delivery_tags = Column(JSON, default=list)
    comment = Column(Text)
    review_requested = Column(Boolean, default=False)   # driver asked for review
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order")
    user = relationship("User")
    driver = relationship("Driver")


class ProductReview(Base):
    """Customer rating for an individual product within an order."""
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1–5
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order")
    product = relationship("Product")
    user = relationship("User")
