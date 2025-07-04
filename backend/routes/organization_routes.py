from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.organization.organization_api import OrganizationAPI
from api.organization.organization_schema import BountyCreate


router = APIRouter(prefix="/organization", tags=["Organization"])


@router.post("/create_bounty")
async def create_bounty_api(bounty: BountyCreate, db: Session = Depends(get_db)):
    organization_api = OrganizationAPI(db)
    return await organization_api.create_bounty(bounty_data=bounty)
