from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["System"])
def get_health():
    return {"status": "ok"}
