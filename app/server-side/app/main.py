from fastapi import FastAPI, APIRouter, Request
from app.db.session import init_db, close_db
from app.routers import google
from app.routers import rooms
from fastapi.middleware.cors import CORSMiddleware
from app.helpers.tokens import decode_access_token
from starlette.responses import Response
print()
app = FastAPI()
routers = [google.router, rooms.router]

origins = [
    "http://localhost:4200",
    "http://localhost:4200/api",
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],            
)

for router in routers:
    app.include_router(router)

@app.middleware("http")
async def cookie_parse(request:Request,call_next):
    access_token = request.cookies.get("access_token")
    print(request.cookies)
    googleId = None

    if access_token:
        googleId = decode_access_token(access_token)

    request.state.googleId = googleId

    print(googleId)
    response = await call_next(request)
    return response

@app.on_event("startup")
def startup_event():
    init_db()

@app.on_event("shutdown")
def shutdown_event():
    close_db()
