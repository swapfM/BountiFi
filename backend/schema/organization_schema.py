from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class BountyCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    codebase_link: Optional[str] = Field(
        default=None, min_length=1, max_length=255, alias="codebaseUrl"
    )
    website_link: Optional[str] = Field(
        default=None, max_length=255, alias="externalWebsite"
    )
    github_issue_link: Optional[str] = Field(
        default=None, max_length=255, alias="githubIssueLink"
    )
    payout_amount: float = Field(..., gt=0, alias="payoutAmount")
    payout_currency: str = Field(..., min_length=1, alias="payoutCurrency")

    deadline: datetime
    tech_stack: list[str] = Field(default_factory=list, alias="techStack")

    class Config:
        from_attributes = True


class FundBountySchema(BaseModel):
    transaction_hash: str = Field(alias="transactionHash")
    bounty_id: int = Field(alias="bountyId")
