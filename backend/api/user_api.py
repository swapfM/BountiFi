from sqlalchemy.orm import Session
from db import models, schema
from argon2 import PasswordHasher
import os
import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return "Token has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"
    except Exception as e:
        return f"Error verifying token: {str(e)}"


def encrypt_password(password: str) -> str:
    pwd_context = PasswordHasher()
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_context = PasswordHasher()
    try:
        return pwd_context.verify(hashed_password, plain_password)
    except Exception as e:
        return False


async def create_user(db: Session, user: schema.User_Create):
    try:
        hashed_password = encrypt_password(user.password)
        user.password = hashed_password
        db_user = models.User(
            email=user.email,
            name=user.name,
            password=user.password,
            user_type=user.user_type,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        access_token = create_access_token(data={"email": db_user.email})
        return {
            "name": db_user.name,
            "user_type": db_user.user_type.value,
            "access_token": access_token,
        }
    except Exception as e:
        db.rollback()
        return f"Error creating user: {str(e)}"


async def login_user(db: Session, user: schema.User_Login):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if not db_user:
            return "User not found"

        if not verify_password(user.password, db_user.password):
            return "Invalid password"

        access_token = create_access_token(data={"email": db_user.email})

        return {
            "name": db_user.name,
            "user_type": db_user.user_type.value,
            "access_token": access_token,
        }
    except Exception as e:
        return f"Error logging in user: {str(e)}"
