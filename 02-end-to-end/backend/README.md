# Snake Arena Backend

FastAPI backend for Snake Arena game.

## Local Development

Prerequisites:
- [uv](https://github.com/astral-sh/uv)

### Setup

```bash
# Install dependencies
uv sync
```

### Running the Server

```bash
uv run uvicorn src.main:app --reload
```

The API will be available at `http://localhost:8000`.
Documentation is available at `http://localhost:8000/docs`.

### Running Tests

```bash
uv run pytest
```
