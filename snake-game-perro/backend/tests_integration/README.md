# Integration Tests

This directory contains integration tests for the Snake Arena backend API. These tests use SQLite to ensure the API works correctly with a real database.

## What are Integration Tests?

Integration tests verify that multiple components of the application work together correctly. Unlike unit tests that test individual functions in isolation, integration tests test the entire API stack including:

- Database operations (SQLAlchemy ORM)
- API endpoints (FastAPI routes)
- Request/response handling
- Data validation

## Test Organization

The integration tests are organized by feature:

- **test_auth.py** - Authentication endpoints (signup, login, logout, get current user)
- **test_leaderboard.py** - Leaderboard endpoints (get leaderboard, submit scores)
- **test_sessions.py** - Game sessions endpoints (get sessions, get session by ID)
- **test_root.py** - Root API endpoint

## Running Integration Tests

### Run all integration tests:
```bash
pytest tests_integration -v
```

### Run specific test file:
```bash
pytest tests_integration/test_auth.py -v
```

### Run specific test class:
```bash
pytest tests_integration/test_auth.py::TestAuth -v
```

### Run specific test:
```bash
pytest tests_integration/test_auth.py::TestAuth::test_login_success -v
```

### Run with coverage:
```bash
pytest tests_integration --cov=app --cov-report=html
```

## Test Database

Integration tests use a temporary SQLite database that is:

- Created fresh for each test session
- Populated with sample data (users, leaderboard entries, game sessions)
- Automatically cleaned up after tests complete

This ensures tests are isolated and don't interfere with each other or the production database.

## Key Features

- ✅ **Isolated**: Each test gets its own database instance
- ✅ **Comprehensive**: Tests cover happy paths, edge cases, and error scenarios
- ✅ **Fast**: SQLite in-memory testing is very quick
- ✅ **Realistic**: Tests use real API calls via TestClient
- ✅ **Maintainable**: Organized by feature with clear naming

## Fixtures

The conftest.py provides important fixtures:

- `temp_db` - Creates a temporary SQLite database
- `db_session` - Provides a database session with sample data
- `client` - Provides a FastAPI TestClient with database overrides

These fixtures handle database setup and teardown automatically.
