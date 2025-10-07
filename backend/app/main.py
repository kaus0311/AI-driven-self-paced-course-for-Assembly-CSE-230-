import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg


DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://app:app_password@db:5432/app")

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


