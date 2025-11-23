from app.services.db import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

# ─────────────────────────────────────────────
# USERS TABLE (already existed)
# ─────────────────────────────────────────────
class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    userid = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ─────────────────────────────────────────────
# STUDENT TABLE (new)
# ─────────────────────────────────────────────
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Optional relationship — not mandatory but nice to have
    scores = relationship("Score", back_populates="student")

# ─────────────────────────────────────────────
# SCORE TABLE (new)
# ─────────────────────────────────────────────
class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    module = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    completed = Column(Boolean, default=False)  # ← ADD THIS LINE
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="scores")

# ─────────────────────────────────────────────
# EXISTING STUDENT ACTIVITY TABLE
# ─────────────────────────────────────────────
class StudentActivity(Base):
    __tablename__ = "student_activity"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    module_id = Column(Integer, nullable=False)
    assignment_id = Column(Integer, nullable=True)
    score = Column(Float, nullable=True)
    completed = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
