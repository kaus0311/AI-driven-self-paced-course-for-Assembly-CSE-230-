
from app.services.db import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key =True, index=True)
    userid = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StudentActivity(Base):
    __tablename__ = "student_activity"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    module_id = Column(Integer, nullable=False)
    assignment_id = Column(Integer, nullable=True)
    score = Column(Float, nullable=True)
    completed = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())