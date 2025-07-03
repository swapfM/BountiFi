from sqlalchemy.orm import Session
from db import models, schema

def create_user(db: Session, user: schema.User_Create):
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

def login_user(db: Session, user: schema.User_Login):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        return None  
    return db_user