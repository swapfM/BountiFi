from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.organization_api import OrganizationAPI
from schema.organization_schema import BountyCreate, FundBountySchema
from schema.common_schema import (
    BountyGet,
    BountySummary,
    ErrorMessage,
    SuccessMessage,
    BountySolutionResponse,
)
from db.models import User
from api.user_api import get_current_user
from fastapi import HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from fastapi.responses import JSONResponse
from logger import logger


router = APIRouter(prefix="/organization", tags=["Organization"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/create_bounty")
# @limiter.limit("5/minute")
async def create_bounty_api(
    request: Request,
    bounty: BountyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can post bounties",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.create_bounty(
            bounty_data=bounty, current_user=current_user
        )
    except Exception as e:
        logger.error(f"Error creating bounty: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/bounties", response_model=list[BountySummary] | ErrorMessage)
# @limiter.limit("5/minute")
async def get_bounties_by_organization_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can view their bounties",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_bounties_by_organization(
            organization_id=current_user.id
        )
    except Exception as e:
        logger.error(f"Error fetching bounties by organization: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.delete(
    "/delete_bounty/{bounty_id}", response_model=SuccessMessage | ErrorMessage
)
# @limiter.limit("5/minute")
async def delete_bounty_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can delete bounties",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.delete_bounty(
            bounty_id=bounty_id, current_user=current_user
        )
    except Exception as e:
        logger.error(f"Error deleting bounty {bounty_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/bounty/{bounty_id}")
# @limiter.limit("5/minute")
async def get_bounty_by_id_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can view their bounties",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_bounty_by_id(
            bounty_id=bounty_id, current_user=current_user
        )
    except Exception as e:
        logger.error(f"Error fetching bounty by ID {bounty_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.put("/update_bounty/{bounty_id}", response_model=SuccessMessage | ErrorMessage)
# @limiter.limit("5/minute")
async def update_bounty_api(
    request: Request,
    bounty_id: int,
    bounty: BountyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can update bounties",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.update_bounty(
            bounty_id=bounty_id, bounty_data=bounty, current_user=current_user
        )
    except Exception as e:
        logger.error(f"Error updating bounty {bounty_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get(
    "/bounty_solution/{bounty_id}", response_model=BountySolutionResponse | ErrorMessage
)
# @limiter.limit("5/minute")
async def get_bounty_solutions_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can view bounty solutions",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_bounty_solution(bounty_id=bounty_id)
    except Exception as e:
        logger.error(f"Error fetching solutions for bounty {bounty_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/pending_submissions")
async def get_pending_submissions_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can view their bounties",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_pending_submissions(
            organization_id=current_user.id
        )
    except Exception as e:
        logger.error(f"Error fetching submissions {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.post("/approve_submission/{submission_id}")
async def get_approve_submissions_api(
    request: Request,
    submission_id: int,
    data: FundBountySchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only organizations can approve their bounties",
                },
            )

        organization_api = OrganizationAPI(db)
        return await organization_api.approve_submission(
            submission_id=submission_id,
            transaction_hash=data.transaction_hash,
            bounty_id=data.bounty_id,
        )

    except Exception as e:
        logger.error(f"Error approving submissions {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/transactions")
async def get_transactions_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value not in ["ORGANIZATION", "HUNTER"]:
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Not Allowed",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.get_transactions(current_user=current_user)

    except Exception as e:
        logger.error(f"Error getting transactions {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.post("/mark_refunded")
async def mark_refunded_api(
    request: Request,
    data: FundBountySchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Not Allowed",
                },
            )
        organization_api = OrganizationAPI(db)
        return await organization_api.mark_refunded(
            bounty_id=data.bounty_id,
            transaction_hash=data.transaction_hash,
            current_user=current_user,
        )

    except Exception as e:
        logger.error(f"Error marking as refunded {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.post("/fund_bounty")
async def fund_bounty_api(
    request: Request,
    data: FundBountySchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "ORGANIZATION":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Not Allowed",
                },
            )
        organization_api = OrganizationAPI(db)

        return await organization_api.fund_bounty(
            transaction_hash=data.transaction_hash,
            bounty_id=data.bounty_id,
            current_user=current_user,
        )
    except Exception as e:
        logger.error(f"Error marking as refunded {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )
