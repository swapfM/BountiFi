from pydantic import BaseModel, Field
from typing import Optional


class CreateSolutionSchema(BaseModel):
    bounty_id: int = Field(..., alias="bountyId")
    description: str
    solution_file: Optional[str] = Field(None, alias="solutionFile")
    solution_link: Optional[str] = Field(alias="solutionLink")
