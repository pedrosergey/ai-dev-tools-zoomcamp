import pytest
import tempfile
import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.models import Base
from app.database import get_db


@pytest.fixture
def temp_db():
    """Create a temporary SQLite database for testing."""
    # Create a temporary file for the database
    fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    
    db_url = f"sqlite:///{db_path}"
    
    # Create engine with SQLite-specific settings
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Enable foreign keys for SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session factory
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    yield engine, SessionLocal, db_path
    
    # Cleanup
    engine.dispose()
    if os.path.exists(db_path):
        os.unlink(db_path)


@pytest.fixture
def db_session(temp_db):
    """Provide a database session for a single test."""
    engine, SessionLocal, _ = temp_db
    session = SessionLocal()
    
    # Initialize sample data
    from app.models import UserModel, LeaderboardEntryModel, GameSessionModel, GameMode
    from datetime import date
    import hashlib
    import uuid
    
    # Add sample users
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
        session.add(user)
    
    session.commit()
    
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
        session.add(entry)
    
    session.commit()
    
    # Add sample sessions
    sample_sessions = [
        ("LivePlayer1", 340, GameMode.WALLS, True),
        ("StreamerPro", 520, GameMode.PASS_THROUGH, True),
    ]
    
    for username, score, mode, is_live in sample_sessions:
        sess = GameSessionModel(
            id=str(uuid.uuid4()),
            username=username,
            score=score,
            mode=mode,
            is_live=is_live
        )
        session.add(sess)
    
    session.commit()
    
    yield session
    
    session.close()


@pytest.fixture
def client(db_session):
    """Provide a test client with a database session override."""
    
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()
