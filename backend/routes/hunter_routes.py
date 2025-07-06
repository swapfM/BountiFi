from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.hunter.hunter_api import HunterApi
from db.models import User
from api.user.user_api import get_current_user
from fastapi import HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/hunter", tags=["Hunter"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/open_bounties")
@limiter.limit("5/minute")
async def get_open_bounties_api(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if current_user.user_type.value != "HUNTER":
            raise HTTPException(
                status_code=403, detail="Only hunters can view open bounties"
            )
        hunter_api = HunterApi(db)
        return await hunter_api.get_open_bounties()
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )
