from db.models import Bounty
from sqlalchemy.orm import Session


class HunterApi:
    def __init__(self, db: Session):
        self.db = db

    async def get_open_bounties(self):
        try:
            bounties = self.db.query(Bounty).filter(Bounty.status == "OPEN").all()
            return bounties
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def get_bounty_by_id(self, bounty_id: int):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}
            return bounty
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def assign_bounty(self, bounty_id: int, hunter_id: int):
        try:
            bounty = self.db.query(Bounty).filter(Bounty.id == bounty_id).first()
            if not bounty:
                return {"status": "error", "message": "Bounty not found"}
            if bounty.status != "OPEN":
                return {
                    "status": "error",
                    "message": "Bounty is not open for assignment",
                }
            bounty.assigned_to = hunter_id
            bounty.status = "ASSIGNED"
            self.db.commit()
            self.db.refresh(bounty)
            return {"status": "success", "bounty": bounty}
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": str(e)}
