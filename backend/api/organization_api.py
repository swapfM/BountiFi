from db.models import Bounty
from sqlalchemy.orm import Session
from schema.organization_schema import BountyCreate
from fastapi import HTTPException, status
from db.models import User, Bounty


class OrganizationAPI:
    def __init__(self, db: Session):
        self.db = db

    async def create_bounty(self, bounty_data, current_user: User):
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
            return {"status": "success", "bounty": bounty}
        except Exception as e:
            self.db.rollback()
            return {"status": "error", "message": str(e)}
