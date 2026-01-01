# Deploying Snake Game to Render

This copy is prepared for Render with a Dockerized FastAPI backend and a static Vite frontend.

## What Render will create
- **PostgreSQL database** (`snake-game-db`, free plan) — connection string injected as `DATABASE_URL`.
- **Backend web service** (`snake-game-backend`) — built from `backend/Dockerfile`, listens on Render's `$PORT` and auto-creates tables on startup via SQLAlchemy `create_all`.
- **Frontend static site** (`snake-game-frontend`) — built from `frontend/` and served from `frontend/dist`.

## Deploy steps
1) **Push this folder to a new repo** (e.g., `snake-game-perro`).
2) In Render, choose **Blueprint Deploy** and point to the repo. Render will read `render.yaml` and provision the DB + services.
3) Wait for `snake-game-backend` to finish its first deploy. On startup it runs `init_db()` which calls `create_all`, so the fresh database gets all tables automatically.
4) Grab the backend URL from Render (e.g., `https://snake-game-backend.onrender.com`). In Render, open the `snake-game-frontend` service and set the env var `VITE_API_BASE_URL` to that URL (without the `/api` suffix). Redeploy the frontend.
5) Visit the frontend URL and play. API docs live at `<backend-url>/docs`.

## Local smoke test (optional)
```bash
cd backend
uv sync --frozen
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
# in another shell
cd ../frontend
npm install
npm run dev
```

## Notes
- CORS is permissive by default; tighten `allow_origins` in `backend/app/main.py` for production domains.
- Database credentials are managed by Render; no `.env` file is required there.
- If you destroy the Render database, the backend will recreate tables on next startup.
