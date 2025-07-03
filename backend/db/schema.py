from pydantic import BaseModel

class User(BaseModel):
    email: str
    name: str
    password: str
    user_type: str  

    class Config:
        orm_mode = True  