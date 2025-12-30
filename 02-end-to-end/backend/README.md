# Backend API ⚙️

FastAPI server powering Snake Arena — handles authentication, leaderboards, game sessions, and real-time state management.

## What it does

- 🔐 **User Management**: Signup, login, account management
- 🏆 **Leaderboards**: Real-time score tracking with multiple game modes
- 🎮 **Game Sessions**: Manage active games and player state
- 📚 **API Documentation**: Auto-generated with OpenAPI/Swagger

## Tech

- **FastAPI** — Modern async Python web framework
- **SQLAlchemy** — ORM for database operations
- **PostgreSQL** — Production database (SQLite in dev)
- **Pydantic** — Data validation and serialization
- **Uvicorn** — ASGI application server

## Quick Start

### With Docker Compose (recommended)

```bash
# From project root, this runs automatically
docker-compose up -d

# API available at: http://localhost:8000
# Docs at: http://localhost/docs or http://localhost:8000/docs
```

### Local Development

```bash
# Install dependencies
uv sync

# Run with auto-reload
uv run uvicorn app.main:app --reload

# Access at http://localhost:8000
```

## API Endpoints

### Authentication
- `POST /auth/signup` — Create account
- `POST /auth/login` — Login user
- `POST /auth/logout` — Logout user
- `GET /auth/me` — Get current user

### Leaderboard
- `GET /leaderboard` — Get scores (optionally filter by mode)
- `POST /leaderboard` — Submit new score

### Sessions
- `GET /sessions` — List active game sessions
- `GET /sessions/{id}` — Get session details

## Testing

```bash
# Run all tests
uv run pytest -v

# Run integration tests
uv run pytest -v tests_integration/

# Watch mode
uv run pytest -v --watch
```

## Database

### Connect to Database

```bash
# Via Docker
docker-compose exec postgres psql -U snake_user -d snake_arena

# Check tables
\dt
```

### Reset Database

```bash
# Delete and recreate from Docker
docker-compose down -v
docker-compose up -d
```

## Project Structure

```
app/
├── main.py         # FastAPI app, startup/shutdown logic
├── models.py       # SQLAlchemy & Pydantic models
├── database.py     # Database connection & setup
├── db.py           # Database service layer
└── routers/
    ├── auth.py     # /auth/* endpoints
    ├── leaderboard.py  # /leaderboard/* endpoints
    └── sessions.py # /sessions/* endpoints

tests/
├── test_api.py     # Unit tests
└── conftest.py     # Pytest fixtures

tests_integration/
├── test_auth.py    # Integration tests
├── test_leaderboard.py
└── test_sessions.py
```

## Environment Variables

```bash
# Database connection
DATABASE_URL=postgresql://user:password@host:port/db

# Or use default (SQLite)
# DATABASE_URL=sqlite:///./snake_arena.db

# Application mode
ENVIRONMENT=development
```

## Development Tips

### Hot Reload
Changes to Python files auto-reload with `--reload` flag (enabled in dev).

### View Logs
```bash
# Docker
docker-compose logs -f backend

# Local
# Check console output
```

### Database Migrations
If using Alembic:
```bash
uv run alembic upgrade head
```

## Production Notes

- Remove `--reload` flag in production
- Set `ENVIRONMENT=production`
- Use PostgreSQL (not SQLite)
- Enable proper error logging
- Configure CORS appropriately
- Use HTTPS

## Debugging

### Check Health
```bash
curl http://localhost:8000/
```

### View Database Tables
```bash
docker-compose exec postgres psql -U snake_user -d snake_arena -c "\dt"
```

### Test API
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"pass123"}'
```

## Contributing

- Follow FastAPI best practices
- Write tests for new endpoints
- Update API documentation
- Ensure database migrations work

---

Built with FastAPI & ❤️
