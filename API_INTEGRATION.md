# API Integration Guide

This calendar application supports two modes:
1. **LocalStorage Mode** (default) - All data stored in browser localStorage
2. **API Mode** - Data synced with FastAPI backend and SQLite database

Mode switching is controlled by environment variables - no manual file copying required!

## Quick Start

### Option 1: LocalStorage Mode (Default)

No setup required! Just run the frontend:

```bash
npm install
npm run dev
```

### Option 2: API Mode with Backend

#### Step 1: Start the Backend (Terminal 1)

```bash
npm run backend
```

Or manually:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will run on `http://localhost:8000`

#### Step 2: Run Frontend in API Mode (Terminal 2)

```bash
npm run dev:api
```

That's it! The application will automatically use the backend API.

## Environment Configuration

Create a `.env` file (optional) to customize settings:

```bash
cp .env.example .env
```

Available environment variables:

- `VITE_API_MODE` - Set to `'true'` to enable API mode (default: `false`)
- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:8000`)

### Example .env file for API mode:

```env
VITE_API_MODE=true
VITE_API_BASE_URL=http://localhost:8000
```

Then run with:
```bash
npm run dev
```

## Switching Between Modes

### LocalStorage Mode:
```bash
npm run dev
```

### API Mode:
```bash
npm run dev:api
```

Or use `.env` file with `VITE_API_MODE=true`

## Architecture

### LocalStorage Mode
```
Frontend (Svelte 5)
    └── Stores (calendarStore.svelte.js) → localStorage
```

### API Mode
```
Frontend (Svelte 5)
    ├── Config (src/config.js) - Detects API_MODE from env
    ├── Stores (calendarStore.svelte.js.api) - Uses API service
    ├── Data Transformers (src/utils/dataTransformer.js) - Converts data formats
    └── API Service (src/services/api.js)
        └── FastAPI Backend (backend/main.py)
            └── SQLite Database (backend/calendar.db)
```

### How Mode Detection Works

1. **Environment Variables**: Vite reads `VITE_API_MODE` from environment or `.env` file
2. **Config Module** (`src/config.js`): Exports `API_MODE` boolean based on env vars
3. **Store Loading**: Components dynamically load appropriate store based on `API_MODE`
4. **Data Transformation**: API stores use `dataTransformer.js` to convert between:
   - Frontend format: camelCase (e.g., `startDate`, `isAllDay`)
   - Backend format: snake_case (e.g., `start_date`, `is_all_day`)

## Key Differences

| Feature | LocalStorage Mode | API Mode |
|---------|------------------|----------|
| Data Persistence | Browser only | Database (multi-device) |
| Performance | Instant | Network latency |
| Setup Complexity | None | Backend required |
| Data Sync | No | Yes |
| Scalability | Limited | High |
| Multi-user | No | Yes (potential) |

## API Endpoints

When running in API mode, the following endpoints are available:

### Calendars
- `GET /api/calendars` - List all calendars
- `POST /api/calendars` - Create calendar
- `PUT /api/calendars/{id}` - Update calendar
- `DELETE /api/calendars/{id}` - Delete calendar

### Events
- `GET /api/events` - List all events
- `GET /api/events?start_date=...&end_date=...` - Filter by date range
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Data Migration

To migrate from LocalStorage to API:

1. Export your events using the "Export" button in the UI
2. Start the backend
3. Switch to API mode
4. Import your events using the "Import" button

## Troubleshooting

### Check which mode you're running in
Open browser console and look for:
```
[Config] Running in API mode
[Config] API Base URL: http://localhost:8000
```

Or for LocalStorage mode:
```
[Config] Running in LocalStorage mode
```

### Backend not connecting
- Ensure backend is running: `npm run backend`
- Check backend is accessible: `curl http://localhost:8000/health`
- Verify `VITE_API_MODE=true` is set
- Check browser console for network errors
- Check for CORS errors in console

### Data not loading in API mode
1. Verify API mode is enabled in console logs
2. Check backend is returning data: `http://localhost:8000/api/events`
3. Open Network tab in browser DevTools
4. Look for failed API calls (400/500 errors)
5. Check backend terminal for Python errors

### Wrong mode is active
- Check environment variable: `echo $VITE_API_MODE`
- Restart Vite dev server after changing `.env` file
- Use correct npm script: `npm run dev:api` for API mode
- Clear browser cache if switching modes

### Performance issues
- API mode has network latency (expect 10-100ms per request)
- Use browser Network tab to measure actual latency
- Consider implementing request caching for production
- Use date range filtering for large datasets

## Production Deployment

### Frontend Production Build

For LocalStorage mode (default):
```bash
npm run build
```

For API mode:
```bash
VITE_API_MODE=true VITE_API_BASE_URL=https://api.yourdomain.com npm run build
```

### Backend Deployment

1. Deploy backend to a server (e.g., AWS, Heroku, DigitalOcean, Render)
2. Set production environment variables:
   ```env
   DATABASE_URL=postgresql://...  # Use PostgreSQL instead of SQLite
   ALLOWED_ORIGINS=https://yourdomain.com
   ```
3. Enable HTTPS (required for production)
4. Implement rate limiting
5. Add user authentication and authorization
6. Use production-grade ASGI server:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Frontend Configuration

Set production environment variables:
```env
VITE_API_MODE=true
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Development

### Full Stack Development (Recommended)

Run both backend and frontend simultaneously:

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend in API mode:**
```bash
npm run dev:api
```

### Individual Development

**Backend only:**
```bash
cd backend
uvicorn main:app --reload
```

**Frontend only (LocalStorage mode):**
```bash
npm run dev
```

**Frontend only (API mode):**
```bash
npm run dev:api
```

### Testing API

```bash
# Health check
curl http://localhost:8000/health

# Get all calendars
curl http://localhost:8000/api/calendars

# Get all events
curl http://localhost:8000/api/events

# Create a test calendar
curl -X POST http://localhost:8000/api/calendars \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","color":"#3b82f6","visible":true,"is_default":false}'

# Create a test event
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Event",
    "start_date":"2025-11-10T10:00:00",
    "end_date":"2025-11-10T11:00:00",
    "calendar_id":"<calendar-id>",
    "category":"meeting",
    "status":"confirmed",
    "priority":"medium"
  }'
```

### API Documentation

When backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Technical Details

### Refactored Architecture (v2)

The API mode has been completely refactored for production readiness:

**What Changed:**
1. ❌ **Removed**: Manual file copying between `.local` and `.api` versions
2. ✅ **Added**: Environment variable-based mode detection
3. ✅ **Added**: Centralized configuration module (`src/config.js`)
4. ✅ **Added**: Unified data transformation utilities (`src/utils/dataTransformer.js`)
5. ✅ **Updated**: API stores synced with all latest features
6. ✅ **Added**: Proper error handling and loading states
7. ✅ **Added**: Cache invalidation using `eventsVersion` counter

**Key Files:**

| File | Purpose |
|------|---------|
| `src/config.js` | Detects API mode from environment variables |
| `src/utils/dataTransformer.js` | Converts between camelCase ↔ snake_case |
| `src/stores/calendarStore.svelte.js` | LocalStorage version (default) |
| `src/stores/calendarStore.svelte.js.api` | API version (when API_MODE=true) |
| `src/stores/calendarsStore.svelte.js` | LocalStorage version (default) |
| `src/stores/calendarsStore.svelte.js.api` | API version (when API_MODE=true) |
| `src/services/api.js` | HTTP client for backend API |

**Data Flow in API Mode:**

```
User Action
  ↓
Component calls store method
  ↓
API Store (calendarStore.svelte.js.api)
  ↓
transformEventToApi() - Convert to snake_case
  ↓
API Service (api.js) - HTTP request
  ↓
FastAPI Backend - Process request
  ↓
SQLite Database - Store data
  ↓
FastAPI Backend - Return response
  ↓
API Service - Receive response
  ↓
transformEventFromApi() - Convert to camelCase
  ↓
API Store - Update $state
  ↓
Component reactively updates UI
```

### Feature Parity

Both LocalStorage and API stores support:
- ✅ All CRUD operations (Create, Read, Update, Delete)
- ✅ Recurring events (daily, weekly, monthly, yearly)
- ✅ Recurring event exceptions (edit single instance)
- ✅ Recurring event deletions (delete single instance)
- ✅ Event duplication
- ✅ Category, status, and priority changes
- ✅ Event filtering and search
- ✅ Cache invalidation via `eventsVersion` counter
- ✅ Multiple calendars
- ✅ Calendar visibility toggling
- ✅ Proper Svelte 5 reactivity

### Backend Schema

Events and calendars use these field names (snake_case):

**Event Fields:**
- `id`, `title`, `description`, `start_date`, `end_date`
- `location`, `calendar_id`, `category`, `status`, `priority`
- `is_all_day`, `reminder`, `attendees`, `recurrence`
- `is_exception`, `is_deleted`, `original_event_id`, `exception_date`
- `created_at`, `updated_at`

**Calendar Fields:**
- `id`, `name`, `color`, `visible`, `is_default`
- `created_at`, `updated_at`

The `dataTransformer.js` automatically converts these to/from camelCase for the frontend.

## Features Supported in Both Modes

- ✅ Multiple calendars
- ✅ Recurring events (daily, weekly, monthly, yearly)
- ✅ Event categories with icons
- ✅ Calendar color coding
- ✅ Month/Week/Day views
- ✅ Event search and filtering
- ✅ Dark mode
- ✅ Import/Export
- ✅ Drag and drop
- ✅ Keyboard shortcuts

## Future Enhancements for API Mode

- [ ] User authentication
- [ ] Real-time sync with WebSockets
- [ ] Shared calendars
- [ ] Calendar subscriptions (iCal format)
- [ ] Email notifications
- [ ] Calendar permissions
- [ ] Event comments
- [ ] File attachments
