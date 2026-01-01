#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  🐳 Docker Compose Status Checker${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""

# Check Docker
echo -e "${YELLOW}Checking Docker installation...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is installed"
    docker --version
else
    echo -e "${RED}✗${NC} Docker not found"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is installed"
    docker-compose --version
else
    echo -e "${RED}✗${NC} Docker Compose not found"
    exit 1
fi

echo ""
echo -e "${YELLOW}Checking container status...${NC}"
echo ""

# Check if compose is running
if ! docker ps &> /dev/null; then
    echo -e "${RED}✗${NC} Docker daemon is not running"
    exit 1
fi

# Check services
cd "$(dirname "$0")" || exit

# Function to check service
check_service() {
    local service=$1
    local port=$2
    local name=$3
    
    if docker-compose ps $service 2>/dev/null | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} $name (Port $port) - Running"
        return 0
    else
        echo -e "${RED}✗${NC} $name (Port $port) - Not running"
        return 1
    fi
}

# Check each service
postgres_ok=0
backend_ok=0
frontend_ok=0
nginx_ok=0

check_service "postgres" "5432" "PostgreSQL Database" && postgres_ok=1
check_service "backend" "8000" "FastAPI Backend" && backend_ok=1
check_service "frontend" "5173" "React Frontend" && frontend_ok=1
check_service "nginx" "80" "Nginx Reverse Proxy" && nginx_ok=1

echo ""
echo -e "${YELLOW}Checking health endpoints...${NC}"
echo ""

# Health checks
if [ $postgres_ok -eq 1 ]; then
    if docker-compose exec -T postgres pg_isready -U snake_user &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL is responding"
    else
        echo -e "${RED}✗${NC} PostgreSQL is not responding"
    fi
fi

if [ $backend_ok -eq 1 ]; then
    if curl -s http://localhost:8000/docs &> /dev/null; then
        echo -e "${GREEN}✓${NC} Backend API is responding"
    else
        echo -e "${RED}✗${NC} Backend API is not responding"
    fi
fi

if [ $nginx_ok -eq 1 ]; then
    if curl -s http://localhost/health &> /dev/null; then
        echo -e "${GREEN}✓${NC} Nginx health check passed"
    else
        echo -e "${RED}✗${NC} Nginx health check failed"
    fi
fi

echo ""
echo -e "${YELLOW}Service URLs:${NC}"
echo "  Frontend:           http://localhost/"
echo "  Backend API:        http://localhost:8000"
echo "  Swagger UI:         http://localhost:8000/docs"
echo "  ReDoc:              http://localhost:8000/redoc"
echo "  PostgreSQL:         localhost:5432"
echo ""

echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs:          docker-compose logs -f"
echo "  Stop services:      docker-compose stop"
echo "  Restart services:   docker-compose restart"
echo "  Database shell:     docker-compose exec postgres psql -U snake_user -d snake_arena"
echo "  Backend shell:      docker-compose exec backend bash"
echo "  Run tests:          docker-compose exec backend uv run pytest -v"
echo ""

# Summary
if [ $postgres_ok -eq 1 ] && [ $backend_ok -eq 1 ] && [ $frontend_ok -eq 1 ] && [ $nginx_ok -eq 1 ]; then
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ All services are running!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
else
    echo -e "${YELLOW}════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  ⚠️  Some services are not running${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════${NC}"
    echo ""
    echo "To start services:"
    echo "  docker-compose up -d"
fi

echo ""
