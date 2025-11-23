
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from app.api import auth, fetch, webhooks, ai, analytics, pushback, health
from app.api import auth, fetch, webhooks
from app.api import modules, assignments, submissions

app = FastAPI(title="Canvas AI Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(health.router, prefix="/")
app.include_router(auth.router, prefix="/auth")
app.include_router(fetch.router, prefix="/fetch")
app.include_router(webhooks.router, prefix="/webhooks")
#app.include_router(ai.router, prefix="/ai")
#app.include_router(analytics.router, prefix="/analytics")
#app.include_router(pushback.router, prefix="/pushback")
app.include_router(modules.router, prefix="/api")
app.include_router(assignments.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    from app.services.db import init_db
    print("Initializing database...")
    init_db()
    print("Database initialized successfully")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)