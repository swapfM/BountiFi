import enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Numeric,
    ForeignKey,
    Enum,
    JSON,
    Boolean,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class UserType(enum.Enum):
    ORGANIZATION = "ORGANIZATION"
    HUNTER = "HUNTER"


class BountyStatus(enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    wallet_address = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    created_bounties = relationship(
        "Bounty", foreign_keys="Bounty.organization_id", back_populates="organization"
    )
    assigned_bounties = relationship(
        "Bounty", foreign_keys="Bounty.assigned_to", back_populates="hunter"
    )

    def __repr__(self):
        return (
            f"<User(id={self.id}, email={self.email}, "
            f"name={self.name}, user_type={self.user_type})>"
        )


class Bounty(Base):
    __tablename__ = "bounties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    reward = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(BountyStatus), default=BountyStatus.OPEN, nullable=False)
    organization_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    deadline = Column(DateTime, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    organization = relationship(
        "User", foreign_keys=[organization_id], back_populates="created_bounties"
    )
    hunter = relationship(
        "User", foreign_keys=[assigned_to], back_populates="assigned_bounties"
    )

    def __repr__(self):
        return (
            f"<Bounty(id={self.id}, title={self.title}, "
            f"reward={self.reward}, status={self.status})>"
        )
