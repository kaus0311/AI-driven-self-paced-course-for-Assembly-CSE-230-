<<<<<<< HEAD
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class UserRoleEnum(str, Enum):
    INSTRUCTOR = "instructor"
    STUDENT = "student"


class SubmissionStatusEnum(str, Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    GRADED = "graded"


# User Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    role: UserRoleEnum


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Course Models
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int
    instructor_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Module Models
class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int = 0


class ModuleCreate(ModuleBase):
    course_id: int


class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class ModuleResponse(ModuleBase):
    id: int
    course_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Assignment Models
class AssignmentBase(BaseModel):
    title: str
    instructions: str
    deadline: datetime
    max_points: int = 100
    allow_file_upload: bool = True
    allow_text_submission: bool = True
    allow_coding_exercise: bool = False


class AssignmentCreate(AssignmentBase):
    module_id: int


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    instructions: Optional[str] = None
    deadline: Optional[datetime] = None
    max_points: Optional[int] = None
    allow_file_upload: Optional[bool] = None
    allow_text_submission: Optional[bool] = None
    allow_coding_exercise: Optional[bool] = None


class AssignmentResponse(AssignmentBase):
    id: int
    module_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Submission Models
class SubmissionBase(BaseModel):
    submission_text: Optional[str] = None


class SubmissionCreate(SubmissionBase):
    assignment_id: int


class SubmissionUpdate(BaseModel):
    submission_text: Optional[str] = None


class GradeSubmission(BaseModel):
    grade: int
    feedback: Optional[str] = None


class SubmissionResponse(SubmissionBase):
    id: int
    assignment_id: int
    student_id: int
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    status: SubmissionStatusEnum
    grade: Optional[int] = None
    feedback: Optional[str] = None
    submitted_at: Optional[datetime] = None
    graded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Module with Assignments
class ModuleWithAssignments(ModuleResponse):
    assignments: List[AssignmentResponse] = []


# Assignment with Submissions (for instructors)
class AssignmentWithSubmissions(AssignmentResponse):
    submissions: List[SubmissionResponse] = []
=======
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    userid: str
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    userid: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    userid: str
    message: str
>>>>>>> f59db2e46bb1cab0426c03bc8c1e4a4aa66c723d
