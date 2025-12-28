from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum
from datetime import date

class GameMode(str, Enum):
    WALLS = "walls"
    PASS_THROUGH = "pass-through"

class User(BaseModel):
    id: str
    username: str
    email: EmailStr

class AuthResponse(BaseModel):
    success: bool
    user: Optional[User] = None
    error: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class LeaderboardEntry(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    date: date

class SubmitScoreRequest(BaseModel):
    score: int
    mode: GameMode

class SubmitScoreResponse(BaseModel):
    success: bool
    rank: Optional[int] = None

class GameSession(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    isLive: bool
