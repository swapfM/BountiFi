from datetime import datetime
from pydantic import BaseModel, Field, EmailStr


class Bounty_Create(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    reward: float = Field(..., gt=0)
    organization_id: int
    deadline: datetime
    tags: list[str] = Field(default_factory=list)

    class Config:
        from_attributes = True
