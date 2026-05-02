from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Order, OrderItem, Product, User
from schemas import OrderCreate, OrderOut, OrderItemOut

router = APIRouter()

FREE_DELIVERY_THRESHOLD = 500.0
DELIVERY_FEE = 49.0


@router.post("/orders", response_model=OrderOut, status_code=201)
def place_order(payload: OrderCreate, db: Session = Depends(get_db)):
    # Resolve or create user
    user = db.query(User).filter(User.firebase_uid == payload.user_id).first()
    if not user:
        user = User(firebase_uid=payload.user_id, phone_number="unknown")
        db.add(user)
        db.flush()

    subtotal = sum(item.price * item.quantity for item in payload.items)
    delivery_fee = 0.0 if subtotal >= FREE_DELIVERY_THRESHOLD else DELIVERY_FEE
    total = subtotal + delivery_fee

    order = Order(
        user_id=user.id,
        status="confirmed",
        delivery_address=payload.delivery_address,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=total,
        notes=payload.notes,
        estimated_delivery_mins=35,
    )
    db.add(order)
    db.flush()

    order_items = []
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

        oi = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.price,
            total_price=item.price * item.quantity,
        )
        db.add(oi)
        order_items.append(OrderItemOut(
            product_id=item.product_id,
            product_name=product.name,
            quantity=item.quantity,
            unit_price=item.price,
            total_price=item.price * item.quantity,
        ))

        # Decrement stock
        product.stock_quantity = max(0, product.stock_quantity - item.quantity)

    db.commit()
    db.refresh(order)

    return OrderOut(
        id=order.id,
        status=order.status,
        delivery_address=order.delivery_address,
        subtotal=order.subtotal,
        delivery_fee=order.delivery_fee,
        total=order.total,
        estimated_delivery_mins=order.estimated_delivery_mins,
        created_at=order.created_at,
        items=order_items,
    )


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = [
        OrderItemOut(
            product_id=oi.product_id,
            product_name=oi.product.name if oi.product else "Unknown",
            quantity=oi.quantity,
            unit_price=oi.unit_price,
            total_price=oi.total_price,
        )
        for oi in order.items
    ]
    return OrderOut(
        id=order.id,
        status=order.status,
        delivery_address=order.delivery_address,
        subtotal=order.subtotal,
        delivery_fee=order.delivery_fee,
        total=order.total,
        estimated_delivery_mins=order.estimated_delivery_mins,
        created_at=order.created_at,
        items=items,
    )
