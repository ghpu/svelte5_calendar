from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Calendar Schemas
class CalendarBase(BaseModel):
    name: str
    color: str
    visible: bool = True
    is_default: bool = False

class CalendarCreate(CalendarBase):
    pass

class CalendarUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    visible: Optional[bool] = None

class Calendar(CalendarBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Event Schemas
class RecurrenceRule(BaseModel):
    type: str  # 'none', 'daily', 'weekly', 'monthly', 'yearly'
    endDate: Optional[str] = None

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: str  # ISO format datetime string
    end_date: str    # ISO format datetime string
    location: Optional[str] = None
    calendar_id: str
    category: str
    status: str = "confirmed"
    priority: str = "medium"
    is_all_day: bool = False
    reminder: str = "none"
    attendees: List[str] = []
    recurrence: Optional[RecurrenceRule] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    calendar_id: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    is_all_day: Optional[bool] = None
    reminder: Optional[str] = None
    attendees: Optional[List[str]] = None
    recurrence: Optional[RecurrenceRule] = None

class Event(EventBase):
    id: str
    is_exception: bool = False
    is_deleted: bool = False
    original_event_id: Optional[str] = None
    exception_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
