import google.oauth2.credentials
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv
from os import getenv
load_dotenv()

client_config = {
    "web": {
        "client_id": getenv("OAUTH_GOOGLE_CLIENT_ID"),
        "client_secret": getenv("OAUTH_GOOGLE_CLIENT_SECRET"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["http://localhost:5000/google/auth"]
    }
}
flow_config = {
    "client_config": client_config,
    "scopes": [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ],
    "redirect_uri": "http://localhost:5000/google/auth"
}
flow = Flow.from_client_config(
    client_config=flow_config["client_config"],
    scopes=flow_config["scopes"],
    redirect_uri=flow_config["redirect_uri"]
)

authorization_url, state = flow.authorization_url(
    access_type='offline',
    prompt='consent'
    )