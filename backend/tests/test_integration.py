import pytest
from fastapi import status

class TestIntegration:
    """Integration tests for complete workflows"""

    def test_full_calendar_workflow(self, client, sample_calendar_data):
        """Test complete calendar CRUD workflow"""
        # Create calendar
        create_response = client.post("/api/calendars", json=sample_calendar_data)
        assert create_response.status_code == status.HTTP_200_OK
        calendar_id = create_response.json()["id"]

        # Read calendar
        get_response = client.get(f"/api/calendars/{calendar_id}")
        assert get_response.status_code == status.HTTP_200_OK
        assert get_response.json()["name"] == sample_calendar_data["name"]

        # Update calendar
        update_data = {"name": "Updated Calendar"}
        update_response = client.put(f"/api/calendars/{calendar_id}", json=update_data)
        assert update_response.status_code == status.HTTP_200_OK
        assert update_response.json()["name"] == "Updated Calendar"

        # Delete calendar
        delete_response = client.delete(f"/api/calendars/{calendar_id}")
        assert delete_response.status_code == status.HTTP_200_OK

        # Verify deletion
        get_after_delete = client.get(f"/api/calendars/{calendar_id}")
        assert get_after_delete.status_code == status.HTTP_404_NOT_FOUND

    def test_full_event_workflow(self, client, sample_calendar_data, sample_event_data):
        """Test complete event CRUD workflow"""
        # Create calendar first
        calendar_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = calendar_response.json()["id"]

        # Create event
        sample_event_data["calendar_id"] = calendar_id
        create_response = client.post("/api/events", json=sample_event_data)
        assert create_response.status_code == status.HTTP_200_OK
        event_id = create_response.json()["id"]

        # Read event
        get_response = client.get(f"/api/events/{event_id}")
        assert get_response.status_code == status.HTTP_200_OK
        assert get_response.json()["title"] == sample_event_data["title"]

        # Update event
        update_data = {"title": "Updated Event", "priority": "high"}
        update_response = client.put(f"/api/events/{event_id}", json=update_data)
        assert update_response.status_code == status.HTTP_200_OK
        assert update_response.json()["title"] == "Updated Event"
        assert update_response.json()["priority"] == "high"

        # Delete event
        delete_response = client.delete(f"/api/events/{event_id}")
        assert delete_response.status_code == status.HTTP_200_OK

        # Verify deletion
        get_after_delete = client.get(f"/api/events/{event_id}")
        assert get_after_delete.status_code == status.HTTP_404_NOT_FOUND

    def test_calendar_with_multiple_events(self, client, sample_calendar_data, sample_event_data):
        """Test calendar with multiple events"""
        # Create calendar
        calendar_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = calendar_response.json()["id"]

        # Create multiple events
        event_ids = []
        for i in range(5):
            event_data = sample_event_data.copy()
            event_data["calendar_id"] = calendar_id
            event_data["title"] = f"Event {i+1}"
            response = client.post("/api/events", json=event_data)
            assert response.status_code == status.HTTP_200_OK
            event_ids.append(response.json()["id"])

        # Get all events and verify count
        events_response = client.get("/api/events")
        assert events_response.status_code == status.HTTP_200_OK
        events = events_response.json()
        assert len(events) >= 5

    def test_recurring_event_creation(self, client, sample_calendar_data, sample_event_data):
        """Test creating recurring event with different patterns"""
        # Create calendar
        calendar_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = calendar_response.json()["id"]

        recurrence_types = ["daily", "weekly", "monthly", "yearly"]

        for rec_type in recurrence_types:
            event_data = sample_event_data.copy()
            event_data["calendar_id"] = calendar_id
            event_data["title"] = f"Recurring {rec_type}"
            event_data["recurrence"] = {
                "type": rec_type,
                "endDate": "2025-12-31T23:59:59"
            }

            response = client.post("/api/events", json=event_data)
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["recurrence"]["type"] == rec_type

    def test_multiple_calendars_visibility(self, client, sample_calendar_data, sample_event_data):
        """Test managing multiple calendars with visibility"""
        # Create multiple calendars
        calendar_ids = []
        for i in range(3):
            cal_data = sample_calendar_data.copy()
            cal_data["name"] = f"Calendar {i+1}"
            cal_data["color"] = f"#ff{i}{i}00"
            response = client.post("/api/calendars", json=cal_data)
            calendar_ids.append(response.json()["id"])

        # Add events to different calendars
        for i, cal_id in enumerate(calendar_ids):
            event_data = sample_event_data.copy()
            event_data["calendar_id"] = cal_id
            event_data["title"] = f"Event in Calendar {i+1}"
            client.post("/api/events", json=event_data)

        # Toggle visibility on one calendar
        client.put(f"/api/calendars/{calendar_ids[0]}", json={"visible": False})

        # Verify calendar visibility
        cal_response = client.get(f"/api/calendars/{calendar_ids[0]}")
        assert cal_response.json()["visible"] is False

    def test_event_date_range_filtering(self, client, sample_calendar_data, sample_event_data):
        """Test filtering events by date range"""
        # Create calendar
        calendar_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = calendar_response.json()["id"]

        # Create events across different months
        dates = [
            ("2025-11-15T10:00:00", "2025-11-15T11:00:00"),
            ("2025-12-15T10:00:00", "2025-12-15T11:00:00"),
            ("2026-01-15T10:00:00", "2026-01-15T11:00:00"),
        ]

        for start, end in dates:
            event_data = sample_event_data.copy()
            event_data["calendar_id"] = calendar_id
            event_data["start_date"] = start
            event_data["end_date"] = end
            client.post("/api/events", json=event_data)

        # Filter for November events only
        response = client.get(
            "/api/events",
            params={
                "start_date": "2025-11-01T00:00:00",
                "end_date": "2025-11-30T23:59:59"
            }
        )

        assert response.status_code == status.HTTP_200_OK
        events = response.json()
        # Should get at least the November event
        assert len([e for e in events if "2025-11" in e["start_date"]]) >= 1

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "healthy"

    def test_root_endpoint(self, client):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "version" in data
