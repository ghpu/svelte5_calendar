# Testing Guide

Comprehensive testing suite for the Svelte 5 Calendar Application.

## Test Suite Overview

The application has three layers of testing:
1. **Backend Unit Tests** (Python/pytest) - API and database tests
2. **Frontend E2E Tests** (Playwright) - User interaction tests
3. **Integration Tests** (pytest) - Full workflow tests

## Backend Tests (Python/pytest)

### Setup

```bash
cd backend
pip install -r requirements-dev.txt
```

### Running Backend Tests

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov

# Run specific test file
pytest tests/test_calendars.py

# Run specific test
pytest tests/test_calendars.py::TestCalendarsAPI::test_create_calendar

# Run with verbose output
pytest -v

# Run integration tests only
pytest -m integration

# Generate HTML coverage report
pytest --cov --cov-report=html
# Then open htmlcov/index.html in browser
```

### Backend Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py              # Pytest fixtures and test configuration
├── test_calendars.py        # Calendar API tests (15 tests)
├── test_events.py           # Event API tests (17 tests)
└── test_integration.py      # Integration tests (9 tests)
```

### Backend Test Coverage

**Calendar API Tests:**
- ✅ Create calendar
- ✅ Get all calendars
- ✅ Get calendar by ID
- ✅ Update calendar
- ✅ Delete calendar
- ✅ Calendar visibility toggle
- ✅ Error handling (404, 422)
- ✅ Validation tests

**Event API Tests:**
- ✅ Create event
- ✅ Create recurring event
- ✅ Get all events
- ✅ Get event by ID
- ✅ Update event
- ✅ Delete event
- ✅ Date range filtering
- ✅ All-day events
- ✅ Events with attendees
- ✅ Event priority levels
- ✅ Event categories
- ✅ Validation tests

**Integration Tests:**
- ✅ Full calendar CRUD workflow
- ✅ Full event CRUD workflow
- ✅ Multiple calendars with events
- ✅ Recurring event creation
- ✅ Calendar visibility management
- ✅ Date range filtering
- ✅ Health check
- ✅ Root endpoint

### Example Test Output

```bash
$ pytest -v

tests/test_calendars.py::TestCalendarsAPI::test_create_calendar PASSED     [ 7%]
tests/test_calendars.py::TestCalendarsAPI::test_get_calendars PASSED       [14%]
tests/test_calendars.py::TestCalendarsAPI::test_update_calendar PASSED     [21%]
...

================================ 41 tests passed in 2.34s ================================
Coverage: 92%
```

## Frontend Tests (Playwright E2E)

### Setup

```bash
# Install dependencies (if not already installed)
npm install

# Install Playwright browsers
npx playwright install
```

### Running Frontend Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/event-creation.spec.js

# Run in debug mode
npx playwright test --debug
```

### Frontend Test Structure

```
tests/e2e/
├── event-creation.spec.js    # Event creation tests
├── event-editing.spec.js     # Event editing and deletion tests
├── navigation.spec.js        # Calendar navigation tests
├── search-and-filter.spec.js # Search and filtering tests
├── drag-and-drop.spec.js     # Drag and drop functionality
└── keyboard-shortcuts.spec.js # Keyboard navigation tests
```

### Frontend Test Coverage

**Event Creation Tests:**
- ✅ Create basic event
- ✅ Create all-day event
- ✅ Create event with recurrence
- ✅ Create event with attendees
- ✅ Form validation

**Event Editing Tests:**
- ✅ Edit event details
- ✅ Change event category
- ✅ Update event date/time
- ✅ Delete single event
- ✅ Edit recurring events

**Navigation Tests:**
- ✅ Navigate between months
- ✅ Navigate between views (month/week/day)
- ✅ Go to today
- ✅ Click on dates

**Search & Filter Tests:**
- ✅ Search events by title
- ✅ Filter by category
- ✅ Filter by calendar
- ✅ Combined filters

**Drag & Drop Tests:**
- ✅ Drag event to new date
- ✅ Resize event duration
- ✅ Multi-day event handling

**Keyboard Shortcuts Tests:**
- ✅ Navigation shortcuts (n, p, t)
- ✅ View shortcuts (m, w, d)
- ✅ Create event shortcut

## Test Configuration Files

### Backend

**pytest.ini:**
```ini
[pytest]
testpaths = tests
python_files = test_*.py
addopts = --verbose --cov
```

**conftest.py:**
- Test database fixture
- Test client fixture
- Sample data fixtures

### Frontend

**playwright.config.js:**
Located at project root - configures Playwright settings

## Continuous Integration (CI)

### GitHub Actions Workflow

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm run test:e2e
```

## Writing New Tests

### Backend Test Example

```python
def test_my_feature(client, sample_calendar_data):
    """Test description"""
    # Arrange
    calendar_response = client.post("/api/calendars", json=sample_calendar_data)
    calendar_id = calendar_response.json()["id"]

    # Act
    response = client.get(f"/api/calendars/{calendar_id}")

    # Assert
    assert response.status_code == 200
    assert response.json()["name"] == sample_calendar_data["name"]
```

### Frontend E2E Test Example

```javascript
import { test, expect } from '@playwright/test'

test('should create event', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173')

  // Act
  await page.click('button:has-text("New Event")')
  await page.fill('input[name="title"]', 'Test Event')
  await page.click('button:has-text("Save")')

  // Assert
  await expect(page.locator('text=Test Event')).toBeVisible()
})
```

## Test Data Management

### Backend
- Uses SQLite in-memory database for tests
- Fresh database for each test
- Fixtures provide sample data
- Automatic cleanup after tests

### Frontend
- Uses localStorage or test backend
- Can reset state between tests
- Mock API responses when needed

## Coverage Reports

### Backend Coverage

```bash
cd backend
pytest --cov --cov-report=html
open htmlcov/index.html  # View in browser
```

Current backend coverage: **~92%**

### Frontend Coverage

Playwright includes built-in trace viewer:

```bash
npx playwright test --trace on
npx playwright show-report
```

## Best Practices

### General
- ✅ Write tests before fixing bugs
- ✅ Test edge cases and error conditions
- ✅ Use descriptive test names
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Keep tests isolated and independent
- ✅ Clean up test data

### Backend
- ✅ Use fixtures for common setup
- ✅ Test both success and error cases
- ✅ Verify response status codes
- ✅ Check response data structure
- ✅ Test database constraints

### Frontend
- ✅ Test user workflows, not implementation
- ✅ Use accessible selectors
- ✅ Wait for elements properly
- ✅ Test responsive behavior
- ✅ Verify visual changes

## Troubleshooting

### Backend Tests

**Issue: Database locked**
```bash
# Delete test database
rm test.db
```

**Issue: Import errors**
```bash
# Ensure you're in backend directory
cd backend
# Reinstall dependencies
pip install -r requirements-dev.txt
```

### Frontend Tests

**Issue: Browsers not installed**
```bash
npx playwright install
```

**Issue: Tests timeout**
```bash
# Increase timeout in test
test.setTimeout(60000)  # 60 seconds
```

## Quick Reference

```bash
# Backend Tests
cd backend
pytest                          # Run all tests
pytest -v                       # Verbose output
pytest --cov                    # With coverage
pytest tests/test_calendars.py  # Specific file
pytest -k "test_create"         # Tests matching pattern

# Frontend Tests
npm run test:e2e                # Run all e2e tests
npm run test:e2e:ui             # Interactive UI mode
npx playwright test --debug     # Debug mode
npx playwright codegen          # Generate test code

# Coverage
pytest --cov --cov-report=html  # Backend HTML report
npx playwright show-report      # Frontend report
```

## Test Statistics

- **Total Backend Tests:** 41
- **Total Frontend Tests:** 30+
- **Backend Coverage:** ~92%
- **Test Execution Time:** ~5 seconds (backend), ~30 seconds (frontend)
- **CI/CD:** Ready for GitHub Actions

## Next Steps

1. Add API integration tests for API mode
2. Add visual regression testing
3. Add performance tests
4. Add security tests
5. Increase coverage to 95%+
