from db.models import Bounty
from sqlalchemy.orm import Session, joinedload
from schema.common_schema import BountySummary
from schema.organization_schema import (
    BountyCreate,
)
from datetime import datetime
from fastapi import HTTPException, status
from db.models import (
    User,
    Bounty,
    BountyStatus,
    BountySolution,
    BountySolutionStatus,
    Transaction,
    TransactionStatus,
    TransactionType,
)
from utils.transaction_status import poll_transaction_status


class OrganizationAPI:
    def __init__(self, db: Session):
        self.db = db

    async def create_bounty(self, bounty_data, current_user: User):
        try:
            new_bounty = Bounty(**bounty_data.dict(), organization_id=current_user.id)
            self.db.add(new_bounty)
            self.db.commit()
            self.db.refresh(new_bounty)
            return {
                "status": "success",
                "message": "Created bounty successfully",
                "bounty": BountySummary.from_orm(new_bounty),
            }
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": str(e)}

    async def get_bounties_by_organization(self, organization_id):
        try:
            bounties = (
                self.db.query(Bounty)
                .filter(Bounty.organization_id == organization_id)
                .all()
            )

            now = datetime.utcnow()
            expired_bounties = []

            for bounty in bounties:
                if bounty.deadline < now and bounty.status not in [
                    BountyStatus.EXPIRED,
                    BountyStatus.COMPLETED,
                ]:
                    bounty.status = BountyStatus.EXPIRED
                    expired_bounties.append(bounty)

            self.db.commit()

            return bounties

        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def delete_bounty(self, bounty_id, current_user: User):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}
            if bounty.organization_id != current_user.id:
                return {
                    "status": "error",
                    "message": "Unauthorized to delete this bounty",
                }
            self.db.delete(bounty)
            self.db.commit()
            return {"status": "success", "message": "Bounty deleted successfully"}
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": str(e)}

    async def get_bounty_by_id(self, bounty_id: int, current_user: User):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            if bounty.organization_id != current_user.id:
                return {
                    "status": "error",
                    "message": "Unauthorized to view this bounty",
                }

            return bounty
        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def update_bounty(
        self, bounty_id: int, bounty_data: BountyCreate, current_user: User
    ):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            if bounty.organization_id != current_user.id:
                return {
                    "status": "error",
                    "message": "Unauthorized to update this bounty",
                }

            for key, value in bounty_data.dict().items():
                setattr(bounty, key, value)

            self.db.commit()
            self.db.refresh(bounty)
            return {"status": "success", "message": "Bounty updated successfully"}
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": str(e)}

    async def get_bounty_solution(self, bounty_id: int):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            solutions = bounty.solutions
            return solutions
        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def get_pending_submissions(self, organization_id: int):
        try:

            pending_bounties = (
                self.db.query(Bounty)
                .options(joinedload(Bounty.solutions).joinedload(BountySolution.hunter))
                .filter(
                    Bounty.status.in_([BountyStatus.IN_REVIEW, BountyStatus.COMPLETED])
                )
                .all()
            )

            result = []

            for bounty in pending_bounties:
                for solution in bounty.solutions:
                    if solution.status == BountySolutionStatus.IN_REVIEW:
                        result.append(
                            {
                                "bounty_id": bounty.id,
                                "bounty_title": bounty.title,
                                "bounty_description": bounty.description,
                                "payout_amount": bounty.payout_amount,
                                "hunter_name": solution.hunter.name,
                                "hunter_id": solution.hunter.id,
                                "submitted_at": solution.updated_at,
                                "solution_id": solution.id,
                                "solution_description": solution.description,
                                "solution_link": solution.solution_link,
                                "solution_status": solution.status,
                            }
                        )
            return result
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def approve_submission(
        self, submission_id: int, transaction_hash: str, bounty_id: int
    ):
        try:

            submission = (
                self.db.query(BountySolution)
                .filter(BountySolution.id == submission_id)
                .first()
            )

            if not submission:
                return {"status": "error", "message": "submission not found"}
            elif submission.status == BountySolutionStatus.ACCEPTED:
                return {"status": "error", "message": "Already approved"}
            bounty = submission.bounty
            if not bounty:
                return {"status": "error", "message": "bounty not found"}
            elif bounty.status != BountyStatus.IN_REVIEW:
                return {"status": "error", "message": "bounty must be under review"}

            transaction_data = {
                "bounty_title": bounty.title,
                "transaction_hash": transaction_hash,
                "transaction_type": TransactionType.RECEIVE_PAYOUT,
                "transaction_status": TransactionStatus.PENDING,
                "amount": bounty.payout_amount,
                "user_id": bounty.assigned_to,
            }

            await self.create_transaction(transaction_data=transaction_data)
            status = await poll_transaction_status(transaction_hash)

            transaction = (
                self.db.query(Transaction)
                .filter(Transaction.transaction_hash == transaction_hash)
                .first()
            )

            if not transaction:
                return {
                    "status": "error",
                    "message": "Transaction record not found after creation",
                }

            if status == "success":
                submission.status = BountySolutionStatus.ACCEPTED
                bounty.status = BountyStatus.COMPLETED
                transaction.transaction_status = TransactionStatus.SUCCESS
                self.db.commit()
                return {
                    "status": "success",
                    "message": "Successfully paid to hunter",
                }
            else:
                transaction.transaction_status = TransactionStatus.FAILED
                self.db.commit()
                return {
                    "status": "error",
                    "message": "Failed to approve solution",
                }
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def create_transaction(self, transaction_data):
        try:

            new_transaction = Transaction(**transaction_data)

            self.db.add(new_transaction)
            self.db.commit()
            self.db.refresh(new_transaction)

            return {"status": "success", "transaction": new_transaction}

        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def get_transactions(self, current_user: User):
        try:
            transactions = (
                self.db.query(Transaction)
                .filter(Transaction.user_id == current_user.id)
                .order_by(Transaction.created_at.desc())
                .all()
            )
            return transactions
        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def mark_refunded(self, bounty_id):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()

            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            if bounty.refund:
                return {
                    "status": "error",
                    "message": "Bounty already marked as refunded",
                }

            bounty.refund = True
            self.db.commit()

            return {"status": "success", "message": "Bounty marked as refunded"}
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def fund_bounty(
        self, transaction_hash: str, bounty_id: int, current_user: User
    ):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "bounty not found"}
            elif bounty.status != BountyStatus.UNFUNDED:
                return {"status": "error", "message": "bounty not unfunded"}

            transaction_data = {
                "bounty_title": bounty.title,
                "transaction_hash": transaction_hash,
                "transaction_type": TransactionType.FUND_BOUNTY,
                "transaction_status": TransactionStatus.PENDING,
                "amount": bounty.payout_amount,
                "user_id": current_user.id,
            }

            await self.create_transaction(transaction_data=transaction_data)

            status = await poll_transaction_status(transaction_hash)

            transaction = (
                self.db.query(Transaction)
                .filter(Transaction.transaction_hash == transaction_hash)
                .first()
            )

            if not transaction:
                return {
                    "status": "error",
                    "message": "Transaction record not found after creation",
                }

            if status == "success":
                bounty.status = BountyStatus.OPEN
                transaction.transaction_status = TransactionStatus.SUCCESS
                self.db.commit()
                return {
                    "status": "success",
                    "message": "bounty funded successfully",
                }
            else:
                transaction.transaction_status = TransactionStatus.FAILED
                self.db.commit()
                return {"status": "error", "message": "transaction failed"}

        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": f"Server error: {str(e)}"}
