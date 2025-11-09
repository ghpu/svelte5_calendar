import pytest
from fastapi import status

class TestCalendarsAPI:
    """Test suite for Calendars API endpoints"""

    def test_create_calendar(self, client, sample_calendar_data):
        """Test creating a new calendar"""
        response = client.post("/api/calendars", json=sample_calendar_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == sample_calendar_data["name"]
        assert data["color"] == sample_calendar_data["color"]
        assert data["visible"] == sample_calendar_data["visible"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_get_calendars_empty(self, client):
        """Test getting calendars when none exist"""
        response = client.get("/api/calendars")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    def test_get_calendars(self, client, sample_calendar_data):
        """Test getting all calendars"""
        # Create a calendar first
        create_response = client.post("/api/calendars", json=sample_calendar_data)
        created_calendar = create_response.json()

        # Get all calendars
        response = client.get("/api/calendars")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 1
        assert any(cal["id"] == created_calendar["id"] for cal in data)

    def test_get_calendar_by_id(self, client, sample_calendar_data):
        """Test getting a specific calendar by ID"""
        # Create a calendar first
        create_response = client.post("/api/calendars", json=sample_calendar_data)
        created_calendar = create_response.json()
        calendar_id = created_calendar["id"]

        # Get calendar by ID
        response = client.get(f"/api/calendars/{calendar_id}")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == calendar_id
        assert data["name"] == sample_calendar_data["name"]

    def test_get_nonexistent_calendar(self, client):
        """Test getting a calendar that doesn't exist"""
        response = client.get("/api/calendars/nonexistent-id")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_calendar(self, client, sample_calendar_data):
        """Test updating a calendar"""
        # Create a calendar first
        create_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = create_response.json()["id"]

        # Update calendar
        update_data = {"name": "Updated Calendar", "color": "#00ff00"}
        response = client.put(f"/api/calendars/{calendar_id}", json=update_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Updated Calendar"
        assert data["color"] == "#00ff00"

    def test_update_nonexistent_calendar(self, client):
        """Test updating a calendar that doesn't exist"""
        update_data = {"name": "Updated Calendar"}
        response = client.put("/api/calendars/nonexistent-id", json=update_data)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_calendar(self, client, sample_calendar_data):
        """Test deleting a calendar"""
        # Create a calendar first
        create_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = create_response.json()["id"]

        # Delete calendar
        response = client.delete(f"/api/calendars/{calendar_id}")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.json()

        # Verify it's deleted
        get_response = client.get(f"/api/calendars/{calendar_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_nonexistent_calendar(self, client):
        """Test deleting a calendar that doesn't exist"""
        response = client.delete("/api/calendars/nonexistent-id")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_calendar_visibility_toggle(self, client, sample_calendar_data):
        """Test toggling calendar visibility"""
        # Create a visible calendar
        create_response = client.post("/api/calendars", json=sample_calendar_data)
        calendar_id = create_response.json()["id"]

        # Toggle to invisible
        response = client.put(f"/api/calendars/{calendar_id}", json={"visible": False})

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["visible"] is False

    def test_create_calendar_validation(self, client):
        """Test calendar creation with invalid data"""
        invalid_data = {"color": "#ff0000"}  # Missing required 'name' field
        response = client.post("/api/calendars", json=invalid_data)

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
