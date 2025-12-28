from fastapi import APIRouter, Query
from typing import List, Optional
from ..models import LeaderboardEntry, SubmitScoreRequest, SubmitScoreResponse, GameMode
from ..db import db

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[LeaderboardEntry])
async def get_leaderboard(mode: Optional[GameMode] = None):
    return db.get_leaderboard(mode)

@router.post("", response_model=SubmitScoreResponse)
async def submit_score(request: SubmitScoreRequest):
    # Mocking user context - assuming 'SnakeMaster' (id 1) is submitting
    # In real app, get user from auth context
    username = "SnakeMaster" 
    
    rank = db.add_score(username, request.score, request.mode)
    return SubmitScoreResponse(success=True, rank=rank)
