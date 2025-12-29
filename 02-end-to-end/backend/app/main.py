from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import auth, leaderboard, sessions
from .db import DatabaseService
from .models import GameMode
from datetime import date

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

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()
    _init_sample_data()


def _init_sample_data():
    """Initialize sample data if database is empty."""
    from .database import SessionLocal
    from .models import UserModel, LeaderboardEntryModel, GameSessionModel
    
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(UserModel).first() is not None:
            return
        
        # Add sample users
        import hashlib
        import uuid
        sample_users = [
            ("player1@snake.io", "SnakeMaster", "password123"),
            ("player2@snake.io", "VenomStrike", "password123"),
        ]
        
        for email, username, password in sample_users:
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            user = UserModel(
                id=str(uuid.uuid4()),
                username=username,
                email=email,
                password_hash=password_hash
            )
            db.add(user)
        
        db.commit()
        
        # Add sample leaderboard entries
        sample_entries = [
            ("SnakeMaster", 2450, GameMode.WALLS, date(2024, 1, 15)),
            ("VenomStrike", 2100, GameMode.PASS_THROUGH, date(2024, 1, 14)),
            ("CobraKing", 1890, GameMode.WALLS, date(2024, 1, 13)),
        ]
        
        for username, score, mode, entry_date in sample_entries:
            entry = LeaderboardEntryModel(
                id=str(uuid.uuid4()),
                username=username,
                score=score,
                mode=mode,
                date=entry_date
            )
            db.add(entry)
        
        db.commit()
        
        # Add sample sessions
        sample_sessions = [
            ("LivePlayer1", 340, GameMode.WALLS, True),
            ("StreamerPro", 520, GameMode.PASS_THROUGH, True),
        ]
        
        for username, score, mode, is_live in sample_sessions:
            session = GameSessionModel(
                id=str(uuid.uuid4()),
                username=username,
                score=score,
                mode=mode,
                is_live=is_live
            )
            db.add(session)
        
        db.commit()
    finally:
        db.close()


app.include_router(auth.router)
app.include_router(leaderboard.router)
app.include_router(sessions.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Snake Arena API"}
