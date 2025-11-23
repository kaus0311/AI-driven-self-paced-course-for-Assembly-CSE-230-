from datetime import timedelta
from typing import Annotated
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.models.request_models import Token, UserCreate, UserLogin, UserResponse
from app.models.domain_models import Users
from app.services.auth_service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    AuthService,
    SECRET_KEY,
)
from app.services.db import get_session

router = APIRouter(tags=["auth"])
security = HTTPBearer()
auth_service = AuthService()
db_dependency = Annotated[Session, Depends(get_session)]


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(status_code=401, detail="Token has expired") from exc
    except jwt.DecodeError as exc:
        raise HTTPException(status_code=401, detail="Could not validate credentials") from exc

    userid = payload.get("sub")
    if userid is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return userid


@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate, db: db_dependency) -> UserResponse:
    existing = db.execute(
        db.query(Users).where(Users.userid == user.userid)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    auth_service.register_user(db, user.userid, user.password)
    return UserResponse(userid=user.userid, message="User created successfully")


@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: db_dependency) -> Token:
    if not auth_service.authenticate_user(db, user.userid, user.password):
        raise HTTPException(status_code=401, detail="Incorrect userid or password")
    return auth_service.create_access_token(
        subject=user.userid,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

# you can use it by typing the token which you got from the login endpoint
@router.get("/protected", response_model=UserResponse)
async def protected_route(userid: str = Depends(verify_token)) -> UserResponse:
    return UserResponse(userid=userid, message=f"Hello {userid}! This is a protected route.")


@router.get("/users/me", response_model=UserResponse)
async def read_users_me(userid: str = Depends(verify_token)) -> UserResponse:
    return UserResponse(userid=userid, message=f"Current user: {userid}")
