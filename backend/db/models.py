import enum
from sqlalchemy import Enum
from sqlalchemy import Column, Integer, String
from .database import Base

class UserType(enum.Enum):
    ORGANIZATION = "ORGANIZATION"
    HUNTER = "HUNTER"

class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True, unique=True, index=True)
    name = Column(String)
    password = Column(String)
    user_type = Column(Enum(UserType)) 

    def __repr__(self):
        return f"<User(email={self.email}, name={self.name}, user_type={self.user_type})>"
