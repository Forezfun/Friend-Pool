from fastapi import APIRouter, Request, Response
from app.helpers import oauth_google
from fastapi.responses import RedirectResponse
from google.auth.transport import requests as google_requests
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from pydantic import BaseModel
from app.db import session as sessionModule
from app.models import user as userModule
from decimal import Decimal
from app.helpers import tokens
from app.models import access_token as accessModule
from app.models import refresh_token as refreshModule

router = APIRouter(
    tags=["google"],
    prefix='/google'
    )

class createUser(BaseModel):
    googleId:str

class tokensData(BaseModel):
    access_token:str
    refresh_token:str

@router.get("/url")
def redirect_to_url():
    return RedirectResponse(oauth_google.authorization_url)

@router.get("/auth")
async def middleware_google_auth(request:Request,response:Response):
    code = request.query_params.get("code")

    flow = Flow.from_client_config(
        client_config=oauth_google.flow_config["client_config"],
        scopes=oauth_google.flow_config["scopes"],
        redirect_uri=oauth_google.flow_config["redirect_uri"]
    )

    flow.fetch_token(code=code)
    credentials = flow.credentials

    id_info = id_token.verify_oauth2_token(
        credentials.id_token,
        google_requests.Request(),
        oauth_google.client_config['web']['client_id']
    )

    googleId = int(id_info["sub"])

    data = await reg_user(googleId=googleId)
    if isinstance(data, tokensData):
        redirect_url = "http://localhost:4200/"
        return add_tokens_to_response(tokens=data,redirect_url=redirect_url+'rooms')
    else:
        return RedirectResponse(url=redirect_url)


async def reg_user(googleId:int):
    try:
        db_session=sessionModule.db_session
        user = db_session.get(userModule.User, googleId)
        if not(user):
            user = userModule.User(googleId=googleId)
            db_session.add(user)

        access_token = accessModule.AccessToken(googleId=googleId,accessToken=tokens.encode_access_token(str(googleId)))
        refresh_token = refreshModule.RefreshToken(googleId=googleId,refreshToken=tokens.encode_refresh_token(str(googleId)))
        db_session.add_all([access_token,refresh_token])

        db_session.commit()
        return tokensData(
            access_token=access_token.accessToken,
            refresh_token=refresh_token.refreshToken
        )
    except Exception as error:
        return {
            "message":str(error)
        }

def add_tokens_to_response(tokens:tokensData,redirect_url:str):
    response = RedirectResponse(url=redirect_url)
    
    response.set_cookie(
        key='refresh_token',
        value=tokens.refresh_token,
        httponly=True,
        samesite='lax',
        max_age=7*24*3600,
        path="/"  # domain='' или не указывать
    )
    response.set_cookie(
        key='access_token',
        value=tokens.refresh_token,
        httponly=True,
        samesite='lax',
        max_age=24*3600,
        path="/"  # domain='' или не указывать
    )
    return response