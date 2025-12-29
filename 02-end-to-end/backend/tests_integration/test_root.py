"""Integration tests for root API endpoint."""


class TestRoot:
    """Test suite for root API endpoint."""
    
    def test_root_endpoint(self, client):
        """Test the root endpoint returns welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Welcome to Snake Arena API" in data["message"]
