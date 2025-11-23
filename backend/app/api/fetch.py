from fastapi import APIRouter, Depends
from app.services.fetch_service import sync_course_for_instructor
from app.api.dependencies import get_current_instructor

router = APIRouter()

@router.post("/courses/{course_id}/sync")
async def sync_course(course_id: int, instructor=Depends(get_current_instructor)):
    # Only present a lightweight controller
    job_id = await sync_course_for_instructor(course_id, instructor.user_id)
    return {"job_id": job_id, "status": "queued"}
