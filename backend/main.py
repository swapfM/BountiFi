from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI,Depends
from db.database import engine, SessionLocal, Base
from db.schema import User_Create, User_Login
from api.user_api import create_user_api, login_user_api
from sqlalchemy.orm import Session
import api.user_api



Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/user/create")
async def create_user(user: User_Create, db: Session = Depends(get_db)):
    return await create_user_api(db=db, user=user)

@app.post("/api/user/login")
async def login_user(user: User_Login, db: Session = Depends(get_db)):
    return await login_user_api(db=db, user=user)
