from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import uuid
from .models import (
    UserModel, LeaderboardEntryModel, GameSessionModel, GameMode
)


class DatabaseService:
    """Service layer for database operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    # User operations
    def add_user(self, email: str, username: str, password_hash: str) -> UserModel:
        """Add a new user to the database."""
        user_id = str(uuid.uuid4())
        user = UserModel(
            id=user_id,
            username=username,
            email=email,
            password_hash=password_hash
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user_by_email(self, email: str) -> Optional[UserModel]:
        """Retrieve user by email."""
        return self.db.query(UserModel).filter(UserModel.email == email).first()
    
    def get_user_by_username(self, username: str) -> Optional[UserModel]:
        """Retrieve user by username."""
        return self.db.query(UserModel).filter(UserModel.username == username).first()
    
    def get_user_by_id(self, user_id: str) -> Optional[UserModel]:
        """Retrieve user by ID."""
        return self.db.query(UserModel).filter(UserModel.id == user_id).first()
    
    # Leaderboard operations
    def add_score(
        self, username: str, score: int, mode: GameMode
    ) -> tuple[LeaderboardEntryModel, int]:
        """
        Add a score to the leaderboard and return the entry with its rank.
        Returns: (LeaderboardEntryModel, rank)
        """
        entry_id = str(uuid.uuid4())
        entry = LeaderboardEntryModel(
            id=entry_id,
            username=username,
            score=score,
            mode=mode,
            date=date.today()
        )
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        
        # Calculate rank
        rank = self.db.query(func.count(LeaderboardEntryModel.id)).filter(
            LeaderboardEntryModel.score > score,
            LeaderboardEntryModel.mode == mode
        ).scalar() + 1
        
        return entry, rank
    
    def get_leaderboard(
        self, mode: Optional[GameMode] = None, limit: int = 100
    ) -> List[LeaderboardEntryModel]:
        """Get leaderboard entries, optionally filtered by game mode."""
        query = self.db.query(LeaderboardEntryModel).order_by(
            LeaderboardEntryModel.score.desc()
        )
        if mode:
            query = query.filter(LeaderboardEntryModel.mode == mode)
        return query.limit(limit).all()
    
    def get_user_leaderboard_position(
        self, username: str, mode: Optional[GameMode] = None
    ) -> Optional[int]:
        """Get user's rank in leaderboard."""
        query = self.db.query(LeaderboardEntryModel).filter(
            LeaderboardEntryModel.username == username
        )
        if mode:
            query = query.filter(LeaderboardEntryModel.mode == mode)
        
        entry = query.order_by(LeaderboardEntryModel.score.desc()).first()
        if not entry:
            return None
        
        rank = self.db.query(func.count(LeaderboardEntryModel.id)).filter(
            LeaderboardEntryModel.score > entry.score
        ).scalar() + 1
        
        return rank
    
    # Game session operations
    def create_session(
        self, username: str, score: int, mode: GameMode, is_live: bool = False
    ) -> GameSessionModel:
        """Create a new game session."""
        session_id = str(uuid.uuid4())
        session = GameSessionModel(
            id=session_id,
            username=username,
            score=score,
            mode=mode,
            is_live=is_live
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session
    
    def get_live_sessions(self) -> List[GameSessionModel]:
        """Get all live game sessions."""
        return self.db.query(GameSessionModel).filter(
            GameSessionModel.is_live == True
        ).all()
    
    def get_session_by_id(self, session_id: str) -> Optional[GameSessionModel]:
        """Retrieve a game session by ID."""
        return self.db.query(GameSessionModel).filter(
            GameSessionModel.id == session_id
        ).first()
    
    def update_session(
        self, session_id: str, score: int, is_live: bool
    ) -> Optional[GameSessionModel]:
        """Update a game session."""
        session = self.get_session_by_id(session_id)
        if session:
            session.score = score
            session.is_live = is_live
            self.db.commit()
            self.db.refresh(session)
        return session
    
    def close_session(self, session_id: str) -> Optional[GameSessionModel]:
        """Close a game session."""
        session = self.get_session_by_id(session_id)
        if session:
            session.is_live = False
            self.db.commit()
            self.db.refresh(session)
        return session
    
    def get_sessions_by_username(self, username: str) -> List[GameSessionModel]:
        """Get all sessions for a user."""
        return self.db.query(GameSessionModel).filter(
            GameSessionModel.username == username
        ).all()
