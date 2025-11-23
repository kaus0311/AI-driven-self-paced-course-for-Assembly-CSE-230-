from fastapi import APIRouter, Request, Header
from app.services.webhook_service import verify_and_process

router = APIRouter()

@router.post("/canvas")
async def canvas_webhook(request: Request, x_canvas_signature: str = Header(None)):
    body = await request.body()
    ok = verify_and_process(body, x_canvas_signature)
    return {"ok": ok}
