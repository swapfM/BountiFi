from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Depends
from routes import user_routes, organization_routes
from db.database import get_db
from db.database import Base, engine
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


Base.metadata.create_all(bind=engine)

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.include_router(user_routes.router, prefix="/api")
app.include_router(organization_routes.router, prefix="/api")
