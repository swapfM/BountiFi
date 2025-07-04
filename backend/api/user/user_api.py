from sqlalchemy.orm import Session
from db import models
from argon2 import PasswordHasher
import os
import jwt
from datetime import datetime, timedelta
from api.user import user_schema as schema
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from db.database import get_db

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")


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


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    try:
        payload = jwt.decode(
            token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")]
        )
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        db_user = db.query(models.User).filter(models.User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        return db_user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Token error: {str(e)}")


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
        access_token = create_access_token(
            data={
                "sub": db_user.email,
                "id": db_user.id,
                "scope": db_user.user_type.value,
            }
        )
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

        access_token = create_access_token(
            data={
                "sub": db_user.email,
                "id": db_user.id,
                "scope": db_user.user_type.value,
            }
        )

        return {
            "name": db_user.name,
            "user_type": db_user.user_type.value,
            "access_token": access_token,
        }
    except Exception as e:
        return f"Error logging in user: {str(e)}"
