from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models import LeaderboardEntry, SubmitScoreRequest, SubmitScoreResponse, GameMode
from ..db import DatabaseService
from ..database import get_db

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None, db: Session = Depends(get_db)):
    db_service = DatabaseService(db)
    entries = db_service.get_leaderboard(mode)
    return [
        LeaderboardEntry(
            id=entry.id,
            username=entry.username,
            score=entry.score,
            mode=entry.mode,
            date=entry.date
        )
        for entry in entries
    ]


@router.post("", response_model=SubmitScoreResponse)
async def submit_score(request: SubmitScoreRequest, db: Session = Depends(get_db)):
    db_service = DatabaseService(db)
    
    # Use username from request (sent by frontend), fallback to 'Unknown'
    username = request.username or "Unknown"
    
    entry, rank = db_service.add_score(username, request.score, request.mode)
    return SubmitScoreResponse(success=True, rank=rank)

