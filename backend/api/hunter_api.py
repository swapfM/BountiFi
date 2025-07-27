from db.models import (
    User,
    Bounty,
    BountySolution,
    BountyStatus,
    Transaction,
    TransactionStatus,
    TransactionType,
)
from utils.transaction_status import poll_transaction_status
from sqlalchemy.orm import Session
from logger import logger


class HunterApi:
    def __init__(self, db: Session):
        self.db = db

    async def get_open_bounties(self):
        try:
            bounties = self.db.query(Bounty).filter(Bounty.status == "OPEN").all()
            return bounties
        except Exception as e:
            logger.error(f"Error fetching open bounties: {str(e)}")
            return {"status": "error", "message": "Something went wrong"}

    async def get_bounty_by_id(self, bounty_id: int):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}
            return bounty
        except Exception as e:
            logger.error(f"Error fetching bounty by ID {bounty_id}: {str(e)}")
            return {"status": "error", "message": "Something went wrong"}

    async def assign_bounty(
        self, transaction_hash: str, bounty_id: int, hunter_id: int
    ):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            if bounty.status != BountyStatus.OPEN:
                return {
                    "status": "error",
                    "message": "Bounty is not open for assignment",
                }

            transaction_data = {
                "bounty_title": bounty.title,
                "transaction_hash": transaction_hash,
                "transaction_type": TransactionType.ASSIGN_BOUNTY,
                "transaction_status": TransactionStatus.PENDING,
                "amount": 0,
                "user_id": hunter_id,
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
                bounty.assigned_to = hunter_id
                bounty.status = BountyStatus.ASSIGNED
                transaction.transaction_status = TransactionStatus.SUCCESS
                self.db.commit()
                return {
                    "status": "success",
                    "message": "Successfully assigned bounty.",
                }
            else:
                transaction.transaction_status = TransactionStatus.FAILED
                self.db.commit()
                return {
                    "status": "error",
                    "message": "Failed to assign bounty",
                }
        except Exception as e:
            self.db.rollback()
            logger.error(
                f"Error assigning bounty {bounty_id} to hunter {hunter_id}: {str(e)}"
            )
            return {"status": "error", "message": "Something went wrong"}

    async def get_assigned_bounties(self, hunter_id: int):
        try:
            bounties = (
                self.db.query(Bounty)
                .filter(Bounty.assigned_to == hunter_id, Bounty.status == "ASSIGNED")
                .all()
            )
            return bounties
        except Exception as e:
            logger.error(
                f"Error fetching assigned bounties for hunter {hunter_id}: {str(e)}"
            )
            return {"status": "error", "message": "Something went wrong"}

    async def submit_solution(self, hunter_id: int, solution_data):
        try:
            bounty = (
                self.db.query(Bounty.id, Bounty.assigned_to, Bounty.status)
                .filter(Bounty.id == solution_data.bounty_id)
                .first()
            )
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            if bounty.assigned_to != hunter_id:
                return {
                    "status": "error",
                    "message": "You are not assigned to this bounty",
                }

            existing_solution = (
                self.db.query(BountySolution)
                .filter_by(bounty_id=solution_data.bounty_id, hunter_id=hunter_id)
                .first()
            )

            if existing_solution:
                self.db.delete(existing_solution)

            solution = BountySolution(
                bounty_id=solution_data.bounty_id,
                hunter_id=hunter_id,
                description=solution_data.description,
                solution_file=solution_data.solution_file,
                solution_link=solution_data.solution_link,
            )
            self.db.query(Bounty).filter(Bounty.id == solution_data.bounty_id).update(
                {"status": BountyStatus.IN_REVIEW}
            )

            self.db.add(solution)
            self.db.commit()
            self.db.refresh(solution)

            return {"status": "success", "message": "Solution submitted successfully"}

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error submitting solution: {str(e)}")
            return {"status": "error", "message": "Something went wrong"}

    async def get_solution_count(self, hunter_id: int):
        try:
            count = (
                self.db.query(BountySolution)
                .filter(BountySolution.hunter_id == hunter_id)
                .count()
            )
            return {"count": count}
        except Exception as e:
            logger.error(
                f"Error fetching solutions count for hunter {hunter_id}: {str(e)}"
            )
            return {"status": "error", "message": "Something went wrong"}

    async def create_transaction(self, transaction_data):
        try:

            new_transaction = Transaction(**transaction_data)

            self.db.add(new_transaction)
            self.db.commit()
            self.db.refresh(new_transaction)

            return {"status": "success", "transaction": new_transaction}

        except Exception as e:
            return {"status": "error", "message": f"Server error: {str(e)}"}

    async def mint_nft(self, transaction_hash: str, hunter_id: int):
        try:
            user = self.db.query(User).filter(User.id == hunter_id).first()
            if not user:
                return {"status": "error", "message": "Hunter not Found"}

            transaction_data = {
                "bounty_title": "Elite Bounty Hunter",
                "transaction_hash": transaction_hash,
                "transaction_type": TransactionType.MINT_NFT,
                "transaction_status": TransactionStatus.PENDING,
                "amount": 0,
                "user_id": hunter_id,
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
                transaction.transaction_status = TransactionStatus.SUCCESS
                self.db.commit()
                return {
                    "status": "success",
                    "message": "Successfully Minted NFT.",
                }
            else:
                transaction.transaction_status = TransactionStatus.FAILED
                self.db.commit()
                return {
                    "status": "error",
                    "message": "NFT minting failed",
                }
        except Exception as e:
            logger.error(f"Error minting NFT count for hunter {hunter_id}: {str(e)}")
            return {"status": "error", "message": "Something went wrong"}
