from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.user import user_schema as schema
from api.user.user_api import create_user, login_user
from db.models import User
from db.database import get_db

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/create", response_model=schema.User_Response)
async def create_user_api(user: schema.User_Create, db: Session = Depends(get_db)):
    result = await create_user(db, user)
    if isinstance(result, str) and result.startswith("Error"):
        raise HTTPException(status_code=400, detail=result)
    return result


@router.post("/login", response_model=schema.User_Response)
async def login_user_api(user: schema.User_Login, db: Session = Depends(get_db)):
    result = await login_user(db, user)
    if isinstance(result, str):
        raise HTTPException(status_code=401, detail=result)
    return result
