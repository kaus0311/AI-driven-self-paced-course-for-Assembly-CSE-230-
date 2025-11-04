from app.services.db import Base
from sqlalchemy import Column, Integer, String, DateTime, func

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key =True, index=True)
    userid = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())