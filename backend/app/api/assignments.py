from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.services.db import get_db
from app.services.auth_service import get_user_from_session, is_instructor
from app.services.notification_service import notify_assignment_created, send_in_app_notification
from app.models.domain_models import Assignment, Module, Course, User
from app.models.request_models import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse, AssignmentWithSubmissions
)

router = APIRouter(tags=["assignments"])


def get_current_user(session_token: str = "dummy", db: Session = Depends(get_db)) -> User:
    """get current user (testing)"""
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
    return user


@router.post("/assignments", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment: AssignmentCreate,
    session_token: str = "dummy",
    db: Session = Depends(get_db)
):
    """
    Create an Assignment (only instructor)
    """
    user = get_current_user(session_token, db)
    
    # allow only for instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can create assignments"
        )
    
    # module exist or not
    module = db.query(Module).filter(Module.id == assignment.module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # check if this user created the course or not
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create assignments for your own courses"
        )
    
    # Createing Assignmet
    db_assignment = Assignment(
        module_id=assignment.module_id,
        title=assignment.title,
        instructions=assignment.instructions,
        deadline=assignment.deadline,
        max_points=assignment.max_points,
        allow_file_upload=assignment.allow_file_upload,
        allow_text_submission=assignment.allow_text_submission,
        allow_coding_exercise=assignment.allow_coding_exercise
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    
    # TODO: send notification to all studnent(need student list)
    # in-app notification
    print(f"Assignment created: {db_assignment.title}")
    
    return db_assignment


@router.get("/assignments/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(
    assignment_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    Get the assignment details
    """
    user = get_current_user(session_token, db)
    
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    return assignment


@router.get("/assignments/{assignment_id}/with-submissions", response_model=AssignmentWithSubmissions)
def get_assignment_with_submissions(
    assignment_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    Get  assignment details and submission list (for instructor)
    """
    user = get_current_user(session_token, db)
    
    # allow only for instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can view submissions"
        )
    
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # check if the user created the course
    module = db.query(Module).filter(Module.id == assignment.module_id).first()
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view submissions for your own courses"
        )
    
    return assignment


@router.get("/modules/{module_id}/assignments", response_model=List[AssignmentResponse])
def get_module_assignments(
    module_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    Get all assignment in the module
    """
    user = get_current_user(session_token, db)
    
    # check if the module exist
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # Get assignment
    assignments = db.query(Assignment).filter(
        Assignment.module_id == module_id
    ).order_by(Assignment.deadline).all()
    
    return assignments


@router.put("/assignments/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    assignment_update: AssignmentUpdate,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    Update assignment (for instructor)
    """
    user = get_current_user(session_token, db)
    
    # only instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can update assignments"
        )
    
    # Get assignment
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # check if the user created the course
    module = db.query(Module).filter(Module.id == assignment.module_id).first()
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update assignments for your own courses"
        )
    
    # Update
    if assignment_update.title is not None:
        assignment.title = assignment_update.title
    if assignment_update.instructions is not None:
        assignment.instructions = assignment_update.instructions
    if assignment_update.deadline is not None:
        assignment.deadline = assignment_update.deadline
    if assignment_update.max_points is not None:
        assignment.max_points = assignment_update.max_points
    if assignment_update.allow_file_upload is not None:
        assignment.allow_file_upload = assignment_update.allow_file_upload
    if assignment_update.allow_text_submission is not None:
        assignment.allow_text_submission = assignment_update.allow_text_submission
    if assignment_update.allow_coding_exercise is not None:
        assignment.allow_coding_exercise = assignment_update.allow_coding_exercise
    
    db.commit()
    db.refresh(assignment)
    
    return assignment


@router.delete("/assignments/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    assignment_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    Delete assignment(for instructor)
    """
    user = get_current_user(session_token, db)
    
    # allow only for instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can delete assignments"
        )
    
    # Get assignment
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    # check if the user created the course
    module = db.query(Module).filter(Module.id == assignment.module_id).first()
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete assignments for your own courses"
        )
    
    # delete
    db.delete(assignment)
    db.commit()
    
    return None