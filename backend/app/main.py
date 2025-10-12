import os
from fastapi import FastAPI, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from openai import OpenAI
from pydantic import BaseModel


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://app:app_password@db:5432/app")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
_openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

app = FastAPI(title="Capstone Backend")

# Allow frontend container to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/db-check")
def db_check() -> dict:
    try:
        with psycopg.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
                value = cur.fetchone()[0]
        return {"database": "ok", "result": int(value)}
    except Exception as exc:  # pragma: no cover
        return {"database": "error", "detail": str(exc)}


class TutorRequest(BaseModel):
    question: str
    context: str | None = None


class TutorResponse(BaseModel):
    answer: str


def _build_messages(request: TutorRequest) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [
        {
            "role": "system",
            "content": (
                "You are an expert assembly language tutor. Explain concepts clearly, "
                "mention key assembly instructions when relevant, and keep responses concise."
            ),
        }
    ]
    if request.context:
        messages.append(
            {
                "role": "user",
                "content": f"Context from learner: {request.context.strip()}",
            }
        )
    messages.append({"role": "user", "content": request.question.strip()})
    return messages


def _call_openai(request: TutorRequest) -> str:
    if not _openai_client:
        raise HTTPException(
            status_code=500,
            detail="OpenAI client is not configured. Set OPENAI_API_KEY environment variable.",
        )
    messages = _build_messages(request)
    try:
        if hasattr(_openai_client, "responses"):
            response = _openai_client.responses.create(
                model=OPENAI_MODEL,
                input=messages,
                max_output_tokens=600,
            )
            text = getattr(response, "output_text", None)
        else:
            response = _openai_client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=messages,
                max_tokens=600,
            )
            choice = response.choices[0] if response.choices else None
            text = choice.message.content if choice and choice.message else ""
    except Exception as exc:  # pragma: no cover - upstream client errors
        raise HTTPException(status_code=502, detail=f"OpenAI error: {exc}") from exc
    return (text or "").strip()


@app.post("/tutor", response_model=TutorResponse)
async def tutor(request: TutorRequest) -> TutorResponse:
    answer = await run_in_threadpool(_call_openai, request)
    if not answer:
        raise HTTPException(status_code=502, detail="OpenAI returned an empty response.")
    return TutorResponse(answer=answer)

