from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..models import LoginRequest, SignupRequest, AuthResponse, User
from ..db import DatabaseService
from ..database import get_db
import hashlib

router = APIRouter(prefix="/auth", tags=["auth"])


def hash_password(password: str) -> str:
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    db_service = DatabaseService(db)
    user = db_service.get_user_by_email(request.email)
    
    if not user or user.password_hash != hash_password(request.password):
        return AuthResponse(success=False, error="Invalid email or password")
    
    return AuthResponse(
        success=True,
        user=User(id=user.id, username=user.username, email=user.email)
    )


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    db_service = DatabaseService(db)
    
    if db_service.get_user_by_email(request.email):
        return AuthResponse(success=False, error="Email already exists")
    
    if db_service.get_user_by_username(request.username):
        return AuthResponse(success=False, error="Username already taken")
    
    password_hash = hash_password(request.password)
    user = db_service.add_user(request.email, request.username, password_hash)
    
    return AuthResponse(
        success=True,
        user=User(id=user.id, username=user.username, email=user.email)
    )


@router.post("/logout")
async def logout():
    return {"message": "Logout successful"}


@router.get("/me", response_model=User)
async def get_current_user(db: Session = Depends(get_db)):
        # No user is authenticated by default
        # In a real app, we'd verify JWT tokens or session cookies here
        raise HTTPException(status_code=401, detail="Not authenticated")
