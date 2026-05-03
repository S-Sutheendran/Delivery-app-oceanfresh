from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from database import engine, Base
from routers import auth, products, orders
from routers import drivers, driver_orders, driver_location, admin, reviews
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Ensure upload directory exists
    Path("./uploads").mkdir(exist_ok=True)
    yield


app = FastAPI(
    title="OceanFresh API",
    description="Backend API for OceanFresh seafood delivery + driver apps",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files (local dev)
app.mount("/uploads", StaticFiles(directory="uploads", check_dir=False), name="uploads")

# Customer app routes
app.include_router(auth.router,     prefix="/api/v1/auth",    tags=["Auth"])
app.include_router(products.router, prefix="/api/v1",         tags=["Products"])
app.include_router(orders.router,   prefix="/api/v1",         tags=["Orders"])

# Driver app routes
app.include_router(drivers.router,          prefix="/api/v1/drivers",         tags=["Driver — Profile"])
app.include_router(driver_orders.router,    prefix="/api/v1/driver-orders",   tags=["Driver — Orders"])
app.include_router(driver_location.router,  prefix="/api/v1/driver-location", tags=["Driver — Location"])

# Admin routes
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# Review routes (customer + driver)
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["Reviews"])


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "OceanFresh API v2"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
