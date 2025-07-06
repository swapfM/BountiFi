from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.organization.organization_api import OrganizationAPI
from api.organization.organization_schema import (
    BountyCreate,
    BountyGet,
    ErrorMessage,
    BountySummary,
)
from db.models import User
from api.user.user_api import get_current_user
from fastapi import HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/organization", tags=["Organization"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/create_bounty")
@limiter.limit("5/minute")
async def create_bounty_api(
    request: Request,
    bounty: BountyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            raise HTTPException(
                status_code=403, detail="Only organizations can post bounties"
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.create_bounty(
            bounty_data=bounty, current_user=current_user
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )


@router.get("/bounties", response_model=list[BountySummary])
@limiter.limit("5/minute")
async def get_bounties_by_organization_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            raise HTTPException(
                status_code=403, detail="Only organizations can view their bounties"
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_bounties_by_organization(
            organization_id=current_user.id
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )


@router.delete("/delete_bounty/{bounty_id}")
@limiter.limit("5/minute")
async def delete_bounty_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            raise HTTPException(
                status_code=403, detail="Only organizations can delete bounties"
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.delete_bounty(
            bounty_id=bounty_id, current_user=current_user
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )


@router.get("/bounty/{bounty_id}", response_model=BountyGet | ErrorMessage)
@limiter.limit("5/minute")
async def get_bounty_by_id_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            raise HTTPException(
                status_code=403, detail="Only organizations can view their bounties"
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_bounty_by_id(
            bounty_id=bounty_id, current_user=current_user
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )


@router.put("/update_bounty/{bounty_id}")
@limiter.limit("5/minute")
async def update_bounty_api(
    request: Request,
    bounty_id: int,
    bounty: BountyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            raise HTTPException(
                status_code=403, detail="Only organizations can update bounties"
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.update_bounty(
            bounty_id=bounty_id, bounty_data=bounty, current_user=current_user
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )
