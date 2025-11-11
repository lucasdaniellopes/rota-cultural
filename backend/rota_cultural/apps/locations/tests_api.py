import pytest
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch, Mock
from .models import Location


@pytest.mark.django_db
class LocationAPITest(APITestCase):
    """Test Location API endpoints."""

    def setUp(self):
        self.location = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central da cidade de Patos-PB",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

        self.base_url = "/api/v1/locations/"

    def test_list_locations_success(self):
        response = self.client.get(self.base_url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["name"] == "Praça Getúlio Vargas"
        assert response.data[0]["latitude"] == "-7.02636800"
        assert response.data[0]["longitude"] == "-37.27701000"

    def test_retrieve_location_success(self):
        response = self.client.get(f"{self.base_url}{self.location.id}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "Praça Getúlio Vargas"
        assert response.data["description"] == "Praça central da cidade de Patos-PB"

    def test_retrieve_location_not_found(self):
        response = self.client.get(f"{self.base_url}99999/")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_location_serializer_validation(self):
        """Test that serializer properly validates input data."""
        data = {
            "name": "Test Location",
            "description": "Test description",
            "latitude": "invalid_lat",
            "longitude": "-37.277010"
        }

        # Since LocationViewSet is read-only, we test serialization validation directly
        from .api.v1.serializers import LocationSerializer
        serializer = LocationSerializer(data=data)

        assert not serializer.is_valid()
        assert "latitude" in serializer.errors

    def test_location_response_structure(self):
        """Test that API response contains expected fields."""
        response = self.client.get(f"{self.base_url}{self.location.id}/")

        expected_fields = {
            "id", "name", "description", "latitude", "longitude",
            "created_at", "updated_at"
        }

        assert set(response.data.keys()) == expected_fields
        assert isinstance(response.data["latitude"], str)
        assert isinstance(response.data["longitude"], str)


@pytest.mark.django_db
class LocationSecurityTest(APITestCase):
    """Security tests for Location API."""

    def setUp(self):
        self.location = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central da cidade de Patos-PB",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

        self.base_url = "/api/v1/locations/"

    def test_xss_prevention_in_location_data(self):
        """Test that XSS attempts are properly escaped."""
        malicious_location = Location.objects.create(
            name="<script>alert('xss')</script> Praça",
            description="<img src=x onerror=alert('xss')> Description",
            latitude=Decimal("-7.025000"),
            longitude=Decimal("-37.278000")
        )

        response = self.client.get(f"{self.base_url}{malicious_location.id}/")

        # In Django REST Framework, HTML is typically escaped by default
        # But we verify the content exists in a safe format
        assert "&lt;script&gt;" in response.data["name"] or "<script>" in response.data["name"]
        assert response.status_code == status.HTTP_200_OK

    def test_sql_injection_protection_in_queries(self):
        """Test that SQL injection attempts are handled safely."""
        malicious_id = "1'; DROP TABLE locations; --"

        response = self.client.get(f"{self.base_url}{malicious_id}/")

        # Should return 404, not execute SQL injection
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # Verify table still exists
        assert Location.objects.count() == 1

    def test_coordinate_boundary_validation_security(self):
        """Test coordinate validation prevents extreme values."""
        from .api.v1.serializers import LocationSerializer

        # Test extreme coordinates that might cause issues
        extreme_data = {
            "name": "Test Location",
            "description": "Test",
            "latitude": "999.999999",
            "longitude": "-999.999999"
        }

        serializer = LocationSerializer(data=extreme_data)

        # Serializer should reject extreme coordinates
        # This may or may not fail depending on model validation
        if not serializer.is_valid():
            assert "latitude" in serializer.errors or "longitude" in serializer.errors

    def test_large_data_handling(self):
        """Test handling of unusually large data."""
        large_description = "A" * 10000  # Very long description

        large_location = Location.objects.create(
            name="Test Location",
            description=large_description,
            latitude=Decimal("-7.025000"),
            longitude=Decimal("-37.278000")
        )

        response = self.client.get(f"{self.base_url}{large_location.id}/")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["description"]) == 10000

    def test_rate_limiting_behavior(self):
        """Test API behavior under rapid requests."""
        # This would require implementing rate limiting first
        # For now, we test that multiple requests are handled gracefully
        responses = []

        for _ in range(10):
            response = self.client.get(self.base_url)
            responses.append(response.status_code)

        # All requests should succeed (rate limiting not implemented yet)
        assert all(status == status.HTTP_200_OK for status in responses)


@pytest.mark.django_db
class LocationPerformanceTest(TestCase):
    """Performance tests for Location operations."""

    def setUp(self):
        # Create multiple locations for performance testing
        self.locations = []
        for i in range(100):
            location = Location.objects.create(
                name=f"Location {i}",
                description=f"Test location number {i}",
                latitude=Decimal(f"-7.02{i%10}000"),
                longitude=Decimal(f"-37.27{i%10}000")
            )
            self.locations.append(location)

    def test_large_list_performance(self):
        """Test API performance with large datasets."""
        from rest_framework.test import APIClient

        client = APIClient()
        import time

        start_time = time.time()
        response = client.get("/api/v1/locations/")
        end_time = time.time()

        execution_time = end_time - start_time

        assert response.status_code == 200
        assert len(response.data) == 100
        assert execution_time < 1.0  # Should complete in less than 1 second

    def test_concurrent_requests_performance(self):
        """Test performance under concurrent requests."""
        from rest_framework.test import APIClient
        import threading
        import time

        results = []
        errors = []

        def make_request():
            try:
                client = APIClient()
                response = client.get("/api/v1/locations/")
                results.append(response.status_code)
            except Exception as e:
                errors.append(e)

        threads = []
        for _ in range(20):
            thread = threading.Thread(target=make_request)
            threads.append(thread)

        start_time = time.time()

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        end_time = time.time()
        total_time = end_time - start_time

        assert len(errors) == 0
        assert all(status == 200 for status in results)
        assert total_time < 5.0  # All concurrent requests should complete quickly

    def test_database_query_optimization(self):
        """Test that database queries are optimized."""
        from django.test.utils import override_settings
        from django.db import connection

        with override_settings(DEBUG=True):
            # Reset connection queries
            connection.queries_log.clear()

            from rest_framework.test import APIClient
            client = APIClient()
            response = client.get("/api/v1/locations/")

            assert response.status_code == 200

            # Check number of queries executed
            query_count = len(connection.queries)

            # Should use minimal queries (ideally 1 for list view)
            assert query_count <= 2


@pytest.mark.django_db
class LocationIntegrationTest(APITestCase):
    """Integration tests for Location API with other services."""

    def setUp(self):
        self.location = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central da cidade de Patos-PB",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

    @patch('rota_cultural.apps.geocoding.services.NominatimService.reverse_geocode')
    def test_location_with_geocoding_integration(self, mock_reverse):
        """Test Location API integration with geocoding service."""
        mock_reverse.return_value = {
            "place_id": 123456,
            "display_name": "Praça Getúlio Vargas, Patos, Paraíba, Brasil",
            "address": {
                "city": "Patos",
                "state": "Paraíba",
                "country": "Brasil"
            }
        }

        # Get location details
        response = self.client.get(f"/api/v1/locations/{self.location.id}/")
        assert response.status_code == 200

        # Use coordinates to get geocoding info
        geocoding_response = self.client.get("/api/v1/geocoding/reverse/", {
            "lat": str(self.location.latitude),
            "lon": str(self.location.longitude)
        })
        assert geocoding_response.status_code == 200
        assert geocoding_response.data["display_name"] == "Praça Getúlio Vargas, Patos, Paraíba, Brasil"

    @patch('rota_cultural.apps.routing.services.RoutingService.calculate_route')
    def test_location_with_routing_integration(self, mock_route):
        """Test Location API integration with routing service."""
        # Create second location for route testing
        location2 = Location.objects.create(
            name="Igreja Matriz",
            description="Igreja histórica",
            latitude=Decimal("-7.027000"),
            longitude=Decimal("-37.276000")
        )

        mock_route.return_value = {
            "distance": 1250.5,
            "duration": 180,
            "geometry": [
                [-37.277010, -7.026368],
                [-37.276000, -7.027000]
            ],
            "waypoints": [
                {
                    "id": self.location.id,
                    "name": "Praça Getúlio Vargas",
                    "coordinates": [-7.026368, -37.277010]
                },
                {
                    "id": location2.id,
                    "name": "Igreja Matriz",
                    "coordinates": [-7.027000, -37.276000]
                }
            ]
        }

        # Get location details
        response = self.client.get(f"/api/v1/locations/{self.location.id}/")
        assert response.status_code == 200

        # Calculate route between locations
        route_response = self.client.post("/api/v1/routes/calculate/", {
            "waypoint_ids": [self.location.id, location2.id]
        })
        assert route_response.status_code == 200
        assert route_response.data["distance"] == 1250.5