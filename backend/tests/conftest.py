import pytest
import os
import sys
from decimal import Decimal
from unittest.mock import Mock, MagicMock
import requests

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rota_cultural.core.settings")

import django
django.setup()


@pytest.fixture
def sample_location_data():
    return {
        "name": "Praça Getúlio Vargas",
        "description": "Praça central da cidade de Patos-PB",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }


@pytest.fixture
def sample_geocoding_response():
    return [
        {
            "place_id": 123456,
            "licence": "Data © OpenStreetMap contributors",
            "osm_type": "node",
            "osm_id": 456789,
            "boundingbox": ["-7.026468", "-7.026268", "-37.277110", "-37.276910"],
            "lat": "-7.026368",
            "lon": "-37.277010",
            "display_name": "Praça Getúlio Vargas, Patos, Região Geográfica Imediata de Patos, Região Geográfica Intermediária de Campina Grande, Paraíba, Região Nordeste, Brasil",
            "class": "tourism",
            "type": "attraction",
            "importance": 0.701,
            "icon": "https://nominatim.openstreetmap.org/images/mapicons/points_of_interest_tourist_attraction.p.20.png"
        }
    ]


@pytest.fixture
def sample_osrm_route_response():
    mock_route = Mock()
    mock_route.distance = 1250.5
    mock_route.duration = 180
    mock_route.geometry = [
        [-37.277010, -7.026368],
        [-37.276500, -7.026700],
        [-37.276000, -7.027000]
    ]
    return mock_route


@pytest.fixture
def mock_nominatim_search():
    with pytest.fixture.monkeypatch.context() as m:
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = sample_geocoding_response()
        mock_response.raise_for_status.return_value = None

        def mock_get(*args, **kwargs):
            return mock_response

        m.setattr("requests.get", mock_get)
        yield mock_response


@pytest.fixture
def mock_osrm_directions():
    with pytest.fixture.monkeypatch.context() as m:
        mock_route = sample_osrm_route_response()

        def mock_directions(*args, **kwargs):
            return [mock_route]

        mock_router = Mock()
        mock_router.directions = mock_directions

        m.setattr("routingpy.routers.OSRM", lambda *args, **kwargs: mock_router)
        yield mock_route


@pytest.fixture
def multiple_test_locations():
    from rota_cultural.apps.locations.models import Location

    locations = []
    for i in range(20):
        location = Location.objects.create(
            name=f"Location {i}",
            description=f"Test location number {i}",
            latitude=Decimal(f"-7.02{i%10}000"),
            longitude=Decimal(f"-37.27{i%10}000")
        )
        locations.append(location)

    return locations


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_api_client():
    from rest_framework.test import APIClient
    client = APIClient()
    return client


class MockResponse:

    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code
        self.text = str(json_data)

    def json(self):
        return self.json_data

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.exceptions.HTTPError(f"HTTP {self.status_code}")


@pytest.fixture
def mock_requests():
    with pytest.fixture.monkeypatch.context() as m:
        mock_get = Mock()
        m.setattr("requests.get", mock_get)
        yield mock_get


def pytest_configure(config):
    config.addinivalue_line(
        "markers", "api: mark test as API test"
    )
    config.addinivalue_line(
        "markers", "external_api: mark test as external API integration test"
    )
    config.addinivalue_line(
        "markers", "performance: mark test as performance test"
    )
    config.addinivalue_line(
        "markers", "security: mark test as security test"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )


def create_test_location(**kwargs):
    from rota_cultural.apps.locations.models import Location

    defaults = {
        "name": "Test Location",
        "description": "Test description",
        "latitude": Decimal("-7.026368"),
        "longitude": Decimal("-37.277010")
    }
    defaults.update(kwargs)

    return Location.objects.create(**defaults)


def create_test_route(waypoints):
    from rota_cultural.apps.routing.models import Route

    return Route.objects.create(
        name="Test Route",
        description="Test route description",
        waypoints=waypoints,
        distance=1000.0,
        duration=120,
        geometry=[[-37.277, -7.026], [-37.276, -7.027]]
    )


def assert_valid_geojson(geometry):
    assert isinstance(geometry, list)
    assert len(geometry) >= 2

    for point in geometry:
        assert isinstance(point, list)
        assert len(point) == 2
        assert isinstance(point[0], (int, float))
        assert isinstance(point[1], (int, float))
        assert -180 <= point[0] <= 180
        assert -90 <= point[1] <= 90


def assert_valid_coordinates(lat, lon):
    assert isinstance(lat, (Decimal, float, int, str))
    assert isinstance(lon, (Decimal, float, int, str))

    lat_float = float(lat)
    lon_float = float(lon)

    assert -90 <= lat_float <= 90
    assert -180 <= lon_float <= 180


class PerformanceProfiler:

    def __init__(self):
        self.start_time = None
        self.end_time = None

    def start(self):
        import time
        self.start_time = time.time()

    def stop(self):
        import time
        self.end_time = time.time()

    @property
    def duration(self):
        if self.start_time and self.end_time:
            return self.end_time - self.start_time
        return None

    def assert_max_duration(self, max_seconds):
        assert self.duration is not None, "Profiler not properly started/stopped"
        assert self.duration < max_seconds, f"Operation took {self.duration}s, expected < {max_seconds}s"


@pytest.fixture
def profiler():
    return PerformanceProfiler()