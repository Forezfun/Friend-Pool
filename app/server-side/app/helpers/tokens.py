import jwt
import datetime
from dotenv import load_dotenv
from os import getenv
load_dotenv()
SECRET_KEY = getenv("SECRET_KEY")

def encode_access_token(googleId:str):
    payload = {
        "googleId": googleId,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def encode_refresh_token(googleId:str):
    payload = {
        "googleId": googleId,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_access_token(token:str):
    try:
        payload = jwt.decode(token,SECRET_KEY, algorithms=["HS256"])
        return payload.get("googleId")
    except:
        return False

def decode_refresh_token(token:str):
    try:
        payload = jwt.decode(token,SECRET_KEY, algorithms=["HS256"])
        return payload.get("googleId")
    except:
        return False
