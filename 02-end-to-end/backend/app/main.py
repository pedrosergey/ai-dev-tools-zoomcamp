from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, leaderboard, sessions

app = FastAPI(
    title="Snake Arena API",
    description="Backend API for Snake Arena",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(leaderboard.router)
app.include_router(sessions.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Snake Arena API"}
