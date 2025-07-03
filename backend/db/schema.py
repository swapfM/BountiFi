from pydantic import BaseModel

class User_Create(BaseModel):
    email: str
    name: str
    password: str
    user_type: str  

    class Config:
        orm_mode = True  

class User_Login(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True