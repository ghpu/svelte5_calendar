import pytest
from fastapi import status

class TestEventsAPI:
    """Test suite for Events API endpoints"""

    @pytest.fixture(autouse=True)
    def setup(self, client, sample_calendar_data):
        """Create a calendar for event tests"""
        response = client.post("/api/calendars", json=sample_calendar_data)
        self.calendar_id = response.json()["id"]

    def test_create_event(self, client, sample_event_data):
        """Test creating a new event"""
        sample_event_data["calendar_id"] = self.calendar_id
        response = client.post("/api/events", json=sample_event_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == sample_event_data["title"]
        assert data["description"] == sample_event_data["description"]
        assert data["calendar_id"] == self.calendar_id
        assert "id" in data
        assert "created_at" in data

    def test_create_recurring_event(self, client, sample_event_data):
        """Test creating a recurring event"""
        sample_event_data["calendar_id"] = self.calendar_id
        sample_event_data["recurrence"] = {
            "type": "weekly",
            "endDate": "2025-12-31T23:59:59"
        }

        response = client.post("/api/events", json=sample_event_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["recurrence"] is not None
        assert data["recurrence"]["type"] == "weekly"

    def test_get_events(self, client, sample_event_data):
        """Test getting all events"""
        sample_event_data["calendar_id"] = self.calendar_id

        # Create an event first
        create_response = client.post("/api/events", json=sample_event_data)
        created_event = create_response.json()

        # Get all events
        response = client.get("/api/events")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert any(event["id"] == created_event["id"] for event in data)

    def test_get_event_by_id(self, client, sample_event_data):
        """Test getting a specific event by ID"""
        sample_event_data["calendar_id"] = self.calendar_id

        # Create an event first
        create_response = client.post("/api/events", json=sample_event_data)
        event_id = create_response.json()["id"]

        # Get event by ID
        response = client.get(f"/api/events/{event_id}")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == event_id
        assert data["title"] == sample_event_data["title"]

    def test_get_nonexistent_event(self, client):
        """Test getting an event that doesn't exist"""
        response = client.get("/api/events/nonexistent-id")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_event(self, client, sample_event_data):
        """Test updating an event"""
        sample_event_data["calendar_id"] = self.calendar_id

        # Create an event first
        create_response = client.post("/api/events", json=sample_event_data)
        event_id = create_response.json()["id"]

        # Update event
        update_data = {
            "title": "Updated Event",
            "description": "Updated Description"
        }
        response = client.put(f"/api/events/{event_id}", json=update_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == "Updated Event"
        assert data["description"] == "Updated Description"

    def test_update_nonexistent_event(self, client):
        """Test updating an event that doesn't exist"""
        update_data = {"title": "Updated Event"}
        response = client.put("/api/events/nonexistent-id", json=update_data)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_event(self, client, sample_event_data):
        """Test deleting an event"""
        sample_event_data["calendar_id"] = self.calendar_id

        # Create an event first
        create_response = client.post("/api/events", json=sample_event_data)
        event_id = create_response.json()["id"]

        # Delete event
        response = client.delete(f"/api/events/{event_id}")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.json()

        # Verify it's deleted
        get_response = client.get(f"/api/events/{event_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_nonexistent_event(self, client):
        """Test deleting an event that doesn't exist"""
        response = client.delete("/api/events/nonexistent-id")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_events_by_date_range(self, client, sample_event_data):
        """Test filtering events by date range"""
        sample_event_data["calendar_id"] = self.calendar_id

        # Create an event
        client.post("/api/events", json=sample_event_data)

        # Get events within date range
        response = client.get(
            "/api/events",
            params={
                "start_date": "2025-11-01T00:00:00",
                "end_date": "2025-11-30T23:59:59"
            }
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_create_all_day_event(self, client, sample_event_data):
        """Test creating an all-day event"""
        sample_event_data["calendar_id"] = self.calendar_id
        sample_event_data["is_all_day"] = True

        response = client.post("/api/events", json=sample_event_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["is_all_day"] is True

    def test_event_with_attendees(self, client, sample_event_data):
        """Test creating an event with multiple attendees"""
        sample_event_data["calendar_id"] = self.calendar_id
        sample_event_data["attendees"] = [
            "user1@example.com",
            "user2@example.com",
            "user3@example.com"
        ]

        response = client.post("/api/events", json=sample_event_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["attendees"]) == 3
        assert "user1@example.com" in data["attendees"]

    def test_event_priority_levels(self, client, sample_event_data):
        """Test creating events with different priority levels"""
        sample_event_data["calendar_id"] = self.calendar_id

        for priority in ["low", "medium", "high"]:
            sample_event_data["priority"] = priority
            sample_event_data["title"] = f"Event {priority}"

            response = client.post("/api/events", json=sample_event_data)

            assert response.status_code == status.HTTP_200_OK
            assert response.json()["priority"] == priority

    def test_event_validation(self, client):
        """Test event creation with invalid data"""
        invalid_data = {"title": "Test"}  # Missing required fields
        response = client.post("/api/events", json=invalid_data)

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_event_categories(self, client, sample_event_data):
        """Test events with different categories"""
        sample_event_data["calendar_id"] = self.calendar_id

        categories = ["work", "personal", "meeting", "appointment", "holiday", "birthday", "other"]

        for category in categories:
            sample_event_data["category"] = category
            sample_event_data["title"] = f"Event {category}"

            response = client.post("/api/events", json=sample_event_data)

            assert response.status_code == status.HTTP_200_OK
            assert response.json()["category"] == category
