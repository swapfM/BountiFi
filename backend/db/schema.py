from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class User_Create(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=5)
    user_type: Literal["ORGANIZATION", "HUNTER"]

    class Config:
        from_attributes = True


class User_Login(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True


class User_Response(BaseModel):
    name: str
    user_type: Literal["ORGANIZATION", "HUNTER"]
    access_token: str

    class Config:
        from_attributes = True
