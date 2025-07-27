from pydantic import BaseModel, Field
from typing import Optional


class CreateSolutionSchema(BaseModel):
    bounty_id: int = Field(..., alias="bountyId")
    description: str
    solution_file: Optional[str] = Field(None, alias="solutionFile")
    solution_link: Optional[str] = Field(alias="solutionLink")


class AssignBountySchema(BaseModel):
    transaction_hash: str = Field(alias="transactionHash")
    bounty_id: int = Field(alias="bountyId")


class MintPayloadSchema(BaseModel):
    transactionHash: str
