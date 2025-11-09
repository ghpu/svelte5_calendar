from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Calendar(Base):
    __tablename__ = "calendars"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)
    visible = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    events = relationship("Event", back_populates="calendar")

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    location = Column(String, nullable=True)
    calendar_id = Column(String, ForeignKey("calendars.id"), nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="confirmed")
    priority = Column(String, default="medium")
    is_all_day = Column(Boolean, default=False)
    reminder = Column(String, default="none")
    attendees = Column(JSON, default=list)  # Store as JSON array
    recurrence = Column(JSON, nullable=True)  # Store recurrence rules as JSON
    is_exception = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    original_event_id = Column(String, nullable=True)
    exception_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    calendar = relationship("Calendar", back_populates="events")
