from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas
import crud
from database import get_db

router = APIRouter(
    prefix="/api/calendars",
    tags=["calendars"]
)

@router.get("/", response_model=List[schemas.Calendar])
def read_calendars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all calendars"""
    calendars = crud.get_calendars(db, skip=skip, limit=limit)
    return calendars

@router.get("/{calendar_id}", response_model=schemas.Calendar)
def read_calendar(calendar_id: str, db: Session = Depends(get_db)):
    """Get a specific calendar by ID"""
    db_calendar = crud.get_calendar(db, calendar_id=calendar_id)
    if db_calendar is None:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return db_calendar

@router.post("/", response_model=schemas.Calendar)
def create_calendar(calendar: schemas.CalendarCreate, db: Session = Depends(get_db)):
    """Create a new calendar"""
    return crud.create_calendar(db=db, calendar=calendar)

@router.put("/{calendar_id}", response_model=schemas.Calendar)
def update_calendar(
    calendar_id: str,
    calendar: schemas.CalendarUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing calendar"""
    db_calendar = crud.update_calendar(db, calendar_id=calendar_id, calendar=calendar)
    if db_calendar is None:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return db_calendar

@router.delete("/{calendar_id}")
def delete_calendar(calendar_id: str, db: Session = Depends(get_db)):
    """Delete a calendar"""
    success = crud.delete_calendar(db, calendar_id=calendar_id)
    if not success:
        raise HTTPException(status_code=404, detail="Calendar not found")
    return {"message": "Calendar deleted successfully"}
