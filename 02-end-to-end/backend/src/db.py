from typing import Dict, List, Optional
from .models import User, LeaderboardEntry, GameSession, GameMode
from datetime import date

class MockDB:
    def __init__(self):
        self.users: Dict[str, dict] = {} # email -> {user: User, password: str}
        self.leaderboard: List[LeaderboardEntry] = []
        self.sessions: List[GameSession] = []
        self._init_data()

    def _init_data(self):
        # Mock users
        self.add_user("player1@snake.io", "SnakeMaster", "password123")
        self.add_user("player2@snake.io", "VenomStrike", "password123")
        
        # Mock leaderboard
        self.leaderboard.extend([
            LeaderboardEntry(id="1", username="SnakeMaster", score=2450, mode=GameMode.WALLS, date=date(2024, 1, 15)),
            LeaderboardEntry(id="2", username="VenomStrike", score=2100, mode=GameMode.PASS_THROUGH, date=date(2024, 1, 14)),
            LeaderboardEntry(id="3", username="CobraKing", score=1890, mode=GameMode.WALLS, date=date(2024, 1, 13)),
        ])

        # Mock sessions
        self.sessions.extend([
            GameSession(id="1", username="LivePlayer1", score=340, mode=GameMode.WALLS, isLive=True),
            GameSession(id="2", username="StreamerPro", score=520, mode=GameMode.PASS_THROUGH, isLive=True),
        ])

    def add_user(self, email, username, password) -> User:
        user_id = str(len(self.users) + 1)
        user = User(id=user_id, username=username, email=email)
        self.users[email] = {"user": user, "password": password}
        return user

    def get_user_by_email(self, email) -> Optional[dict]:
        return self.users.get(email)
    
    def get_user_by_username(self, username) -> Optional[dict]:
        for data in self.users.values():
            if data["user"].username == username:
                return data
        return None

    def add_score(self, username: str, score: int, mode: GameMode) -> int:
        entry = LeaderboardEntry(
            id=str(len(self.leaderboard) + 1),
            username=username,
            score=score,
            mode=mode,
            date=date.today()
        )
        self.leaderboard.append(entry)
        self.leaderboard.sort(key=lambda x: x.score, reverse=True)
        return self.leaderboard.index(entry) + 1

    def get_leaderboard(self, mode: Optional[GameMode] = None) -> List[LeaderboardEntry]:
        if mode:
            return [e for e in self.leaderboard if e.mode == mode]
        return self.leaderboard

db = MockDB()
