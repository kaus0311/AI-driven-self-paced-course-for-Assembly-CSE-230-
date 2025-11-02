from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.analytics_service import (
    get_average_scores,
    get_completion_rates,
    get_top_and_bottom_students
)
from app.services.db import get_session

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/averages")
def analytics_average_scores(db: Session = Depends(get_session)):
    return get_average_scores(db)

@router.get("/completion")
def analytics_completion_rates(db: Session = Depends(get_session)):
    return get_completion_rates(db)

@router.get("/leaders")
def analytics_top_bottom(db: Session = Depends(get_session)):
    return get_top_and_bottom_students(db)
