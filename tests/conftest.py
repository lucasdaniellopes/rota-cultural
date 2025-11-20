import pytest
import os
import sys
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Set Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rota_cultural.core.settings")

import django
django.setup()

from django.test import TestCase
from rest_framework.test import APIClient
from factory import Factory, fuzzy
from decimal import Decimal


@pytest.fixture
def api_client():
    """Return an API client for making requests."""
    return APIClient()


@pytest.fixture(scope="function", autouse=True)
def enable_db_access_for_all_tests(db):
    """
    This fixture enables database access for all tests.
    It's automatically used for all test functions.
    """
    pass


@pytest.fixture
def sample_coordinates():
    """Return sample coordinates for Patos-PB region."""
    return {
        "praca_getulio": {"lat": Decimal("-7.026368"), "lng": Decimal("-37.277010")},
        "igreja_matriz": {"lat": Decimal("-7.027000"), "lng": Decimal("-37.276000")},
        "museu_cariri": {"lat": Decimal("-7.025000"), "lng": Decimal("-37.278000")},
        "centro_cultural": {"lat": Decimal("-7.026000"), "lng": Decimal("-37.277500")},
    }


@pytest.fixture
def osrm_route_response():
    """Mock OSRM route response."""
    return {
        "distance": 1250.5,  # meters
        "duration": 180,     # seconds
        "geometry": [
            [-37.277010, -7.026368],
            [-37.276500, -7.026700],
            [-37.276000, -7.027000]
        ]
    }


@pytest.fixture
def nominatim_forward_response():
    """Mock Nominatim forward geocoding response."""
    return [
        {
            "place_id": 123456,
            "lat": "-7.026368",
            "lon": "-37.277010",
            "display_name": "Praça Getúlio Vargas, Centro, Patos, Paraíba, Brasil",
            "class": "tourism",
            "type": "attraction",
            "importance": 0.75
        }
    ]


@pytest.fixture
def nominatim_reverse_response():
    """Mock Nominatim reverse geocoding response."""
    return {
        "place_id": 123456,
        "lat": "-7.026368",
        "lon": "-37.277010",
        "display_name": "Praça Getúlio Vargas, Centro, Patos, Paraíba, Brasil",
        "address": {
            "tourism": "Praça Getúlio Vargas",
            "suburb": "Centro",
            "city": "Patos",
            "state": "Paraíba",
            "country": "Brasil",
            "postcode": "58700-000"
        },
        "class": "tourism",
        "type": "attraction"
    }


# Factory Boy factories will be added here as we implement them
class LocationFactory(Factory):
    """Factory for Location model."""

    class Meta:
        model = None  # Will be set dynamically

    name = fuzzy.FuzzyChoice([
        "Praça Getúlio Vargas",
        "Igreja Matriz de Patos",
        "Museu do Cariri",
        "Centro Cultural",
        "Teatro Municipal"
    ])

    description = fuzzy.FuzzyText(length=50)
    latitude = fuzzy.FuzzyDecimal(-7.030000, -7.020000, 6)
    longitude = fuzzy.FuzzyDecimal(-37.280000, -37.270000, 6)


@pytest.fixture
def location_factory():
    """Return LocationFactory for creating test locations."""
    # Import here to avoid Django setup issues
    from rota_cultural.apps.locations.models import Location

    class TestLocationFactory(LocationFactory):
        class Meta:
            model = Location

    return TestLocationFactory


# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "unit: Unit tests (fast, no external dependencies)"
    )
    config.addinivalue_line(
        "markers", "integration: Integration tests (database, external APIs)"
    )
    config.addinivalue_line(
        "markers", "slow: Slow tests (external services, complex operations)"
    )
    config.addinivalue_line(
        "markers", "routing: Tests specific to routing functionality"
    )
    config.addinivalue_line(
        "markers", "geocoding: Tests specific to geocoding functionality"
    )
    config.addinivalue_line(
        "markers", "gis: Tests involving PostGIS spatial operations"
    )