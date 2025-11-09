from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
import models
import schemas
import uuid

# Calendar CRUD operations
def get_calendars(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Calendar).offset(skip).limit(limit).all()

def get_calendar(db: Session, calendar_id: str):
    return db.query(models.Calendar).filter(models.Calendar.id == calendar_id).first()

def create_calendar(db: Session, calendar: schemas.CalendarCreate):
    db_calendar = models.Calendar(
        id=str(uuid.uuid4()),
        **calendar.model_dump()
    )
    db.add(db_calendar)
    db.commit()
    db.refresh(db_calendar)
    return db_calendar

def update_calendar(db: Session, calendar_id: str, calendar: schemas.CalendarUpdate):
    db_calendar = get_calendar(db, calendar_id)
    if db_calendar:
        update_data = calendar.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_calendar, key, value)
        db_calendar.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_calendar)
    return db_calendar

def delete_calendar(db: Session, calendar_id: str):
    db_calendar = get_calendar(db, calendar_id)
    if db_calendar:
        db.delete(db_calendar)
        db.commit()
        return True
    return False

# Event CRUD operations
def get_events(db: Session, skip: int = 0, limit: int = 1000):
    return db.query(models.Event).filter(models.Event.is_deleted == False).offset(skip).limit(limit).all()

def get_events_by_date_range(db: Session, start_date: datetime, end_date: datetime):
    return db.query(models.Event).filter(
        and_(
            models.Event.is_deleted == False,
            models.Event.start_date <= end_date,
            models.Event.end_date >= start_date
        )
    ).all()

def get_event(db: Session, event_id: str):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def create_event(db: Session, event: schemas.EventCreate):
    # Convert ISO string dates to datetime objects
    start_date = datetime.fromisoformat(event.start_date.replace('Z', '+00:00'))
    end_date = datetime.fromisoformat(event.end_date.replace('Z', '+00:00'))

    event_dict = event.model_dump()
    event_dict['start_date'] = start_date
    event_dict['end_date'] = end_date

    # Convert recurrence to dict if it exists
    if event_dict.get('recurrence'):
        event_dict['recurrence'] = event_dict['recurrence']

    db_event = models.Event(
        id=str(uuid.uuid4()),
        **event_dict
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: str, event: schemas.EventUpdate):
    db_event = get_event(db, event_id)
    if db_event:
        update_data = event.model_dump(exclude_unset=True)

        # Convert date strings to datetime objects if present
        if 'start_date' in update_data:
            update_data['start_date'] = datetime.fromisoformat(update_data['start_date'].replace('Z', '+00:00'))
        if 'end_date' in update_data:
            update_data['end_date'] = datetime.fromisoformat(update_data['end_date'].replace('Z', '+00:00'))

        for key, value in update_data.items():
            setattr(db_event, key, value)

        db_event.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: str):
    db_event = get_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False

def mark_event_as_deleted(db: Session, event_id: str):
    """Soft delete for recurring events"""
    db_event = get_event(db, event_id)
    if db_event:
        db_event.is_deleted = True
        db_event.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_event)
        return db_event
    return None

def create_event_exception(db: Session, parent_event_id: str, exception_date: datetime, updated_data: dict):
    """Create an exception for a recurring event"""
    db_event = models.Event(
        id=str(uuid.uuid4()),
        is_exception=True,
        original_event_id=parent_event_id,
        exception_date=exception_date,
        **updated_data
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
