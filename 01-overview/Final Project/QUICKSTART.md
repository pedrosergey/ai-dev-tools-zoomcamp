# Quick Start Guide

## Get Started in 3 Steps

### 1. Activate Virtual Environment

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 2. Start Development Server

```bash
python manage.py runserver
```

Server will run at: `http://127.0.0.1:8000/`

### 3. Create Admin Account (First Time Only)

```bash
python manage.py createsuperuser
```

Then visit: `http://127.0.0.1:8000/admin/`

## API Quick Links

- **API Root:** http://127.0.0.1:8000/api/
- **List TODOs:** http://127.0.0.1:8000/api/todos/
- **Pending TODOs:** http://127.0.0.1:8000/api/todos/pending/
- **Resolved TODOs:** http://127.0.0.1:8000/api/todos/resolved/
- **Overdue TODOs:** http://127.0.0.1:8000/api/todos/overdue/

## Test with curl

```bash
# Create a TODO
curl -X POST http://127.0.0.1:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title":"My First TODO","description":"Testing the API","status":"pending"}'

# Get all TODOs
curl http://127.0.0.1:8000/api/todos/

# Mark TODO #1 as resolved
curl -X POST http://127.0.0.1:8000/api/todos/1/mark_resolved/
```

## Project Components

✅ **Models** - Todo model with full CRUD operations
✅ **Serializers** - DRF serializers for API responses
✅ **Views** - ViewSet with custom actions
✅ **Admin** - Django admin interface with bulk actions
✅ **REST API** - Full REST API with filtering and pagination
✅ **Database** - SQLite3 (pre-configured and migrated)

## Next Steps

- Add authentication (token or JWT)
- Create a frontend (React/Vue/Angular)
- Deploy to production (Heroku, AWS, etc.)
- Add tests and CI/CD
- Implement caching and pagination optimization

Enjoy building! 🚀
