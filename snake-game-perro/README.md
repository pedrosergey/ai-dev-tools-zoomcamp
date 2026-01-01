# Snake Arena 🐍

Render deployment guide lives in [RENDER.md](RENDER.md).

A full-stack Snake game built as a capstone project for the **AI Dev Tools Zoomcamp** — showcasing how to rapidly prototype, build, and deploy a modern web application using AI-assisted development.

## What is this?

Snake Arena is a multiplayer snake game with real-time leaderboards, user authentication, and two engaging game modes. It demonstrates a complete end-to-end pipeline: React frontend, FastAPI backend, PostgreSQL database — all containerized with Docker Compose and served via Nginx.

**Built with AI** 🤖: This project was accelerated using GitHub Copilot and Claude to generate code, debug issues, and optimize the development workflow.

## Tech Stack

**Frontend**: React + TypeScript + Vite + Tailwind + shadcn/ui  
**Backend**: FastAPI + SQLAlchemy + PostgreSQL  
**Infrastructure**: Docker Compose + Nginx + PostgreSQL  
**Deployment**: Fully containerized and production-ready  

## Quick Start

Everything runs in Docker. Get started in 30 seconds:

```bash
# Navigate to project
cd snake-game-perro

# Start all services
docker-compose up -d

# Open in browser
# Frontend: http://localhost/
# API Docs: http://localhost/docs
```

All services will be running and ready to play! 🎮

## Project Structure

```
snake-game-perro/
├── docker-compose.yml     # Orchestrates all services
├── nginx.conf            # Reverse proxy configuration
├── backend/              # FastAPI application
│   ├── app/             # Main app code
│   ├── tests/           # Unit tests
│   └── pyproject.toml   # Python dependencies
├── frontend/            # React application
│   ├── src/            # React components & logic
│   ├── package.json    # Node dependencies
│   └── vite.config.ts  # Vite configuration
└── QUICK_START.md      # Quick reference guide
```

## Features

✨ **Game Modes**: Two unique gameplay styles — Walls (classic) and Pass-through (wrapping)  
🏆 **Leaderboards**: Real-time score tracking and ranking  
🔐 **Authentication**: User accounts with secure password handling  
👁️ **Spectator Mode**: Watch other players' live games  
🚀 **Modern Stack**: Built with latest frameworks and best practices  
📦 **Fully Dockerized**: Easy to run anywhere, consistent environment  

## Development

### Make Changes Instantly

Both backend and frontend support hot-reload for development:

```bash
# Backend auto-reloads with uvicorn --reload
# Frontend auto-reloads with Vite HMR

# Edit code and changes appear immediately in browser!
```

### Run Tests

```bash
# Test the backend API
docker-compose exec backend uv run pytest -v

# Check health of all services
bash health-check.sh
```

### Database Access

```bash
# Connect to PostgreSQL directly
docker-compose exec postgres psql -U snake_user -d snake_arena

# Or backup/restore data
docker-compose exec postgres pg_dump -U snake_user snake_arena > backup.sql
```

## Documentation

- **[QUICK_START.md](QUICK_START.md)** — Fast setup and common commands (5 min read)
- **[README_DOCKER.md](README_DOCKER.md)** — Docker Compose quick reference (5 min read)
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** — Comprehensive guide with production tips (15 min read)
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** — How we migrated from SQLite to PostgreSQL (5 min read)

## Common Commands

```bash
docker-compose up -d          # Start all services
docker-compose logs -f        # View logs
docker-compose stop           # Stop services
docker-compose down -v        # Remove everything (including database!)
bash health-check.sh          # Verify all services are running
```

## What I Learned

This project taught me:
- How to architect a full-stack application efficiently 🏗️
- Docker best practices for development and production 🐳
- Real-time game state management and networking ⚡
- Using AI tools (Copilot, Claude) to accelerate development 🤖
- Debugging containerized applications 🔍

## Future Enhancements

- [ ] WebSocket support for real-time multiplayer
- [ ] Mobile-responsive improvements
- [ ] Additional game modes
- [ ] Advanced analytics and statistics
- [ ] Replay system for recorded games

## Notes

This is a learning project built quickly with AI assistance. It's perfect for understanding modern full-stack development, but there's always room for improvement. Feel free to explore, learn from it, and build on top of it! 💡

---

**Questions?** Check the documentation files above or explore the code — it's all here and ready to learn from!  
**Want to contribute?** Fork it, improve it, and share your ideas! 🚀
