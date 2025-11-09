# Backend Tests

Comprehensive test suite for the FastAPI backend.

## Quick Start

```bash
# Install test dependencies
pip install -r requirements-dev.txt

# Run all tests
pytest

# Run with coverage
pytest --cov

# Run specific test file
pytest test_calendars.py
```

## Test Files

- `conftest.py` - Test fixtures and configuration
- `test_calendars.py` - Calendar API tests (15 tests)
- `test_events.py` - Event API tests (17 tests)
- `test_integration.py` - Integration tests (9 tests)

## Total Tests: 41

## Coverage: ~92%

See [TESTING.md](../../TESTING.md) for full documentation.
