import enum
from sqlalchemy import Enum
from sqlalchemy import Column, Integer, String, list
from .database import Base


class UserType(enum.Enum):
    ORGANIZATION = "ORGANIZATION"
    HUNTER = "HUNTER"


class BountyStatus(enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)
    user_type = Column(Enum(UserType))
    wallet_address = Column(String, nullable=True)

    def __repr__(self):
        return f"<User(email={self.email}, name={self.name}, user_type={self.user_type}, wallet_address={self.wallet_address})>"


class Bounty(Base):
    __tablename__ = "bounties"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    reward = Column(Integer)
    status = Column(Enum(BountyStatus), default=BountyStatus.OPEN)
    organization_id = Column(Integer)
    deadline = Column(String)
    tags = Column(list, nullable=True)
    created_at = Column(Integer)
    assigned_to = Column(Integer, nullable=True)

    def __repr__(self):
        return (
            f"<Bounty(title={self.title}, reward={self.reward}, status={self.status})>"
        )
