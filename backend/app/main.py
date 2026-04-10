from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import auth, users, products, admin, payment

app = FastAPI(title="KathirVel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(products.router, prefix="/api/ornaments", tags=["Products"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])
