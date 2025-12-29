"""Integration tests for leaderboard endpoints."""
import pytest
from app.models import GameMode


class TestLeaderboard:
    """Test suite for leaderboard endpoints."""
    
    def test_get_leaderboard(self, client):
        """Test getting full leaderboard."""
        response = client.get("/leaderboard")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3
        # Check that entries are sorted by score descending
        assert data[0]["score"] >= data[1]["score"]
    
    def test_get_leaderboard_by_mode(self, client):
        """Test getting leaderboard filtered by game mode."""
        response = client.get("/leaderboard?mode=walls")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All entries should be for WALLS mode
        for entry in data:
            assert entry["mode"] == "walls"
    
    def test_get_leaderboard_pass_through_mode(self, client):
        """Test getting leaderboard for pass-through mode."""
        response = client.get("/leaderboard?mode=pass-through")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for entry in data:
            assert entry["mode"] == "pass-through"
    
    def test_submit_score(self, client):
        """Test submitting a new score."""
        response = client.post(
            "/leaderboard",
            json={
                "score": 3000,
                "mode": "walls",
                "username": "TestPlayer"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["rank"], int)
        assert data["rank"] > 0
    
    def test_submit_score_pass_through(self, client):
        """Test submitting a score for pass-through mode."""
        response = client.post(
            "/leaderboard",
            json={
                "score": 2500,
                "mode": "pass-through",
                "username": "PassThroughPlayer"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["rank"], int)
    
    def test_submit_score_without_username(self, client):
        """Test submitting a score without username (should default to Unknown)."""
        response = client.post(
            "/leaderboard",
            json={
                "score": 1500,
                "mode": "walls"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
    
    def test_submit_high_score(self, client):
        """Test that a high score gets a good rank."""
        # Submit a very high score
        response = client.post(
            "/leaderboard",
            json={
                "score": 9999,
                "mode": "walls",
                "username": "TopPlayer"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        # Should be in top ranks (rank 1 or 2)
        assert data["rank"] <= 2
    
    def test_leaderboard_score_ordering(self, client):
        """Test that leaderboard is properly sorted by score."""
        # Add multiple scores
        client.post(
            "/leaderboard",
            json={
                "score": 1000,
                "mode": "walls",
                "username": "Player1"
            }
        )
        client.post(
            "/leaderboard",
            json={
                "score": 2000,
                "mode": "walls",
                "username": "Player2"
            }
        )
        
        # Get leaderboard and verify ordering
        response = client.get("/leaderboard?mode=walls")
        assert response.status_code == 200
        data = response.json()
        
        # Verify descending order by score
        for i in range(len(data) - 1):
            assert data[i]["score"] >= data[i + 1]["score"]
