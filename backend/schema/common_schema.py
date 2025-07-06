from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class BountySummary(BaseModel):
    id: int
    title: str
    reward: float
    status: str
    deadline: datetime | None = None
    tags: list[str]

    class Config:
        from_attributes = True


class BountyGet(BaseModel):
    id: int
    title: str
    description: str
    link: str | None = None
    reward: float
    status: str
    organization_id: int
    deadline: datetime
    tags: list[str]
    created_at: datetime
    updated_at: datetime | None = None
    assigned_to: int | None = None

    class Config:
        from_attributes = True


class ErrorMessage(BaseModel):
    status: Literal["error"]
    message: str

    class Config:
        from_attributes = True


class SuccessMessage(BaseModel):
    status: Literal["success"]
    message: str

    class Config:
        from_attributes = True
