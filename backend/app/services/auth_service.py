<<<<<<< HEAD
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.domain_models import User, UserRole
from typing import Optional
import secrets

# setting password hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# dictionary to manage session
active_sessions = {}


def hash_password(password: str) -> str:
    """hash password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """test password"""
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    user validation
    
    Args:
        db: database session
        username: username
        password: password
    
    Returns:
        User object when validation success, None when it's falied
    """
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_session(user_id: int) -> str:
    """
    create session
    
    Args:
        user_id: userID
    
    Returns:
        SessionToken
    """
    session_token = secrets.token_urlsafe(32)
    active_sessions[session_token] = user_id
    return session_token


def get_user_from_session(session_token: str, db: Session) -> Optional[User]:
    """
    get user from SessionToken
    
    Args:
        session_token: SessionToken
        db: database session
    
    Returns:
        User object, None when it doesn't exist
    """
    user_id = active_sessions.get(session_token)
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id).first()


def delete_session(session_token: str):
    """
    delete session (log out)
    
    Args:
        session_token: SessionToken
    """
    if session_token in active_sessions:
        del active_sessions[session_token]


def create_user(db: Session, email: str, username: str, password: str, role: UserRole) -> User:
    """
    Create new user
    
    Args:
        db: database session
        email: email address
        username: username
        password: password
        role: user role
    
    Returns:
        created user object
    """
    hashed_password = hash_password(password)
    user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def is_instructor(user: User) -> bool:
    """check if user is instructor"""
    return user.role == UserRole.INSTRUCTOR


def is_student(user: User) -> bool:
    """check if user is student"""
    return user.role == UserRole.STUDENT
=======
from datetime import datetime, timedelta
from typing import Optional

import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.domain_models import Users
from app.models.request_models import Token


SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class AuthService:
    def __init__(self, pwd_context: CryptContext | None = None) -> None:
        self.pwd_context = pwd_context or CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(
        self, subject: str, expires_delta: Optional[timedelta] = None
    ) -> Token:
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
        payload = {"sub": subject, "exp": expire}
        encoded = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return Token(access_token=encoded)

    def register_user(self, db: Session, userid: str, password: str) -> None:
        user = Users(userid=userid, hashed_password=self.hash_password(password))
        db.add(user)
        db.commit()

    def authenticate_user(self, db: Session, userid: str, password: str) -> bool:
        user: Users | None = (
            db.query(Users)
            .where(Users.userid == userid)
            .one_or_none()
        )
        if not user:
            return False
        return self.verify_password(password, user.hashed_password)
>>>>>>> f59db2e46bb1cab0426c03bc8c1e4a4aa66c723d
