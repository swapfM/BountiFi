from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class BountySummary(BaseModel):
    id: int
    title: str
    payout_amount: float
    payout_currency: str
    description: str
    deadline: datetime | None = None
    tech_stack: list[str]
    status: str
    refund: bool

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


class BountySolutionResponse(BaseModel):
    id: int
    bounty_id: int
    hunter_id: int
    description: str
    solution_file: str | None = None
    solution_link: str | None = None
    status: str
    feedback: str | None = None
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class BountySolution(BaseModel):
    bounty_id: int
    hunter_id: int
    description: str
    solution_file: str | None = None
    solution_link: str | None = None
    status: str
    feedback: str | None = None

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
