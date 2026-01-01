from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from ..models import GameSession
from ..db import DatabaseService
from ..database import get_db

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("", response_model=List[GameSession])
async def get_sessions(db: Session = Depends(get_db)):
    db_service = DatabaseService(db)
    sessions = db_service.get_live_sessions()
    return [
        GameSession(
            id=session.id,
            username=session.username,
            score=session.score,
            mode=session.mode,
            isLive=session.is_live
        )
        for session in sessions
    ]


@router.get("/{id}", response_model=GameSession)
async def get_session(id: str, db: Session = Depends(get_db)):
    db_service = DatabaseService(db)
    session = db_service.get_session_by_id(id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return GameSession(
        id=session.id,
        username=session.username,
        score=session.score,
        mode=session.mode,
        isLive=session.is_live
    )
