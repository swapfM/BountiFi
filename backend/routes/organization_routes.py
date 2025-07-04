from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.organization.organization_api import OrganizationAPI
from api.organization.organization_schema import BountyCreate
from db.models import User
from api.user.user_api import get_current_user


router = APIRouter(prefix="/organization", tags=["Organization"])


@router.post("/create_bounty")
async def create_bounty_api(
    bounty: BountyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.user_type.value != "ORGANIZATION":
        raise HTTPException(
            status_code=403, detail="Only organizations can post bounties"
        )
    organization_api = OrganizationAPI(db)
    return await organization_api.create_bounty(
        bounty_data=bounty, current_user=current_user
    )
