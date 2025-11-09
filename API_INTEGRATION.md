# API Integration Guide

This calendar application supports two modes:
1. **LocalStorage Mode** (default) - All data stored in browser localStorage
2. **API Mode** - Data synced with FastAPI backend and SQLite database

## Quick Start

### Option 1: LocalStorage Mode (Current Default)

No setup required! Just run the frontend:

```bash
npm install
npm run dev
```

### Option 2: API Mode with Backend

#### Step 1: Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will run on `http://localhost:8000`

#### Step 2: Switch to API Stores

Replace the store files with their API versions:

```bash
# Backup current stores
cp src/stores/calendarStore.svelte.js src/stores/calendarStore.svelte.js.local
cp src/stores/calendarsStore.svelte.js src/stores/calendarsStore.svelte.js.local

# Use API versions
cp src/stores/calendarStore.svelte.js.api src/stores/calendarStore.svelte.js
cp src/stores/calendarsStore.svelte.js.api src/stores/calendarsStore.svelte.js
```

#### Step 3: Run the Frontend

```bash
npm run dev
```

The frontend will now sync with the backend API!

## Switching Between Modes

### To LocalStorage Mode:
```bash
cp src/stores/calendarStore.svelte.js.local src/stores/calendarStore.svelte.js
cp src/stores/calendarsStore.svelte.js.local src/stores/calendarsStore.svelte.js
```

### To API Mode:
```bash
cp src/stores/calendarStore.svelte.js.api src/stores/calendarStore.svelte.js
cp src/stores/calendarsStore.svelte.js.api src/stores/calendarsStore.svelte.js
```

## Architecture

### LocalStorage Mode
```
Frontend (Svelte 5)
    └── Stores → localStorage
```

### API Mode
```
Frontend (Svelte 5)
    └── Stores → API Service → FastAPI Backend → SQLite Database
```

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

### Backend not connecting
- Ensure backend is running on `http://localhost:8000`
- Check console for CORS errors
- Verify API_BASE_URL in `src/services/api.js`

### Data not loading
- Check browser console for errors
- Verify backend is returning data: `http://localhost:8000/api/events`
- Check network tab in browser DevTools

### Performance issues
- API mode has network latency
- Consider caching strategies for production
- Use date range filtering for large datasets

## Production Deployment

For production use with API mode:

1. Deploy backend to a server (e.g., AWS, Heroku, DigitalOcean)
2. Update `API_BASE_URL` in `src/services/api.js`
3. Configure proper authentication
4. Use PostgreSQL instead of SQLite
5. Enable HTTPS
6. Implement rate limiting
7. Add user authentication and authorization

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Development
```bash
npm run dev
```

### Testing API
```bash
# Get all calendars
curl http://localhost:8000/api/calendars

# Get all events
curl http://localhost:8000/api/events

# Health check
curl http://localhost:8000/health
```

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
