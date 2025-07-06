from datetime import datetime
from pydantic import BaseModel, Field


class BountyCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    link: str = Field(..., min_length=1, max_length=255)
    reward: float = Field(..., gt=0)
    deadline: datetime
    tags: list[str] = Field(default_factory=list)

    class Config:
        from_attributes = True
