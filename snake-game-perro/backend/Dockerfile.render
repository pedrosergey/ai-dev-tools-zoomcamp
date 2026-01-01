FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Copy project files from subdirectory
COPY snake-game-perro/backend/pyproject.toml snake-game-perro/backend/uv.lock* ./

# Install dependencies
RUN uv sync --frozen

# Copy application code
COPY snake-game-perro/backend/ .

# Expose port
EXPOSE 8000

# Run application (Render will provide $PORT)
CMD ["sh", "-c", "uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
