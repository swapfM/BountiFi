from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI, Depends
from routes import user_routes, organization_routes
from db.database import get_db
from db.database import Base, engine


Base.metadata.create_all(bind=engine)


app = FastAPI()


app.include_router(user_routes.router, prefix="/api")
app.include_router(organization_routes.router, prefix="/api")
