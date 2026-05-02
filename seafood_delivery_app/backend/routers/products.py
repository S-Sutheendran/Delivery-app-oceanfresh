from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from typing import Optional, List
from database import get_db
from models import Product, Category
from schemas import ProductOut, CategoryOut

router = APIRouter()


@router.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).all()
    result = []
    for c in cats:
        count = db.query(func.count(Product.id)).filter(
            Product.category_id == c.id
        ).scalar()
        result.append(CategoryOut(
            id=c.id,
            name=c.name,
            emoji=c.emoji,
            image_url=c.image_url,
            description=c.description,
            product_count=count or 0,
        ))
    return result


@router.get("/products", response_model=List[ProductOut])
def list_products(
    db: Session = Depends(get_db),
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("popular", regex="^(popular|price_asc|price_desc|rating)$"),
    is_best_seller: Optional[bool] = Query(None),
    is_top_rated: Optional[bool] = Query(None),
    is_seasonal: Optional[bool] = Query(None),
    in_stock: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_rating: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
):
    q = db.query(Product).options(joinedload(Product.category))

    if category_id:
        q = q.filter(Product.category_id == category_id)
    if search:
        s = f"%{search}%"
        q = q.filter(
            or_(
                Product.name.ilike(s),
                Product.description.ilike(s),
            )
        )
    if is_best_seller is not None:
        q = q.filter(Product.is_best_seller == is_best_seller)
    if is_top_rated is not None:
        q = q.filter(Product.is_top_rated == is_top_rated)
    if is_seasonal is not None:
        q = q.filter(Product.is_seasonal == is_seasonal)
    if in_stock is not None:
        q = q.filter(Product.in_stock == in_stock)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)
    if min_rating is not None:
        q = q.filter(Product.rating >= min_rating)

    if sort_by == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        q = q.order_by(Product.price.desc())
    elif sort_by == "rating":
        q = q.order_by(Product.rating.desc())
    else:
        q = q.order_by(Product.review_count.desc())

    products = q.offset((page - 1) * limit).limit(limit).all()

    return [
        ProductOut(
            **{c.name: getattr(p, c.name) for c in Product.__table__.columns},
            category_name=p.category.name if p.category else "",
        )
        for p in products
    ]


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).options(joinedload(Product.category)).filter(
        Product.id == product_id
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductOut(
        **{c.name: getattr(p, c.name) for c in Product.__table__.columns},
        category_name=p.category.name if p.category else "",
    )
