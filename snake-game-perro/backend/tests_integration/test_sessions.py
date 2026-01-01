"""Integration tests for game sessions endpoints."""
import pytest


class TestSessions:
    """Test suite for game sessions endpoints."""
    
    def test_get_live_sessions(self, client):
        """Test getting all live game sessions."""
        response = client.get("/sessions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        # All returned sessions should be live
        for session in data:
            assert session["isLive"] is True
    
    def test_get_session_by_id(self, client):
        """Test getting a specific session by ID."""
        # First get all sessions to get a valid ID
        response = client.get("/sessions")
        assert response.status_code == 200
        sessions = response.json()
        assert len(sessions) > 0
        
        # Get first session ID
        session_id = sessions[0]["id"]
        
        # Now get that specific session
        response = client.get(f"/sessions/{session_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == session_id
        assert data["username"] == sessions[0]["username"]
        assert data["score"] == sessions[0]["score"]
        assert data["mode"] == sessions[0]["mode"]
    
    def test_get_session_not_found(self, client):
        """Test getting a non-existent session."""
        response = client.get("/sessions/nonexistent-id")
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()
    
    def test_session_structure(self, client):
        """Test that sessions have the correct structure."""
        response = client.get("/sessions")
        assert response.status_code == 200
        sessions = response.json()
        
        for session in sessions:
            assert "id" in session
            assert "username" in session
            assert "score" in session
            assert "mode" in session
            assert "isLive" in session
            assert isinstance(session["score"], int)
            assert isinstance(session["isLive"], bool)
            assert session["mode"] in ["walls", "pass-through"]
    
    def test_multiple_live_sessions(self, client):
        """Test that multiple live sessions are returned correctly."""
        response = client.get("/sessions")
        assert response.status_code == 200
        sessions = response.json()
        
        # Should have at least 2 live sessions from initial data
        assert len(sessions) >= 2
        
        # All should be live
        for session in sessions:
            assert session["isLive"] is True
