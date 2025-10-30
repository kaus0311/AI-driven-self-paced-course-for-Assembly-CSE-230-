
from fastapi import FastAPI
from app.api import auth, fetch, webhooks, ai, analytics, pushback, health

app = FastAPI(title="Canvas AI Tutor")

app.include_router(health.router, prefix="/")
app.include_router(auth.router, prefix="/auth")
app.include_router(fetch.router, prefix="/fetch")
app.include_router(webhooks.router, prefix="/webhooks")
app.include_router(ai.router, prefix="/ai")
app.include_router(analytics.router, prefix="/analytics")
app.include_router(pushback.router, prefix="/pushback")
