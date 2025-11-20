import pytest
import requests
from decimal import Decimal
from unittest.mock import patch, Mock, MagicMock
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .api.v1.services import RoutingService
from rota_cultural.apps.locations.models import Location


@pytest.mark.django_db
class RoutingServiceTest(TestCase):

    def setUp(self):
        self.service = RoutingService()

        self.location1 = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

        self.location2 = Location.objects.create(
            name="Igreja Matriz",
            description="Igreja histórica",
            latitude=Decimal("-7.027000"),
            longitude=Decimal("-37.276000")
        )

        self.location3 = Location.objects.create(
            name="Museu do Cariri",
            description="Museu cultural",
            latitude=Decimal("-7.025000"),
            longitude=Decimal("-37.278000")
        )

    @patch('routingpy.routers.OSRM.directions')
    def test_route_calculation_success(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 1250.5
        mock_route.duration = 180
        mock_route.geometry = [
            [-37.277010, -7.026368],
            [-37.276500, -7.026700],
            [-37.276000, -7.027000]
        ]
        mock_directions.return_value = [mock_route]

        result = self.service.calculate_route([self.location1, self.location2])

        assert result["distance"] == 1250.5
        assert result["duration"] == 180
        assert len(result["geometry"]) == 3
        assert len(result["waypoints"]) == 2
        assert result["waypoints"][0]["name"] == "Praça Getúlio Vargas"
        assert result["waypoints"][1]["name"] == "Igreja Matriz"

    @patch('routingpy.routers.OSRM.directions')
    def test_multi_waypoint_route_calculation(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 2500.0
        mock_route.duration = 360
        mock_route.geometry = [
            [-37.277010, -7.026368],
            [-37.276500, -7.026700],
            [-37.276000, -7.027000],
            [-37.278000, -7.025000]
        ]
        mock_directions.return_value = [mock_route]

        result = self.service.calculate_route([
            self.location1, self.location2, self.location3
        ])

        assert result["distance"] == 2500.0
        assert result["duration"] == 360
        assert len(result["waypoints"]) == 3
        assert len(result["geometry"]) == 4

    @patch('routingpy.routers.OSRM.directions')
    def test_route_calculation_no_waypoints(self, mock_directions):
        with pytest.raises(ValueError, match="At least 2 waypoints required"):
            self.service.calculate_route([])

        with pytest.raises(ValueError, match="At least 2 waypoints required"):
            self.service.calculate_route([self.location1])

    @patch('routingpy.routers.OSRM.directions')
    def test_route_calculation_osrm_error(self, mock_directions):
        mock_directions.side_effect = requests.exceptions.RequestException("OSRM service unavailable")

        with pytest.raises(requests.exceptions.RequestException):
            self.service.calculate_route([self.location1, self.location2])

    @patch('routingpy.routers.OSRM.directions')
    def test_route_calculation_invalid_coordinates(self, mock_directions):
        mock_directions.side_effect = ValueError("Invalid coordinates")

        with pytest.raises(ValueError):
            self.service.calculate_route([self.location1, self.location2])

    def test_coordinate_format_conversion(self):
        waypoints = [self.location1, self.location2]
        osrm_coords = self.service._convert_to_osrm_coordinates(waypoints)

        assert len(osrm_coords) == 2
        assert osrm_coords[0] == [-37.277010, -7.026368]
        assert osrm_coords[1] == [-37.276000, -7.027000]

    def test_route_response_format_validation(self):
        mock_route = Mock()
        mock_route.distance = 1000.0
        mock_route.duration = 120
        mock_route.geometry = [[-37.277, -7.026], [-37.276, -7.027]]

        response = self.service._format_route_response(
            mock_route, [self.location1, self.location2]
        )

        assert "distance" in response
        assert "duration" in response
        assert "geometry" in response
        assert "waypoints" in response
        assert isinstance(response["distance"], (int, float))
        assert isinstance(response["duration"], (int, float))
        assert isinstance(response["geometry"], list)
        assert isinstance(response["waypoints"], list)


@pytest.mark.django_db
class RoutingAPITest(APITestCase):

    def setUp(self):
        self.location1 = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

        self.location2 = Location.objects.create(
            name="Igreja Matriz",
            description="Igreja histórica",
            latitude=Decimal("-7.027000"),
            longitude=Decimal("-37.276000")
        )

        self.location3 = Location.objects.create(
            name="Museu do Cariri",
            description="Museu cultural",
            latitude=Decimal("-7.025000"),
            longitude=Decimal("-37.278000")
        )

        self.base_url = "/api/v1/routes/"

    @patch('rota_cultural.apps.routing.services.RoutingService.calculate_route')
    def test_calculate_route_success(self, mock_calculate):
        mock_calculate.return_value = {
            "distance": 1250.5,
            "duration": 180,
            "geometry": [
                [-37.277010, -7.026368],
                [-37.276500, -7.026700],
                [-37.276000, -7.027000]
            ],
            "waypoints": [
                {
                    "id": self.location1.id,
                    "name": "Praça Getúlio Vargas",
                    "coordinates": [-7.026368, -37.277010]
                },
                {
                    "id": self.location2.id,
                    "name": "Igreja Matriz",
                    "coordinates": [-7.027000, -37.276000]
                }
            ]
        }

        response = self.client.post(f"{self.base_url}calculate/", {
            "waypoint_ids": [self.location1.id, self.location2.id]
        })

        assert response.status_code == status.HTTP_200_OK
        assert response.data["distance"] == 1250.5
        assert response.data["duration"] == 180
        assert len(response.data["waypoints"]) == 2
        mock_calculate.assert_called_once()

    def test_calculate_route_missing_waypoints(self):
        response = self.client.post(f"{self.base_url}calculate/", {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "waypoint_ids" in response.data

    def test_calculate_route_empty_waypoints(self):
        response = self.client.post(f"{self.base_url}calculate/", {
            "waypoint_ids": []
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_calculate_route_insufficient_waypoints(self):
        response = self.client.post(f"{self.base_url}calculate/", {
            "waypoint_ids": [self.location1.id]
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_calculate_route_nonexistent_waypoint(self):
        response = self.client.post(f"{self.base_url}calculate/", {
            "waypoint_ids": [999, self.location2.id]
        })

        assert response.status_code == status.HTTP_404_NOT_FOUND

    @patch('rota_cultural.apps.routing.services.RoutingService.calculate_route')
    def test_calculate_route_service_error(self, mock_calculate):
        mock_calculate.side_effect = requests.exceptions.RequestException("OSRM service unavailable")

        response = self.client.post(f"{self.base_url}calculate/", {
            "waypoint_ids": [self.location1.id, self.location2.id]
        })

        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE

    @patch('rota_cultural.apps.routing.services.RoutingService.calculate_route')
    def test_multi_waypoint_route_success(self, mock_calculate):
        mock_calculate.return_value = {
            "distance": 2500.0,
            "duration": 360,
            "geometry": [
                [-37.277010, -7.026368],
                [-37.276500, -7.026700],
                [-37.276000, -7.027000],
                [-37.278000, -7.025000]
            ],
            "waypoints": [
                {
                    "id": self.location1.id,
                    "name": "Praça Getúlio Vargas",
                    "coordinates": [-7.026368, -37.277010]
                },
                {
                    "id": self.location2.id,
                    "name": "Igreja Matriz",
                    "coordinates": [-7.027000, -37.276000]
                },
                {
                    "id": self.location3.id,
                    "name": "Museu do Cariri",
                    "coordinates": [-7.025000, -37.278000]
                }
            ]
        }

        response = self.client.post(f"{self.base_url}calculate/", {
            "waypoint_ids": [self.location1.id, self.location2.id, self.location3.id]
        })

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["waypoints"]) == 3
        assert response.data["distance"] == 2500.0


@pytest.mark.django_db
class RoutingPerformanceTest(TestCase):

    def setUp(self):
        self.locations = []
        for i in range(20):
            location = Location.objects.create(
                name=f"Location {i}",
                description=f"Test location {i}",
                latitude=Decimal(f"-7.02{i}000"),
                longitude=Decimal(f"-37.27{i}000")
            )
            self.locations.append(location)

    @patch('routingpy.routers.OSRM.directions')
    def test_large_route_calculation_performance(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 5000.0
        mock_route.duration = 600
        mock_route.geometry = [[-37.277, -7.026] for _ in range(25)]
        mock_directions.return_value = [mock_route]

        import time
        start_time = time.time()

        service = RoutingService()
        result = service.calculate_route(self.locations)

        end_time = time.time()
        execution_time = end_time - start_time

        assert execution_time < 2.0
        assert len(result["waypoints"]) == 20

    @patch('routingpy.routers.OSRM.directions')
    def test_concurrent_route_calculations(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 1000.0
        mock_route.duration = 120
        mock_route.geometry = [[-37.277, -7.026], [-37.276, -7.027]]
        mock_directions.return_value = [mock_route]

        import threading
        import time

        results = []
        errors = []

        def calculate_route_task(waypoints):
            try:
                service = RoutingService()
                result = service.calculate_route(waypoints)
                results.append(result)
            except Exception as e:
                errors.append(e)

        threads = []
        for i in range(5):
            waypoints = [self.locations[i], self.locations[i+1]]
            thread = threading.Thread(target=calculate_route_task, args=(waypoints,))
            threads.append(thread)

        start_time = time.time()

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        end_time = time.time()
        total_time = end_time - start_time

        assert len(errors) == 0
        assert len(results) == 5
        assert total_time < 5.0


@pytest.mark.django_db
class RoutingSecurityTest(TestCase):

    def setUp(self):
        self.location1 = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

        self.location2 = Location.objects.create(
            name="Igreja Matriz",
            description="Igreja histórica",
            latitude=Decimal("-7.027000"),
            longitude=Decimal("-37.276000")
        )

    def test_sql_injection_protection_in_waypoint_ids(self):
        from .services import RoutingService

        service = RoutingService()

        malicious_ids = [
            "'; DROP TABLE locations; --",
            "1 OR 1=1",
            "1 UNION SELECT * FROM auth_user",
            "<script>alert('xss')</script>"
        ]

        for malicious_id in malicious_ids:
            with pytest.raises((ValueError, TypeError)):
                waypoints = [malicious_id, self.location2.id]
                service.calculate_route(waypoints)

    def test_coordinate_boundary_validation(self):
        from .services import RoutingService

        service = RoutingService()

        with pytest.raises(ValueError):
            service._validate_coordinates([[181, 91]])

        with pytest.raises(ValueError):
            service._validate_coordinates([[-181, -91]])

    @patch('routingpy.routers.OSRM.directions')
    def test_external_api_data_sanitization(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 1000.0
        mock_route.duration = 120
        mock_route.geometry = [
            [-37.277010, -7.026368],
            [-37.276000, "<script>alert('xss')</script>"],
            [-37.276500, -7.027000]
        ]
        mock_directions.return_value = [mock_route]

        service = RoutingService()
        result = service.calculate_route([self.location1, self.location2])

        geometry_str = str(result["geometry"])
        assert "<script>" not in geometry_str
        assert "alert" not in geometry_str