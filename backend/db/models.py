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
    Float,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class UserType(enum.Enum):
    ORGANIZATION = "ORGANIZATION"
    HUNTER = "HUNTER"


class TransactionType(enum.Enum):
    FUND_BOUNTY = "FUND_BOUNTY"
    RECEIVE_PAYOUT = "RECEIVE_PAYOUT"


class TransactionStatus(enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"


class BountyStatus(enum.Enum):
    UNFUNDED = "UNFUNDED"
    OPEN = "OPEN"
    ASSIGNED = "ASSIGNED"
    IN_REVIEW = "IN_REVIEW"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"


class BountySolutionStatus(enum.Enum):
    IN_REVIEW = "IN_REVIEW"
    ACCEPTED = "ACCEPTED"
    NEEDS_CHANGES = "NEEDS_CHANGES"


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

    transactions = relationship("Transaction", back_populates="user")

    solutions = relationship("BountySolution", back_populates="hunter")

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
    codebase_link = Column(String(255), nullable=True)
    website_link = Column(String(255), nullable=True)
    github_issue_link = Column(String(255), nullable=True)
    payout_currency = Column(String(255), nullable=False)
    payout_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(BountyStatus), default=BountyStatus.UNFUNDED, nullable=False)
    organization_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    deadline = Column(DateTime, nullable=False)
    tech_stack = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    refund = Column(Boolean, default=False)

    organization = relationship(
        "User", foreign_keys=[organization_id], back_populates="created_bounties"
    )
    hunter = relationship(
        "User", foreign_keys=[assigned_to], back_populates="assigned_bounties"
    )
    solutions = relationship("BountySolution", back_populates="bounty")


class BountySolution(Base):
    __tablename__ = "bounty_solutions"

    id = Column(Integer, primary_key=True, index=True)
    bounty_id = Column(Integer, ForeignKey("bounties.id"), nullable=False)
    hunter_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    description = Column(Text, nullable=False)
    solution_file = Column(String(255), nullable=True)
    solution_link = Column(String(255), nullable=True)
    status = Column(
        Enum(BountySolutionStatus),
        default=BountySolutionStatus.IN_REVIEW,
        nullable=False,
    )
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    bounty = relationship("Bounty", back_populates="solutions")
    hunter = relationship("User", back_populates="solutions")

    def __repr__(self):
        return (
            f"<BountySolution(id={self.id}, bounty_id={self.bounty_id}, "
            f"hunter_id={self.hunter_id})>"
        )


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    bounty_title = Column(String(255), nullable=False)
    transaction_hash = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    transaction_type = Column(Enum(TransactionType), nullable=False)
    transaction_status = Column(Enum(TransactionStatus), nullable=False)
    amount = Column(Float, nullable=False)

    user = relationship("User", back_populates="transactions")
