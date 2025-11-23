from app.utils.security import verify_hmac
from app.services.fetch_service import sync_course_for_instructor

def verify_and_process(body: bytes, signature: str):
    if not verify_hmac(body, signature):
        raise PermissionError("invalid signature")
    payload = json.loads(body)
    # map event -> action. E.g., module.updated -> sync that course
    course_id = payload.get("course_id")
    # enqueue background job instead of sync inline
    enqueue_job(sync_course_for_instructor, course_id, payload["user_id"])
    return True
