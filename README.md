# Capstone (just checking)

Monorepo with Next.js frontend, FastAPI backend, and PostgreSQL (pgvector). Docker Compose runs everything with one command.

## Quick Start

Prereqs: Docker, Docker Compose

```bash
docker compose up --build
```

Open `http://localhost:3000` for the frontend.
Backend health: `http://localhost:8000/health`
DB runs on `localhost:5432` (user: `app`, password: `app_password`, db: `app`).

## Structure

- `frontend/`: Next.js 14 + Tailwind
- `backend/`: FastAPI + psycopg
- `db/`: init scripts (pgvector)

## Acceptance Criteria

- Single command to run stack: `docker compose up`
- Frontend and backend communicate (frontend calls `backend:8000` via env)
- Database connection succeeds (`/db-check` returns ok)

## Test Scenarios

New developer onboarding
1. Clone repo
2. Run `docker compose up --build`
3. Visit `http://localhost:3000` and `http://localhost:8000/health`

Expected: all services start without errors; Next.js page loads; `/health` returns ok.

## Branching Strategy (GitFlow-lite)

- `main`: stable releases
- `develop`: integration branch
- Feature branches: `feature/<name>` → PR into `develop`
- Release branches: `release/<version>` → merge to `main` and `develop`
- Hotfix branches: `hotfix/<name>` → PR into `main` and `develop`

## Local Development (without Docker)

Frontend:
```bash
cd frontend && npm install && npm run dev
```

Backend:
```bash
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

