from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.services.db import get_db
from app.services.auth_service import get_user_from_session, is_instructor
from app.models.domain_models import Module, Course, User
from app.models.request_models import (
    ModuleCreate, ModuleUpdate, ModuleResponse, ModuleWithAssignments
)

router = APIRouter(tags=["modules"])


def get_current_user(session_token: str = "dummy", db: Session = Depends(get_db)) -> User:
    """Get current user (for test)"""
    # test: return the first instructor
    from app.models.domain_models import UserRole
    user = db.query(User).filter(User.role == UserRole.INSTRUCTOR).first()
    if not user:
        # create if there's no user
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


@router.post("/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
def create_module(
    module: ModuleCreate,
    session_token: str = "dummy",
    db: Session = Depends(get_db)
):
    """
    Create Module (for instructor)
    """
    user = get_current_user(session_token, db)
    
    # allow for only instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can create modules"
        )
    
    # check if the course exists
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # check if the user created the course
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create modules for your own courses"
        )
    
    # create module
    db_module = Module(
        course_id=module.course_id,
        title=module.title,
        description=module.description,
        order=module.order
    )
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    
    return db_module


@router.get("/modules/{module_id}", response_model=ModuleWithAssignments)
def get_module(
    module_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    get module details (includes assignment lists)
    """
    user = get_current_user(session_token, db)
    
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    return module


@router.get("/courses/{course_id}/modules", response_model=List[ModuleResponse])
def get_course_modules(
    course_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    get module all course
    """
    user = get_current_user(session_token, db)
    
    # check if the course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # get module（in order）
    modules = db.query(Module).filter(
        Module.course_id == course_id
    ).order_by(Module.order).all()
    
    return modules


@router.put("/modules/{module_id}", response_model=ModuleResponse)
def update_module(
    module_id: int,
    module_update: ModuleUpdate,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    update module (only instructor)
    """
    user = get_current_user(session_token, db)
    
    # allow for only instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can update modules"
        )
    
    # get module
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # check if the user created the course
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update modules for your own courses"
        )
    
    # update
    if module_update.title is not None:
        module.title = module_update.title
    if module_update.description is not None:
        module.description = module_update.description
    if module_update.order is not None:
        module.order = module_update.order
    
    db.commit()
    db.refresh(module)
    
    return module


@router.delete("/modules/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_module(
    module_id: int,
    session_token: str,
    db: Session = Depends(get_db)
):
    """
    delete module (for instructor)
    """
    user = get_current_user(session_token, db)
    
    # allow for only instructor
    if not is_instructor(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only instructors can delete modules"
        )
    
    # get module
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )
    
    # check if the user created the course
    course = db.query(Course).filter(Course.id == module.course_id).first()
    if course.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete modules for your own courses"
        )
    
    # delete
    db.delete(module)
    db.commit()
    
    return None