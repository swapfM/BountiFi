from db.models import Bounty, BountySolution, BountyStatus
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

    async def assign_bounty(self, bounty_id: int, hunter_id: int):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}

            if bounty.status.value != "OPEN":
                return {
                    "status": "error",
                    "message": "Bounty is not open for assignment",
                }
            bounty.assigned_to = hunter_id
            bounty.status = "ASSIGNED"
            self.db.commit()
            self.db.refresh(bounty)
            return {"status": "success", "message": "Bounty assigned successfully"}
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
