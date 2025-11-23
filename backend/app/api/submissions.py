from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import shutil
from pathlib import Path
from app.services.db import get_db
from app.services.auth_service import get_user_from_session, is_instructor, is_student
from app.services.notification_service import notify_submission_graded, send_in_app_notification
from app.models.domain_models import Submission, Assignment, Module, Course, User
from app.models.request_models import (
    SubmissionResponse, GradeSubmission
)

router = APIRouter(tags=["submissions"])

# save file directory
UPLOAD_DIR = Path("backend/submissions")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# allow file extension
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def get_current_user(session_token: str = "dummy", db: Session = Depends(get_db)) -> User:
    """Get current user"""
    from app.models.domain_models import UserRole

    user = db.query(User).filter(User.role == UserRole.STUDENT).first()
    if not user:
        from app.services.auth_service import hash_password
        user = User(
            email="student@test.com",
            username="test_student",
            hashed_password=hash_password("test123"),
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def validate_file(file: UploadFile) -> bool:
    """file validation"""
    # check extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return True


@router.post("/submissions", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    assignment_id: int = Form(...),
    session_token: str = Form(...),
    submission_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Submit assignment (for student)
    """
    user = get_current_user(session_token, db)
    
    # allow for only student
    if not is_student(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit assignments"
        )
    
    # check if the assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # check the deadline
    if datetime.utcnow() > assignment.deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment deadline has passed"
        )
    
    # check if there's submission already
    existing_submission = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == user.id
    ).first()
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted this assignment"
        )
    
    # handle file
    file_path = None
    file_name = None
    if file:
        validate_file(file)
        
        # create the file name (userID_assignmentID_original file name)
        file_ext = Path(file.filename).suffix
        file_name = file.filename
        safe_filename = f"{user.id}_{assignment_id}_{file.filename}"
        file_path = UPLOAD_DIR / safe_filename
        
        # save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        file_path = str(file_path)
    
    # create submission
    db_submission = Submission(
        assignment_id=assignment_id,
        student_id=user.id,
        submission_text=submission_text,
        file_path=file_path,
        file_name=file_name,
        status="submitted",
        #status=SubmissionStatus.SUBMITTED,
        submitted_at=datetime.utcnow()
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # in-app notification
    send_in_app_notification(
        user.id,
        "Submission Completed",
        f"Assignment「{assignment.title}」 submitted.",
        "success"
    )
    
    return db_submission


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: int,
    session_token: str = "dummy",
    db: Session = Depends(get_db)
):
    """
    Get the assignment details
    """
    from app.models.domain_models import UserRole
    user = db.query(User).filter(User.role == UserRole.STUDENT).first()
    if not user:
        from app.services.auth_service import hash_password
        user = User(
            email="student@test.com",
            username="test_student",
            hashed_password=hash_password("test123"),
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    #user = get_current_user(session_token, db)
    
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # watch their own submission if it's student
    if is_student(user) and submission.student_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own submissions"
        )
    
    # check the instructor has the owenership of the course
    if is_instructor(user):
        assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
        module = db.query(Module).filter(Module.id == assignment.module_id).first()
        course = db.query(Course).filter(Course.id == module.course_id).first()
        if course.instructor_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view submissions for your own courses"
            )
    
    return submission


@router.get("/assignments/{assignment_id}/submissions", response_model=List[SubmissionResponse])
def get_assignment_submissions(
    assignment_id: int,
    session_token: str = "dummy",
    db: Session = Depends(get_db)
):
    """
    Get all submission of assignment (only instructor)
    """
    from app.models.domain_models import UserRole
    user = db.query(User).filter(User.role == UserRole.INSTRUCTOR).first()
    if not user:
        from app.services.auth_service import hash_password
        user = User(
            email="test@test.com",
            username="test_instructor",
            hashed_password=hash_password("test123"),
            role=UserRole.INSTRUCTOR
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        #user = get_current_user(session_token, db)
    
    # allow for only instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can view all submissions"
        )
    
    # check if the assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # check if user created the course
    module = db.query(Module).filter(Module.id == assignment.module_id).first()
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view submissions for your own courses"
        )
    
    # Get submissions
    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id
    ).order_by(Submission.submitted_at.desc()).all()
    
    return submissions


@router.get("/my-submissions", response_model=List[SubmissionResponse])
def get_my_submissions(
    session_token: str = "dummy",
    db: Session = Depends(get_db)
):
    """
    Get all submissions (for student)
    """
    user = get_current_user(session_token, db)
    
    # allow for only student
    if not is_student(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for students only"
        )
    
    # Get submissions
    submissions = db.query(Submission).filter(
        Submission.student_id == user.id
    ).order_by(Submission.submitted_at.desc()).all()
    
    return submissions


@router.post("/submissions/{submission_id}/grade", response_model=SubmissionResponse)
def grade_submission(
    submission_id: int,
    grade_data: GradeSubmission,
    session_token: str = "dummy",
    db: Session = Depends(get_db)
):
    """
    Grade the submissions (for instructor)
    """
    user = get_current_user(session_token, db)

    from app.models.domain_models import UserRole
    user = db.query(User).filter(User.role == UserRole.INSTRUCTOR).first()
    if not user:
        from app.services.auth_service import hash_password
        user = User(
            email="test@test.com",
            username="test_instructor",
            hashed_password=hash_password("test123"),
            role=UserRole.INSTRUCTOR
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # allow for only instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can grade submissions"
        )
    
    # Get submissions
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # check if user created the course
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    module = db.query(Module).filter(Module.id == assignment.module_id).first()
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only grade submissions for your own courses"
        )
    
    # score validation
    if grade_data.grade < 0 or grade_data.grade > assignment.max_points:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Grade must be between 0 and {assignment.max_points}"
        )
    
    # Grade
    submission.grade = grade_data.grade
    submission.feedback = grade_data.feedback
    #submission.status = SubmissionStatus.GRADED
    submission.status = "graded"
    submission.graded_at = datetime.utcnow()
    
    db.commit()
    db.refresh(submission)
    
    # imform student
    student = db.query(User).filter(User.id == submission.student_id).first()
    send_in_app_notification(
        student.id,
        "Assignment is graded.",
        f"Assignment '{assignment.title}'is graded. Score: {grade_data.grade}/{assignment.max_points}",
        "info"
    )
    
    # Email notification
    # notify_submission_graded(student.email, assignment.title, grade_data.grade, grade_data.feedback)
    
    return submission


@router.put("/submissions/{submission_id}", response_model=SubmissionResponse)
async def update_submission(
    submission_id: int,
    session_token: str = Form(...),
    submission_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    update the submission (for student, only before the deadline)
    """
    user = get_current_user(session_token, db)
    
    # allow for only student
    if not is_student(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can update submissions"
        )
    
    # Get submissions
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # check if student's submission 
    if submission.student_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own submissions"
        )
    
    # check the assignment deadline
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if datetime.utcnow() > assignment.deadline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update submission after deadline"
        )
    
    # no update if it's graded
    if submission.status == "graded":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update graded submission"
        )
    
    # text update
    if submission_text is not None:
        submission.submission_text = submission_text
    
    # file update
    if file:
        validate_file(file)
        
        # delete old file
        if submission.file_path and os.path.exists(submission.file_path):
            try:
                os.remove(submission.file_path)
            except Exception as e:
                print(f"Failed to delete old file: {str(e)}")
        
        # save new file
        file_ext = Path(file.filename).suffix
        file_name = file.filename
        safe_filename = f"{user.id}_{assignment.id}_{file.filename}"
        file_path = UPLOAD_DIR / safe_filename
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        submission.file_path = str(file_path)
        submission.file_name = file_name
    
    db.commit()
    db.refresh(submission)
    
    return submission