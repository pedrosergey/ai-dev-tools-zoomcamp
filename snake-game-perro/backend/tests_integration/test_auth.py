"""Integration tests for authentication endpoints."""
import pytest
import hashlib


class TestAuth:
    """Test suite for authentication endpoints."""
    
    def test_signup_success(self, client):
        """Test successful user signup."""
        response = client.post(
            "/auth/signup",
            json={
                "email": "newuser@snake.io",
                "username": "NewPlayer",
                "password": "securepass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["user"]["email"] == "newuser@snake.io"
        assert data["user"]["username"] == "NewPlayer"
    
    def test_signup_duplicate_email(self, client):
        """Test signup with existing email."""
        response = client.post(
            "/auth/signup",
            json={
                "email": "player1@snake.io",
                "username": "AnotherName",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Email already exists" in data["error"]
    
    def test_signup_duplicate_username(self, client):
        """Test signup with existing username."""
        response = client.post(
            "/auth/signup",
            json={
                "email": "newemail@snake.io",
                "username": "SnakeMaster",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Username already taken" in data["error"]
    
    def test_login_success(self, client):
        """Test successful login."""
        response = client.post(
            "/auth/login",
            json={
                "email": "player1@snake.io",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["user"]["email"] == "player1@snake.io"
        assert data["user"]["username"] == "SnakeMaster"
    
    def test_login_invalid_password(self, client):
        """Test login with invalid password."""
        response = client.post(
            "/auth/login",
            json={
                "email": "player1@snake.io",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Invalid email or password" in data["error"]
    
    def test_login_invalid_email(self, client):
        """Test login with non-existent email."""
        response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@snake.io",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Invalid email or password" in data["error"]
    
    def test_logout(self, client):
        """Test logout endpoint."""
        response = client.post("/auth/logout")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Logout successful"
    
    def test_get_current_user(self, client):
        """Test getting current authenticated user when not authenticated."""
        response = client.get("/auth/me")
        assert response.status_code == 401
        data = response.json()
        assert "Not authenticated" in data["detail"]
