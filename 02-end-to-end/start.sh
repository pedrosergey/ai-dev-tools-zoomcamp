#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Snake Arena Docker Compose Setup${NC}"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Docker and Docker Compose are installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created"
    echo -e "${YELLOW}⚠️  Please review and update .env file if needed${NC}"
    echo ""
fi

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build
echo -e "${GREEN}✓${NC} Docker images built successfully"
echo ""

# Start services
echo -e "${YELLOW}🚀 Starting Docker containers...${NC}"
docker-compose up -d
echo -e "${GREEN}✓${NC} Docker containers started"
echo ""

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
max_attempts=30
attempt=1
while ! docker-compose exec -T postgres pg_isready -U snake_user > /dev/null 2>&1; do
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}❌ PostgreSQL did not become ready in time${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
    ((attempt++))
done
echo ""
echo -e "${GREEN}✓${NC} PostgreSQL is ready"
echo ""

# Wait for Backend to be ready
echo -e "${YELLOW}⏳ Waiting for Backend API to be ready...${NC}"
max_attempts=30
attempt=1
while ! curl -s http://localhost:8000/health > /dev/null 2>&1; do
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}⚠️  Backend API is taking longer than expected${NC}"
        break
    fi
    echo -n "."
    sleep 1
    ((attempt++))
done
echo ""
echo -e "${GREEN}✓${NC} Backend API is responding"
echo ""

# Display service information
echo -e "${GREEN}======================================"
echo "✅ Snake Arena is ready!"
echo "======================================${NC}"
echo ""
echo -e "${YELLOW}📍 Service URLs:${NC}"
echo "  Frontend:           http://localhost/"
echo "  API Base:           http://localhost/api"
echo "  Swagger UI Docs:    http://localhost/docs"
echo "  ReDoc:              http://localhost/redoc"
echo "  PostgreSQL:         localhost:5432"
echo ""
echo -e "${YELLOW}📊 Database Credentials:${NC}"
echo "  User:               snake_user"
echo "  Password:           snake_password"
echo "  Database:           snake_arena"
echo ""
echo -e "${YELLOW}📁 Useful Commands:${NC}"
echo "  View logs:          docker-compose logs -f"
echo "  View backend logs:  docker-compose logs -f backend"
echo "  Stop services:      docker-compose stop"
echo "  Down services:      docker-compose down"
echo "  Access DB shell:    docker-compose exec postgres psql -U snake_user -d snake_arena"
echo "  Run tests:          docker-compose exec backend uv run pytest -v"
echo ""
echo -e "${YELLOW}📚 Full setup guide: See DOCKER_SETUP.md${NC}"
echo ""
