from db.models import Bounty
from sqlalchemy.orm import Session
from api.organization.organization_schema import BountyCreate


class OrganizationAPI:
    def __init__(self, db: Session):
        self.db = db

    async def create_bounty(self, bounty_data, current_user):
        try:
            new_bounty = Bounty(**bounty_data.dict(), organization_id=current_user.id)
            self.db.add(new_bounty)
            self.db.commit()
            self.db.refresh(new_bounty)
            return {"status": "success", "bounty_id": new_bounty.id}
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

    async def delete_bounty(self, bounty_id, current_user):
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
