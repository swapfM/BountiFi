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
