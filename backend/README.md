# Calendar API Backend

FastAPI backend with SQLite database for the Svelte 5 Calendar application.

## Features

- RESTful API for calendar events and calendars
- SQLite database with SQLAlchemy ORM
- Automatic database initialization
- CORS support for frontend
- Recurring events support
- Multiple calendars management

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 3. View API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Calendars

- `GET /api/calendars` - Get all calendars
- `GET /api/calendars/{id}` - Get specific calendar
- `POST /api/calendars` - Create new calendar
- `PUT /api/calendars/{id}` - Update calendar
- `DELETE /api/calendars/{id}` - Delete calendar

### Events

- `GET /api/events` - Get all events (supports date range filtering)
- `GET /api/events/{id}` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

## Database

The SQLite database (`calendar.db`) is automatically created on first run with the following tables:

### calendars
- id (String, Primary Key)
- name (String)
- color (String)
- visible (Boolean)
- is_default (Boolean)
- created_at (DateTime)
- updated_at (DateTime)

### events
- id (String, Primary Key)
- title (String)
- description (String, nullable)
- start_date (DateTime)
- end_date (DateTime)
- location (String, nullable)
- calendar_id (String, Foreign Key)
- category (String)
- status (String)
- priority (String)
- is_all_day (Boolean)
- reminder (String)
- attendees (JSON)
- recurrence (JSON, nullable)
- is_exception (Boolean)
- is_deleted (Boolean)
- original_event_id (String, nullable)
- exception_date (DateTime, nullable)
- created_at (DateTime)
- updated_at (DateTime)

## Default Data

On first run, the database is seeded with 4 default calendars:
1. My Calendar (default, blue)
2. Work (green)
3. Personal (orange)
4. Family (pink)

## Development

The backend uses:
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Environment

Default configuration:
- Host: `0.0.0.0`
- Port: `8000`
- Database: `sqlite:///./calendar.db`
- CORS Origins: `http://localhost:5173`, `http://localhost:5174`, `http://localhost:3000`

## Troubleshooting

### Port already in use
If port 8000 is already in use, you can change it:
```bash
uvicorn main:app --reload --port 8001
```

### Database issues
To reset the database, simply delete `calendar.db` and restart the server.

### CORS errors
If you're running the frontend on a different port, add it to the `allow_origins` list in `main.py`.
