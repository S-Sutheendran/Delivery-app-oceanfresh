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
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    orders = relationship("Order", back_populates="user")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="pending")  # pending, confirmed, preparing, out_for_delivery, delivered, cancelled
    delivery_address = Column(Text)
    subtotal = Column(Float)
    delivery_fee = Column(Float, default=0.0)
    total = Column(Float)
    notes = Column(Text)
    estimated_delivery_mins = Column(Integer, default=40)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="orders")
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
