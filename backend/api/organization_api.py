from db.models import Bounty
from sqlalchemy.orm import Session, joinedload
from schema.common_schema import BountySummary
from schema.organization_schema import BountyCreate, TransactionCreateSchema
from fastapi import HTTPException, status
from db.models import (
    User,
    Bounty,
    BountyStatus,
    BountySolution,
    BountySolutionStatus,
    Transaction,
)


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
                .filter(Bounty.status == BountyStatus.IN_REVIEW)
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
                                "hunter_name": solution.hunter.name,
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

    async def approve_submission(self, submission_id: int):
        try:
            submission = (
                self.db.query(BountySolution)
                .filter(BountySolution.id == submission_id)
                .first()
            )
            bounty = submission.bounty
            submission.status = BountySolutionStatus.ACCEPTED
            bounty.status = BountyStatus.COMPLETED
            self.db.commit()
            self.db.refresh(bounty)
            self.db.refresh(submission)
            return {
                "status": "success",
                "bounty_id": bounty.id,
                "new_status": bounty.status.value,
            }
        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def create_transaction(
        self, transaction_data: TransactionCreateSchema, current_user: User
    ):
        try:

            new_transaction = Transaction(
                **transaction_data.dict(), user_id=current_user.id
            )
            self.db.add(new_transaction)
            self.db.commit()
            self.db.refresh(new_transaction)

        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def get_transactions(self, current_user: User):
        try:
            transactions = (
                self.db.query(Transaction)
                .filter(Transaction.user_id == current_user.id)
                .all()
            )
            return transactions
        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}
