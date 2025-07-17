from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.hunter_api import HunterApi
from db.models import User
from api.user_api import get_current_user
from fastapi import HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from fastapi.responses import JSONResponse
from schema.common_schema import BountyGet, BountySummary, ErrorMessage, SuccessMessage
from schema.hunter_schema import CreateSolutionSchema
from logger import logger

router = APIRouter(prefix="/hunter", tags=["Hunter"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/open_bounties", response_model=list[BountySummary] | ErrorMessage)
@limiter.limit("5/minute")
async def get_open_bounties_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "HUNTER":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only hunters can view open bounties",
                },
            )
        hunter_api = HunterApi(db)
        return await hunter_api.get_open_bounties()
    except Exception as e:
        logger.error(f"Error fetching open bounties: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/bounty/{bounty_id}")
@limiter.limit("5/minute")
async def get_bounty_by_id_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "HUNTER":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Login as a hunter to view bounties",
                },
            )
        hunter_api = HunterApi(db)
        return await hunter_api.get_bounty_by_id(bounty_id=bounty_id)
    except Exception as e:
        logger.error(f"Error fetching bounty by ID {bounty_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/assign_bounty/{bounty_id}", response_model=SuccessMessage | ErrorMessage)
@limiter.limit("5/minute")
async def assign_bounty_api(
    request: Request,
    bounty_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "HUNTER":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Bounties can only be assigned to hunters",
                },
            )
        hunter_api = HunterApi(db)
        return await hunter_api.assign_bounty(
            bounty_id=bounty_id, hunter_id=current_user.id
        )
    except Exception as e:
        logger.error(
            f"Error assigning bounty {bounty_id} to hunter {current_user.id}: {str(e)}"
        )
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.get("/assigned_bounties", response_model=list[BountySummary] | ErrorMessage)
@limiter.limit("5/minute")
async def get_assigned_bounties_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "HUNTER":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only hunters can view their assigned bounties",
                },
            )
        hunter_api = HunterApi(db)
        return await hunter_api.get_assigned_bounties(hunter_id=current_user.id)
    except Exception as e:
        logger.error(f"Error fetching assigned bounties: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )


@router.post("/submit_solution", response_model=SuccessMessage | ErrorMessage)
@limiter.limit("5/minute")
async def submit_solution_api(
    request: Request,
    solution_data: CreateSolutionSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "HUNTER":
            return JSONResponse(
                status_code=403,
                content={
                    "status": "error",
                    "message": "Only hunters can create solutions",
                },
            )
        hunter_api = HunterApi(db)
        return await hunter_api.submit_solution(
            hunter_id=current_user.id, solution_data=solution_data
        )
    except Exception as e:
        logger.error(f"Error creating solution for bounty {bounty_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Something went wrong"},
        )
