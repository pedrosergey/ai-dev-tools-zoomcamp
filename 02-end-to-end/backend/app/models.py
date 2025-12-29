from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum
from datetime import date
from sqlalchemy import Column, String, Integer, Boolean, Enum as SQLEnum, Date
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class GameMode(str, Enum):
    WALLS = "walls"
    PASS_THROUGH = "pass-through"


# SQLAlchemy ORM Models
class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)


class LeaderboardEntryModel(Base):
    __tablename__ = "leaderboard_entries"
    
    id = Column(String, primary_key=True)
    username = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameMode), nullable=False)
    date = Column(Date, nullable=False)


class GameSessionModel(Base):
    __tablename__ = "game_sessions"
    
    id = Column(String, primary_key=True)
    username = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    mode = Column(SQLEnum(GameMode), nullable=False)
    is_live = Column(Boolean, default=False, nullable=False)


# Pydantic models for API requests/responses
class User(BaseModel):
    id: str
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


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

    class Config:
        from_attributes = True


class SubmitScoreRequest(BaseModel):
    score: int
    mode: GameMode
    username: Optional[str] = None


class SubmitScoreResponse(BaseModel):
    success: bool
    rank: Optional[int] = None


class GameSession(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    isLive: bool

    class Config:
        from_attributes = True
