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
    category: str = "General"
    image: Optional[str] = None
    description: Optional[str] = None
