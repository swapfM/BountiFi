from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schema.user_schema import User_Create, User_Login, User_Response
from api.user_api import create_user, login_user
from db.models import User
from db.database import get_db
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request


router = APIRouter(prefix="/user", tags=["User"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/create", response_model=User_Response)
@limiter.limit("5/minute")
async def create_user_api(
    request: Request, user: User_Create, db: Session = Depends(get_db)
):
    result = await create_user(db, user)
    if isinstance(result, str) and result.startswith("Error"):
        raise HTTPException(status_code=400, detail=result)
    return result


@router.post("/login", response_model=User_Response)
@limiter.limit("5/minute")
async def login_user_api(
    request: Request, user: User_Login, db: Session = Depends(get_db)
):
    result = await login_user(db, user)
    if isinstance(result, str):
        raise HTTPException(status_code=401, detail=result)
    return result
