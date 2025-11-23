<<<<<<< HEAD
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()


class UserRole(enum.Enum):
    """User role"""
    INSTRUCTOR = "instructor"
    STUDENT = "student"


from app.models.request_models import SubmissionStatusEnum


class User(Base):
    """User Model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation
    created_courses = relationship("Course", back_populates="instructor")
    submissions = relationship("Submission", back_populates="student")


class Course(Base):
    """Course model"""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation
    instructor = relationship("User", back_populates="created_courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")


class Module(Base):
    """module model"""
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation
    course = relationship("Course", back_populates="modules")
    assignments = relationship("Assignment", back_populates="module", cascade="all, delete-orphan")


class Assignment(Base):
    """Assignment model"""
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    title = Column(String, nullable=False)
    instructions = Column(Text, nullable=False)
    deadline = Column(DateTime, nullable=False)
    max_points = Column(Integer, default=100)
    allow_file_upload = Column(Boolean, default=True)
    allow_text_submission = Column(Boolean, default=True)
    allow_coding_exercise = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation
    module = relationship("Module", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")


class Submission(Base):
    """Submission model"""
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submission_text = Column(Text)
    file_path = Column(String)
    file_name = Column(String)
    status = Column(String, default="pending")
    #status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING)
    grade = Column(Integer)
    feedback = Column(Text)
    submitted_at = Column(DateTime)
    graded_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relation
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")
=======
from app.services.db import Base
from sqlalchemy import Column, Integer, String, DateTime, func

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key =True, index=True)
    userid = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
>>>>>>> f59db2e46bb1cab0426c03bc8c1e4a4aa66c723d
