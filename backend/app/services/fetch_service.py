from app.services.canvas_service import list_modules_for_course, list_module_items
from app.services.rag_service import ingest_documents_for_course

async def sync_course_for_instructor(course_id: int, instructor_user_id: str):
    # get instructor token
    token = TokenStore.get_token(instructor_user_id)
    modules = await list_modules_for_course(course_id, token)
    for m in modules:
        items = await list_module_items(course_id, m["id"], token)
        # transform and ingest
        await ingest_documents_for_course(course_id, m, items)
    return "done"  # in real app, return job id for background worker
