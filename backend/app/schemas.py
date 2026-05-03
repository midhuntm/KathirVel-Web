from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=1)
    role: Literal["admin", "customer"] = "customer"


class AdminInviteRequest(BaseModel):
    inviter_email: EmailStr
    name: str = Field(min_length=1)
    email: EmailStr


class AcceptInviteRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)


class OrnamentCreate(BaseModel):
    name: str = Field(min_length=1)
    price: float = Field(ge=0)
    originalPrice: Optional[float] = None
    category: str = "General"
    image: Optional[str] = None
    images: list[str] = Field(default_factory=list)
    amazonUrl: Optional[str] = None
    flipkartUrl: Optional[str] = None
    description: Optional[str] = None


class OrderCreate(BaseModel):
    ornament_id: Optional[str] = None
    quantity: int = Field(ge=1, default=1)
    items: list[dict] = Field(default_factory=list)
    shipping_name: Optional[str] = None
    shipping_email: Optional[EmailStr] = None
    shipping_address: Optional[str] = None
