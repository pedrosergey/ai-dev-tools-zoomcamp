from fastapi import APIRouter, HTTPException, Depends
from ..models import LoginRequest, SignupRequest, AuthResponse, User
from ..db import db, MockDB

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    data = db.get_user_by_email(request.email)
    if not data or data["password"] != request.password:
        return AuthResponse(success=False, error="Invalid email or password")
    return AuthResponse(success=True, user=data["user"])

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    if db.get_user_by_email(request.email):
        return AuthResponse(success=False, error="Email already exists")
    
    if db.get_user_by_username(request.username):
        return AuthResponse(success=False, error="Username already taken")
    
    user = db.add_user(request.email, request.username, request.password)
    return AuthResponse(success=True, user=user)

@router.post("/logout")
async def logout():
    return {"message": "Logout successful"}

@router.get("/me", response_model=User)
async def get_current_user():
    # In a real app, we'd verify the session/token here.
    # For now, just return the first user as a mock authenticated user
    # or return 401 if we want to simulate logged out state (but we'll keep it simple for mock)
    # Actually, let's mock it properly by requiring a user_id via query or something if we really wanted,
    # but based on the API spec, it just returns the user. 
    # Let's return the first user to simulate "logged in" for testing purposes,
    # or handle it otherwise. The spec says 401 if not authenticated.
    # Since we don't have cookies/tokens, we can't really "know".
    # We'll just return a mock user (SnakeMaster) for now.
    user_data = db.get_user_by_email("player1@snake.io")
    if user_data:
         return user_data["user"]
    raise HTTPException(status_code=401, detail="Not authenticated")
