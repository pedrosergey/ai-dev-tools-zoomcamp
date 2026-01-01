# Production Deployment Guide

This guide shows how to deploy Snake Arena with everything in a single container for production.

## Architecture

```
User (port 80)
    ↓
Single Container (FastAPI)
├─ Backend API (/api/*)
├─ Frontend Static Files (/)
└─ PostgreSQL (port 5432)
```

**Key difference from development:**
- Development: 4 separate containers (frontend, backend, nginx, postgres)
- Production: 1 app container serving both frontend & backend + 1 postgres container

## Quick Start

### Build and Run

```bash
cd 02-end-to-end

# Start production containers
docker-compose -f docker-compose.prod.yml up --build

# Game will be available at http://localhost
```

### Stop

```bash
docker-compose -f docker-compose.prod.yml down
```

### Clean Database

```bash
docker-compose -f docker-compose.prod.yml down -v
```

## How It Works

### Multi-Stage Build

The `Dockerfile.prod` uses a two-stage build:

1. **Stage 1: Frontend Builder**
   - Builds React/TypeScript code
   - Outputs static files to `/frontend/dist`

2. **Stage 2: Backend + Static Files**
   - Installs Python dependencies
   - Copies backend code
   - Copies frontend static files from stage 1
   - FastAPI serves everything on port 8000 → exposed as port 80

### Routes

- `GET /` - Serves React frontend (index.html)
- `GET /api/*` - FastAPI API endpoints
- `GET /docs` - Swagger documentation
- `GET /redoc` - ReDoc documentation

## Deployment Steps

### 1. Clone Repository

```bash
git clone https://github.com/pedrosergey/ai-dev-tools-zoomcamp
cd ai-dev-tools-zoomcamp/02-end-to-end
```

### 2. Configure Environment

Create `.env` if needed:

```env
DATABASE_URL=postgresql://snake_user:snake_password@postgres:5432/snake_arena
ENVIRONMENT=production
```

### 3. Deploy

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up --build -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Access Application

```
Frontend: http://your-server-ip
API Docs: http://your-server-ip/docs
API: http://your-server-ip/api/*
```

## Container Details

### Single App Container

```dockerfile
# Builds frontend first
# Then copies:
#  - Backend Python code
#  - Frontend dist folder to /app/static
# Runs: uvicorn on port 8000
```

**Image Size:** ~700MB (Node build tools + Python + Frontend assets)

### PostgreSQL Container

- Port: 5432
- Data: Persistent volume `postgres_data`
- Auto-initializes on first run

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Verify build
docker-compose -f docker-compose.prod.yml up --build
```

### Database connection error

```bash
# Check PostgreSQL is healthy
docker-compose -f docker-compose.prod.yml ps

# Check database exists
docker exec snake_arena_db psql -U snake_user -d snake_arena -c '\dt'
```

### Frontend shows 404

The frontend is served by FastAPI. If you see 404:

1. Check build completed: `docker-compose logs app | grep "Uvicorn"`
2. Verify static files exist: `docker exec snake_arena_app ls /app/static`
3. Check app is running: `curl http://localhost/`

### Port 80 already in use

Edit `docker-compose.prod.yml`:

```yaml
ports:
  - "8080:8000"  # Use 8080 instead of 80
```

Then access at `http://localhost:8080`

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Containers | 4 (frontend, backend, nginx, postgres) | 2 (app, postgres) |
| Frontend Reload | Hot reload via Vite | Static files served by FastAPI |
| Build Time | Fast (no build) | Slow (builds frontend) |
| Code Size | Smaller images | Larger image (~700MB) |
| Debugging | Easier (separate services) | Simplified (fewer moving parts) |
| Scaling | Per-service | Single app instance |

## Next Steps

### Multi-Instance Production

For high-traffic scenarios:

```bash
# Use Kubernetes or Docker Swarm to run multiple instances
# Load balance with nginx/haproxy
# Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
```

### CI/CD Pipeline

```yaml
# Example: GitHub Actions
1. Build & test
2. Build production image
3. Push to registry
4. Deploy to production server
```

### Environment-Specific Config

```bash
# Separate configs
docker-compose.dev.yml   # Development (hot reload)
docker-compose.prod.yml  # Production (optimized)
docker-compose.test.yml  # Testing
```

## Monitoring

Add health endpoints:

```bash
# Check app health
curl http://localhost/health

# Check database
curl http://localhost/api/root

# View logs
docker-compose -f docker-compose.prod.yml logs -f --tail=50
```

---

**Questions?** Check the main [README.md](./README.md) for architecture overview.
