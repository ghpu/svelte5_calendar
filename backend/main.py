from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import events, calendars
import uuid

app = FastAPI(
    title="Calendar API",
    description="REST API for Svelte 5 Calendar Application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
def startup_event():
    init_db()
    print("Database initialized")

    # Create default calendars if none exist
    from database import SessionLocal
    from models import Calendar
    db = SessionLocal()
    try:
        calendar_count = db.query(Calendar).count()
        if calendar_count == 0:
            default_calendars = [
                Calendar(
                    id=str(uuid.uuid4()),
                    name="My Calendar",
                    color="#3b82f6",
                    visible=True,
                    is_default=True
                ),
                Calendar(
                    id=str(uuid.uuid4()),
                    name="Work",
                    color="#10b981",
                    visible=True,
                    is_default=False
                ),
                Calendar(
                    id=str(uuid.uuid4()),
                    name="Personal",
                    color="#f59e0b",
                    visible=True,
                    is_default=False
                ),
                Calendar(
                    id=str(uuid.uuid4()),
                    name="Family",
                    color="#ec4899",
                    visible=True,
                    is_default=False
                )
            ]
            db.add_all(default_calendars)
            db.commit()
            print("Default calendars created")
    finally:
        db.close()

# Include routers
app.include_router(events.router)
app.include_router(calendars.router)

@app.get("/")
def root():
    return {
        "message": "Calendar API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
