from sqlalchemy.orm import Session
from db import models, schema
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def encrypt_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def create_user_api(db: Session, user: schema.User_Create):
    try:
        hashed_password = encrypt_password(user.password)
        user.password = hashed_password  
        db_user = models.User(
            email=user.email,
            name=user.name,
            password=user.password,
            user_type=user.user_type
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        return f"Error creating user: {str(e)}"

async def login_user_api(db: Session, user: schema.User_Login):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if not db_user:
            return "User not found"
        if not verify_password(user.password, db_user.password):
            return "Invalid password"
        return db_user
    except Exception as e:
        return f"Error logging in user: {str(e)}"