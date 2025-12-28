# Snake Arena Backend ⚙️

FastAPI backend server for the Snake Arena game. Handles user authentication, leaderboard management, and real-time game sessions.

## Features
- User authentication (signup, login, logout) 🔐
- Leaderboard tracking with multiple game modes 🏆
- Real-time game sessions management 🎮
- RESTful API with OpenAPI/Swagger documentation 📚

## Tech Stack
- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic** - Data validation using Python type hints
- **Uvicorn** - ASGI server for running the application
- **Pytest** - Testing framework for API endpoints

## Prerequisites
- [uv](https://github.com/astral-sh/uv) - Python package manager
- Python 3.11+

## Getting Started

### 1. Setup

```bash
# Install dependencies
uv sync
```

### 2. Running the Server

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at **`http://localhost:8000`** 🚀

#### API Documentation
- **Swagger UI (Interactive)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### 3. Running Tests

```bash
uv run pytest -v
```

All tests should pass ✅

## Project Structure

```
app/
├── main.py           # FastAPI app setup and routes
├── models.py         # Pydantic models (schemas)
├── db.py             # Mock database
└── routers/
    ├── auth.py       # Authentication endpoints
    ├── leaderboard.py # Leaderboard endpoints
    └── sessions.py    # Game sessions endpoints

tests/
└── test_api.py       # API endpoint tests
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current authenticated user

### Leaderboard
- `GET /leaderboard` - Get leaderboard (optionally filter by mode)
- `POST /leaderboard` - Submit a new score

### Sessions
- `GET /sessions` - Get all active game sessions
- `GET /sessions/{id}` - Get a specific session details

## Development Notes
- Currently uses a mock in-memory database
- Real database integration coming soon 🔄
- All endpoints are fully tested
