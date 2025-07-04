from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI, Depends
from db.database import engine, SessionLocal, Base
from api.user.schema import User_Create, User_Login, User_Response
from api.user.user_api import create_user, login_user
from sqlalchemy.orm import Session


Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/user/create")
async def create_user_api(
    user: User_Create, db: Session = Depends(get_db)
) -> User_Response:
    return await create_user(db=db, user=user)


@app.post("/api/user/login")
async def login_user_api(
    user: User_Login, db: Session = Depends(get_db)
) -> User_Response:
    return await login_user(db=db, user=user)
