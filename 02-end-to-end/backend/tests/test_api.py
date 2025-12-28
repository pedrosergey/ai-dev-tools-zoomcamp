from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Snake Arena API"}

def test_auth_flow():
    # 1. Signup
    signup_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    }
    response = client.post("/auth/signup", json=signup_data)
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert response.json()["user"]["username"] == "testuser"

    # 2. Login
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    assert response.json()["success"] == True

    # 3. Failed login
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "wrong"})
    assert response.status_code == 200
    assert response.json()["success"] == False

def test_leaderboard():
    response = client.get("/leaderboard")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

    response = client.get("/leaderboard?mode=walls")
    assert response.status_code == 200
    assert all(entry["mode"] == "walls" for entry in response.json())

def test_submit_score():
    score_data = {
        "score": 1000,
        "mode": "walls"
    }
    response = client.post("/leaderboard", json=score_data)
    assert response.status_code == 200
    assert response.json()["success"] == True
    assert "rank" in response.json()

def test_sessions():
    response = client.get("/sessions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
