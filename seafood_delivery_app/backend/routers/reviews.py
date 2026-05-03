"""
Review endpoints — used by both customer and driver apps.

Customer:
  POST /reviews/submit          — submit delivery + product reviews for an order
  GET  /reviews/pending         — orders awaiting review (delivered, no review yet)
  GET  /reviews/order/{id}      — fetch an order's review

Driver:
  POST /reviews/request/{order_id} — driver requests a review from customer (sends FCM)
  GET  /reviews/my-stats            — driver's rating summary (avg, count, recent)
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Order, DeliveryReview, ProductReview

router = APIRouter()

# ── Delivery tag catalogue (shown as chips in the UI) ────────────────────────
DELIVERY_TAGS = [
    {"key": "fast_delivery",      "label": "Fast Delivery",       "emoji": "⚡"},
    {"key": "polite",             "label": "Polite Behaviour",    "emoji": "😊"},
    {"key": "great_communication","label": "Great Communication", "emoji": "💬"},
    {"key": "neat_packaging",     "label": "Neat Packaging",      "emoji": "📦"},
    {"key": "on_time",            "label": "On Time",             "emoji": "🕐"},
    {"key": "extra_mile",         "label": "Went Extra Mile",     "emoji": "🌟"},
    {"key": "helpful",            "label": "Helpful Driver",      "emoji": "🤝"},
    {"key": "careful_handling",   "label": "Careful Handling",    "emoji": "🚗"},
]


@router.get("/tags")
def get_delivery_tags():
    """Returns the predefined list of delivery performance tags."""
    return {"tags": DELIVERY_TAGS}


# ── Schemas ───────────────────────────────────────────────────────────────────

class ProductRatingIn(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class SubmitReviewIn(BaseModel):
    order_id: int
    firebase_uid: str        # customer's Firebase UID (same as what orders use)
    delivery_rating: int = Field(..., ge=1, le=5)
    delivery_tags: List[str] = []
    comment: Optional[str] = None
    product_ratings: List[ProductRatingIn] = []


def _get_user_by_firebase_uid(firebase_uid: str, db):
    """Resolve firebase_uid → User row; raises 404 if not found."""
    from models import User
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user


# ── Customer endpoints ────────────────────────────────────────────────────────

@router.post("/submit", status_code=201)
def submit_review(body: SubmitReviewIn, db: Session = Depends(get_db)):
    user = _get_user_by_firebase_uid(body.firebase_uid, db)
    order = db.query(Order).filter(Order.id == body.order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    if order.status != "delivered":
        raise HTTPException(422, "Can only review delivered orders")
    if order.user_id != user.id:
        raise HTTPException(403, "Order does not belong to this user")

    # Prevent duplicate delivery review
    existing = db.query(DeliveryReview).filter(
        DeliveryReview.order_id == body.order_id
    ).first()
    if existing:
        raise HTTPException(409, "Review already submitted for this order")

    # Validate tag keys
    valid_keys = {t["key"] for t in DELIVERY_TAGS}
    tags = [t for t in body.delivery_tags if t in valid_keys]

    review = DeliveryReview(
        order_id=body.order_id,
        user_id=user.id,
        driver_id=order.driver_id,
        delivery_rating=body.delivery_rating,
        delivery_tags=tags,
        comment=body.comment,
    )
    db.add(review)

    for pr in body.product_ratings:
        db.add(ProductReview(
            order_id=body.order_id,
            product_id=pr.product_id,
            user_id=user.id,
            rating=pr.rating,
            comment=pr.comment,
        ))

    db.commit()
    db.refresh(review)
    return {"review_id": review.id, "message": "Review submitted. Thank you!"}


@router.get("/pending")
def get_pending_reviews(firebase_uid: str, db: Session = Depends(get_db)):
    """
    Returns delivered orders that have no delivery review yet.
    Used to show the 'Rate your order' banner on home and orders screens.
    """
    user = _get_user_by_firebase_uid(firebase_uid, db)

    reviewed_order_ids = db.query(DeliveryReview.order_id).filter(
        DeliveryReview.user_id == user.id
    ).subquery()

    pending = (
        db.query(Order)
        .filter(
            Order.user_id == user.id,
            Order.status == "delivered",
            Order.id.not_in(reviewed_order_ids),
        )
        .order_by(Order.delivered_at.desc())
        .limit(5)
        .all()
    )

    return {
        "pending": [
            {
                "order_id": o.id,
                "total": o.total,
                "item_count": len(o.items),
                "delivered_at": o.delivered_at.isoformat() if o.delivered_at else None,
                "review_requested": any(
                    r.review_requested
                    for r in db.query(DeliveryReview)
                    .filter(DeliveryReview.order_id == o.id)
                    .all()
                ),
            }
            for o in pending
        ]
    }


@router.get("/order/{order_id}")
def get_order_review(order_id: int, db: Session = Depends(get_db)):
    review = db.query(DeliveryReview).filter(
        DeliveryReview.order_id == order_id
    ).first()
    if not review:
        raise HTTPException(404, "No review for this order yet")

    product_reviews = db.query(ProductReview).filter(
        ProductReview.order_id == order_id
    ).all()

    return {
        "delivery_rating": review.delivery_rating,
        "delivery_tags": review.delivery_tags,
        "comment": review.comment,
        "created_at": review.created_at.isoformat(),
        "product_reviews": [
            {"product_id": pr.product_id, "rating": pr.rating, "comment": pr.comment}
            for pr in product_reviews
        ],
    }


@router.get("/orders")
def get_user_orders(firebase_uid: str, db: Session = Depends(get_db)):
    """All orders for a user — used on the Orders screen."""
    user = _get_user_by_firebase_uid(firebase_uid, db)
    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .limit(50)
        .all()
    )
    reviewed_ids = {
        r.order_id
        for r in db.query(DeliveryReview.order_id)
        .filter(DeliveryReview.user_id == user.id)
        .all()
    }
    return {
        "orders": [
            {
                "order_id": o.id,
                "status": o.status,
                "total": o.total,
                "item_count": len(o.items),
                "created_at": o.created_at.isoformat() if o.created_at else None,
                "delivered_at": o.delivered_at.isoformat() if o.delivered_at else None,
                "can_review": o.status == "delivered" and o.id not in reviewed_ids,
                "is_reviewed": o.id in reviewed_ids,
            }
            for o in orders
        ]
    }


# ── Driver endpoints ───────────────────────────────────────────────────────────

@router.post("/request/{order_id}")
def request_review(order_id: int, driver_id: int, db: Session = Depends(get_db)):
    """Driver taps 'Request Review' after delivery — marks flag + sends FCM to customer."""
    order = db.query(Order).filter(Order.id == order_id, Order.driver_id == driver_id).first()
    if not order:
        raise HTTPException(404, "Order not found or not assigned to this driver")
    if order.status != "delivered":
        raise HTTPException(422, "Can only request review for delivered orders")

    # Mark review_requested on any existing review row, or create a placeholder
    review = db.query(DeliveryReview).filter(DeliveryReview.order_id == order_id).first()
    if review:
        review.review_requested = True
    else:
        db.add(DeliveryReview(
            order_id=order_id,
            user_id=order.user_id,
            driver_id=driver_id,
            delivery_rating=0,  # 0 = review requested but not yet submitted
            review_requested=True,
        ))

    db.commit()

    # Push FCM notification to customer
    if order.user and order.user.fcm_token:
        try:
            from services.fcm_sender import send_notification
            send_notification(
                order.user.fcm_token,
                title="How was your delivery?",
                body="Rate your OceanFresh delivery and help us improve! ⭐",
                data={"type": "review_request", "order_id": str(order_id)},
            )
        except Exception:
            pass

    return {"requested": True, "order_id": order_id}


@router.get("/my-stats")
def get_driver_review_stats(driver_id: int, db: Session = Depends(get_db)):
    """Driver's rating overview — average, count, tag frequency, recent reviews."""
    reviews = (
        db.query(DeliveryReview)
        .filter(
            DeliveryReview.driver_id == driver_id,
            DeliveryReview.delivery_rating > 0,
        )
        .order_by(DeliveryReview.created_at.desc())
        .all()
    )

    if not reviews:
        return {
            "average_rating": 0.0,
            "total_reviews": 0,
            "rating_breakdown": {str(i): 0 for i in range(1, 6)},
            "top_tags": [],
            "recent_reviews": [],
        }

    avg = sum(r.delivery_rating for r in reviews) / len(reviews)

    breakdown = {str(i): 0 for i in range(1, 6)}
    tag_counts: dict = {}
    for r in reviews:
        breakdown[str(r.delivery_rating)] += 1
        for tag in (r.delivery_tags or []):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

    tag_info = {t["key"]: t for t in DELIVERY_TAGS}
    top_tags = sorted(tag_counts.items(), key=lambda x: -x[1])[:5]
    top_tags_out = [
        {
            "key": k,
            "count": c,
            "label": tag_info.get(k, {}).get("label", k),
            "emoji": tag_info.get(k, {}).get("emoji", ""),
        }
        for k, c in top_tags
    ]

    recent = reviews[:10]
    return {
        "average_rating": round(avg, 2),
        "total_reviews": len(reviews),
        "rating_breakdown": breakdown,
        "top_tags": top_tags_out,
        "recent_reviews": [
            {
                "order_id": r.order_id,
                "delivery_rating": r.delivery_rating,
                "delivery_tags": r.delivery_tags,
                "comment": r.comment,
                "created_at": r.created_at.isoformat(),
            }
            for r in recent
        ],
    }
