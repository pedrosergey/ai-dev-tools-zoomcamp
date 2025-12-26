# TODO Management API - Django Project

A simple yet powerful TODO management application built with Django and Django REST Framework. This project allows users to create, edit, delete, and manage TODO items with due dates and status tracking.

## Features

✅ **Create TODOs** - Add new TODO items with title, description, and due dates
✏️ **Edit TODOs** - Update TODO information at any time  
🗑️ **Delete TODOs** - Remove completed or unwanted TODOs
📅 **Due Dates** - Assign due dates to track important deadlines
✔️ **Mark as Resolved** - Track completion status of TODOs
⏰ **Overdue Detection** - Automatically identifies overdue TODOs
📊 **Filter by Status** - View pending, resolved, or all TODOs
📱 **REST API** - Full REST API for integration with frontend applications

## Project Structure

```
Final Project/
├── .venv/                      # Virtual environment
├── todo_project/               # Django project settings
│   ├── settings.py            # Project configuration
│   ├── urls.py                # Main URL routing
│   ├── wsgi.py                # WSGI application
│   └── asgi.py                # ASGI application
├── todos/                      # Main app
│   ├── migrations/            # Database migrations
│   ├── models.py              # TODO model definition
│   ├── views.py               # API views
│   ├── serializers.py         # DRF serializers
│   ├── urls.py                # App URL routing
│   └── admin.py               # Django admin configuration
├── manage.py                  # Django management script
├── db.sqlite3                 # SQLite database (created after migrations)
└── requirements.txt           # Project dependencies
```

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd "Final Project"
```

### 2. Activate Virtual Environment

**On Windows:**
```bash
.venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (for Django Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 6. Start the Development Server

```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`

## API Endpoints

### Base URL: `http://127.0.0.1:8000/api/`

#### List all TODOs
```
GET /api/todos/
```

#### Create a new TODO
```
POST /api/todos/
Content-Type: application/json

{
    "title": "Complete project",
    "description": "Finish the TODO API project",
    "due_date": "2025-12-31T23:59:59Z",
    "status": "pending"
}
```

#### Retrieve a specific TODO
```
GET /api/todos/{id}/
```

#### Update a TODO
```
PUT /api/todos/{id}/
PATCH /api/todos/{id}/
```

#### Delete a TODO
```
DELETE /api/todos/{id}/
```

#### Mark TODO as Resolved
```
POST /api/todos/{id}/mark_resolved/
```

#### Mark TODO as Pending
```
POST /api/todos/{id}/mark_pending/
```

#### Get All Pending TODOs
```
GET /api/todos/pending/
```

#### Get All Resolved TODOs
```
GET /api/todos/resolved/
```

#### Get All Overdue TODOs
```
GET /api/todos/overdue/
```

## Django Admin Interface

Access the Django admin panel at `http://127.0.0.1:8000/admin/` with your superuser credentials.

Features:
- View all TODOs
- Create, edit, and delete TODOs
- Bulk actions to mark TODOs as resolved or pending
- Filter by status, creation date, or due date
- Search by title or description

## TODO Model Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Primary key (auto-generated) |
| `title` | CharField | Title of the TODO (max 200 chars) |
| `description` | TextField | Detailed description (optional) |
| `due_date` | DateTimeField | Due date for the TODO (optional) |
| `status` | CharField | Status: 'pending' or 'resolved' |
| `created_at` | DateTimeField | Creation timestamp |
| `updated_at` | DateTimeField | Last update timestamp |
| `resolved_at` | DateTimeField | Resolution timestamp (optional) |

## Example Usage

### Using cURL

```bash
# Create a TODO
curl -X POST http://127.0.0.1:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "due_date": "2025-12-25T18:00:00Z",
    "status": "pending"
  }'

# Get all TODOs
curl http://127.0.0.1:8000/api/todos/

# Mark a TODO as resolved
curl -X POST http://127.0.0.1:8000/api/todos/1/mark_resolved/

# Get overdue TODOs
curl http://127.0.0.1:8000/api/todos/overdue/
```

### Using Python Requests

```python
import requests

BASE_URL = "http://127.0.0.1:8000/api"

# Create a TODO
data = {
    "title": "Complete documentation",
    "description": "Write README and API docs",
    "due_date": "2025-12-31T23:59:59Z",
    "status": "pending"
}
response = requests.post(f"{BASE_URL}/todos/", json=data)
print(response.json())

# Get all TODOs
response = requests.get(f"{BASE_URL}/todos/")
print(response.json())

# Mark TODO as resolved
response = requests.post(f"{BASE_URL}/todos/1/mark_resolved/")
print(response.json())
```

## Development

### Making Code Changes

1. Edit the relevant files
2. Django auto-reloads when server is running
3. No restart needed for most changes

### Running Tests

```bash
python manage.py test
```

### Creating Migrations

After modifying models:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Technologies Used

- **Django 5.2.9** - Web framework
- **Django REST Framework 3.16.1** - REST API framework
- **SQLite3** - Database
- **Python 3.10+** - Programming language

## License

This project is part of the AI-DEV-TOOLS-ZOOMCAMP cohort.

## Support

For issues or questions, please refer to the main project repository.
