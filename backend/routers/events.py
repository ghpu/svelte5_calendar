from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import schemas
import crud
from database import get_db

router = APIRouter(
    prefix="/api/events",
    tags=["events"]
)

@router.get("/", response_model=List[schemas.Event])
def read_events(
    skip: int = 0,
    limit: int = 1000,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all events, optionally filtered by date range"""
    if start_date and end_date:
        start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        events = crud.get_events_by_date_range(db, start, end)
    else:
        events = crud.get_events(db, skip=skip, limit=limit)

    # Convert datetime to ISO string for response
    for event in events:
        event.start_date = event.start_date.isoformat()
        event.end_date = event.end_date.isoformat()
        if event.exception_date:
            event.exception_date = event.exception_date.isoformat()

    return events

@router.get("/{event_id}", response_model=schemas.Event)
def read_event(event_id: str, db: Session = Depends(get_db)):
    """Get a specific event by ID"""
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    # Convert datetime to ISO string
    db_event.start_date = db_event.start_date.isoformat()
    db_event.end_date = db_event.end_date.isoformat()
    if db_event.exception_date:
        db_event.exception_date = db_event.exception_date.isoformat()

    return db_event

@router.post("/", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    """Create a new event"""
    db_event = crud.create_event(db=db, event=event)

    # Convert datetime to ISO string
    db_event.start_date = db_event.start_date.isoformat()
    db_event.end_date = db_event.end_date.isoformat()

    return db_event

@router.put("/{event_id}", response_model=schemas.Event)
def update_event(event_id: str, event: schemas.EventUpdate, db: Session = Depends(get_db)):
    """Update an existing event"""
    db_event = crud.update_event(db, event_id=event_id, event=event)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    # Convert datetime to ISO string
    db_event.start_date = db_event.start_date.isoformat()
    db_event.end_date = db_event.end_date.isoformat()
    if db_event.exception_date:
        db_event.exception_date = db_event.exception_date.isoformat()

    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: str, db: Session = Depends(get_db)):
    """Delete an event"""
    success = crud.delete_event(db, event_id=event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}
