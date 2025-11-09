import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
import models

# Test database URL
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    # Create test database engine
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
    )

    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Create session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    yield TestingSessionLocal

    # Drop all tables after test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with a fresh database"""
    def override_get_db():
        try:
            db = test_db()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

@pytest.fixture
def sample_calendar_data():
    """Sample calendar data for testing"""
    return {
        "name": "Test Calendar",
        "color": "#ff0000",
        "visible": True,
        "is_default": False
    }

@pytest.fixture
def sample_event_data():
    """Sample event data for testing"""
    return {
        "title": "Test Event",
        "description": "Test Description",
        "start_date": "2025-11-15T10:00:00",
        "end_date": "2025-11-15T11:00:00",
        "location": "Test Location",
        "calendar_id": "",  # Will be filled in tests
        "category": "work",
        "status": "confirmed",
        "priority": "medium",
        "is_all_day": False,
        "reminder": "none",
        "attendees": ["test@example.com"]
    }
