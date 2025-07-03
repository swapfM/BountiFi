
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI,Depends
from db.database import engine, SessionLocal, Base
from db.schema import User_Create, User_Login
from api.user_api import create_user, login_user
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
def create_user(user: User_Create, db: Session = Depends(get_db)):
    return create_user(db=db, user=user)

@app.get("/api/user/login")
def login_user(user: User_Login, db: Session = Depends(get_db)):
    return login_user(db=db, user=user)
