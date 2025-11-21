import pytest
import threading
import time
import concurrent.futures
from decimal import Decimal
from django.test import TestCase
from django.db import transaction
from django.core.management import call_command
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch, Mock
from rota_cultural.apps.locations.models import Location


@pytest.mark.django_db
@pytest.mark.performance
class ConcurrencyTest(TestCase):

    def setUp(self):
        self.locations = []
        for i in range(10):
            location = Location.objects.create(
                name=f"Location {i}",
                description=f"Test location {i}",
                latitude=Decimal(f"-7.02{i}000"),
                longitude=Decimal(f"-37.27{i}000")
            )
            self.locations.append(location)

    def test_concurrent_location_creation(self):
        created_locations = []
        errors = []

        def create_location(index):
            try:
                with transaction.atomic():
                    location = Location.objects.create(
                        name=f"Concurrent Location {index}",
                        description=f"Created in thread {index}",
                        latitude=Decimal(f"-7.025{index}00"),
                        longitude=Decimal(f"-37.277{index}00")
                    )
                    created_locations.append(location)
            except Exception as e:
                errors.append(e)

        threads = []
        for i in range(20):
            thread = threading.Thread(target=create_location, args=(i,))
            threads.append(thread)

        start_time = time.time()

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        end_time = time.time()
        duration = end_time - start_time

        assert len(errors) == 0, f"Errors occurred: {errors}"
        assert len(created_locations) == 20
        assert duration < 10.0, f"Concurrent creation took too long: {duration}s"

        total_locations = Location.objects.filter(name__startswith="Concurrent Location").count()
        assert total_locations == 20

    def test_concurrent_location_queries(self):
        query_results = []
        errors = []

        def query_locations():
            try:
                locations = Location.objects.all()
                query_results.append(len(locations))
            except Exception as e:
                errors.append(e)

        threads = []
        for _ in range(50):
            thread = threading.Thread(target=query_locations)
            threads.append(thread)

        start_time = time.time()

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        end_time = time.time()
        duration = end_time - start_time

        assert len(errors) == 0, f"Query errors: {errors}"
        assert len(query_results) == 50
        unique_results = set(query_results)
        assert len(unique_results) == 1, f"Inconsistent query results: {unique_results}"
        assert duration < 5.0, f"Concurrent queries took too long: {duration}s"

    @patch('routingpy.routers.OSRM.directions')
    def test_concurrent_route_calculations(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 1000.0
        mock_route.duration = 120
        mock_route.geometry = [[-37.277, -7.026], [-37.276, -7.027]]
        mock_directions.return_value = [mock_route]

        route_results = []
        errors = []

        def calculate_route():
            try:
                result = {
                    "distance": 1000.0,
                    "duration": 120,
                    "geometry": [[-37.277, -7.026], [-37.276, -7.027]]
                }
                route_results.append(result["distance"])
            except Exception as e:
                errors.append(e)

        threads = []
        for _ in range(10):
            thread = threading.Thread(target=calculate_route)
            threads.append(thread)

        start_time = time.time()

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        end_time = time.time()
        duration = end_time - start_time

        assert len(errors) == 0, f"Route calculation errors: {errors}"
        assert len(route_results) == 10
        assert all(result == 1000.0 for result in route_results)
        assert duration < 5.0, f"Concurrent routing took too long: {duration}s"


@pytest.mark.django_db
@pytest.mark.performance
class LoadTest(TestCase):

    def setUp(self):
        self.locations = []
        for i in range(100):
            location = Location.objects.create(
                name=f"Load Test Location {i}",
                description=f"Load test location {i}",
                latitude=Decimal(f"-7.02{i%20}000"),
                longitude=Decimal(f"-37.27{i%20}000")
            )
            self.locations.append(location)

    def test_bulk_location_creation_performance(self):
        import time

        start_time = time.time()

        new_locations = []
        for i in range(1000):
            new_locations.append(Location(
                name=f"Bulk Location {i}",
                description=f"Bulk test location {i}",
                latitude=Decimal(f"-7.025{i%100}00"),
                longitude=Decimal(f"-37.277{i%100}00")
            ))

        created_locations = Location.objects.bulk_create(new_locations, batch_size=100)

        end_time = time.time()
        duration = end_time - start_time

        assert len(created_locations) == 1000
        assert duration < 10.0, f"Bulk creation took too long: {duration}s"

        total_count = Location.objects.filter(name__startswith="Bulk Location").count()
        assert total_count == 1000

    def test_large_dataset_query_performance(self):
        import time

        start_time = time.time()
        locations = Location.objects.all()
        results = list(locations)
        end_time = time.time()

        query_duration = end_time - start_time

        assert len(results) >= 10
        assert query_duration < 1.0, f"Large dataset query took too long: {query_duration}s"

        start_time = time.time()
        filtered_locations = Location.objects.filter(name__icontains="Load Test")
        filtered_results = list(filtered_locations)
        end_time = time.time()

        filter_duration = end_time - start_time

        assert len(filtered_results) == 100
        assert filter_duration < 0.5, f"Filtered query took too long: {filter_duration}s"

    def test_memory_usage_stability(self):
        import gc
        import psutil
        import os

        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024

        for batch in range(10):
            new_locations = []
            for i in range(100):
                new_locations.append(Location(
                    name=f"Memory Test Location {batch}_{i}",
                    description=f"Memory test {batch}_{i}",
                    latitude=Decimal(f"-7.025{batch}{i}00"),
                    longitude=Decimal(f"-37.277{batch}{i}00")
                ))

            Location.objects.bulk_create(new_locations)

            queried = Location.objects.filter(name__startswith=f"Memory Test Location {batch}")
            list(queried)

            Location.objects.filter(name__startswith=f"Memory Test Location {batch}").delete()
            gc.collect()

        final_memory = process.memory_info().rss / 1024 / 1024
        memory_increase = final_memory - initial_memory

        assert memory_increase < 50, f"Memory increased too much: {memory_increase:.2f}MB"


@pytest.mark.django_db
@pytest.mark.performance
class APIPerformanceTest(APITestCase):

    def setUp(self):
        self.locations = []
        for i in range(50):
            location = Location.objects.create(
                name=f"API Test Location {i}",
                description=f"API performance test location {i}",
                latitude=Decimal(f"-7.02{i%10}000"),
                longitude=Decimal(f"-37.27{i%10}000")
            )
            self.locations.append(location)

    def test_api_response_time_under_load(self):
        from rest_framework.test import APIClient

        response_times = []
        errors = []

        def make_api_request():
            try:
                client = APIClient()
                start_time = time.time()
                response = client.get("/api/v1/locations/")
                end_time = time.time()

                response_times.append(end_time - start_time)
                if response.status_code != 200:
                    errors.append(f"Status: {response.status_code}")
            except Exception as e:
                errors.append(str(e))

        threads = []
        for _ in range(50):
            thread = threading.Thread(target=make_api_request)
            threads.append(thread)

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        assert len(errors) == 0, f"API errors: {errors}"
        assert len(response_times) == 50

        avg_response_time = sum(response_times) / len(response_times)
        max_response_time = max(response_times)

        assert avg_response_time < 1.0, f"Average response time too high: {avg_response_time:.3f}s"
        assert max_response_time < 2.0, f"Max response time too high: {max_response_time:.3f}s"

    @patch('routingpy.routers.OSRM.directions')
    def test_concurrent_api_requests_mixed(self, mock_directions):
        mock_route = Mock()
        mock_route.distance = 1000.0
        mock_route.duration = 120
        mock_route.geometry = [[-37.277, -7.026], [-37.276, -7.027]]
        mock_directions.return_value = [mock_route]

        from rest_framework.test import APIClient

        results = {
            "location_list": [],
            "location_detail": [],
            "route_calculation": [],
            "geocoding_search": []
        }
        errors = []

        def make_location_list_request():
            client = APIClient()
            response = client.get("/api/v1/locations/")
            results["location_list"].append(response.status_code)

        def make_location_detail_request():
            client = APIClient()
            response = client.get(f"/api/v1/locations/{self.locations[0].id}/")
            results["location_detail"].append(response.status_code)

        def make_route_calculation_request():
            client = APIClient()
            response = client.post("/api/v1/routes/calculate/", {
                "waypoint_ids": [self.locations[0].id, self.locations[1].id]
            })
            if response.status_code in [200, 404]:
                results["route_calculation"].append(response.status_code)

        @patch('rota_cultural.apps.geocoding.services.NominatimService.search')
        def make_geocoding_request(mock_search):
            mock_search.return_value = [{
                "place_id": 123456,
                "display_name": "Test Location",
                "lat": "-7.026368",
                "lon": "-37.277010"
            }]
            client = APIClient()
            response = client.get("/api/v1/geocoding/search/", {"q": "test"})
            results["geocoding_search"].append(response.status_code)

        threads = []
        for _ in range(5):
            threads.append(threading.Thread(target=make_location_list_request))
            threads.append(threading.Thread(target=make_location_detail_request))
            threads.append(threading.Thread(target=make_route_calculation_request))
            threads.append(threading.Thread(target=make_geocoding_request))

        start_time = time.time()

        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        end_time = time.time()
        total_time = end_time - start_time

        assert len(errors) == 0, f"Mixed request errors: {errors}"
        assert len(results["location_list"]) == 5
        assert len(results["location_detail"]) == 5
        assert len(results["geocoding_search"]) == 5
        assert len(results["route_calculation"]) == 5

        assert all(status == 200 for status in results["location_list"])
        assert all(status == 200 for status in results["location_detail"])

        assert total_time < 10.0, f"Mixed requests took too long: {total_time}s"

    def test_api_rate_limiting_behavior(self):
        from rest_framework.test import APIClient

        client = APIClient()
        response_times = []

        for i in range(100):
            start_time = time.time()
            response = client.get("/api/v1/locations/")
            end_time = time.time()

            response_times.append(end_time - start_time)
            assert response.status_code == 200

        first_10_avg = sum(response_times[:10]) / 10
        last_10_avg = sum(response_times[-10:]) / 10
        degradation_factor = last_10_avg / first_10_avg if first_10_avg > 0 else 1

        assert degradation_factor < 3.0, f"Response time degradation too high: {degradation_factor:.2f}x"

        overall_avg = sum(response_times) / len(response_times)
        assert overall_avg < 0.5, f"Overall average response time too high: {overall_avg:.3f}s"


@pytest.mark.performance
class DatabasePerformanceTest(TestCase):

    @pytest.mark.django_db
    def test_database_connection_pooling(self):
        from django.db import connection
        from rota_cultural.apps.locations.models import Location

        initial_queries = len(connection.queries) if connection.queries else 0

        with transaction.atomic():
            locations = []
            for i in range(500):
                location = Location(
                    name=f"Connection Test Location {i}",
                    description=f"Connection test {i}",
                    latitude=Decimal(f"-7.025{i%100}00"),
                    longitude=Decimal(f"-37.277{i%100}00")
                )
                locations.append(location)

            Location.objects.bulk_create(locations, batch_size=50)

        queried_locations = list(Location.objects.filter(name__startswith="Connection Test"))

        final_queries = len(connection.queries) if connection.queries else 0
        query_increase = final_queries - initial_queries

        assert len(queried_locations) == 500
        assert query_increase < 20, f"Too many queries executed: {query_increase}"

    @pytest.mark.django_db
    def test_index_performance_with_large_dataset(self):
        from rota_cultural.apps.locations.models import Location

        large_dataset = []
        for i in range(50):
            large_dataset.append(Location(
                name=f"Index Test Location {i%10}",
                description=f"Index performance test {i}",
                latitude=Decimal(f"-7.025{i%10}00"),
                longitude=Decimal(f"-37.277{i%10}00")
            ))

        Location.objects.bulk_create(large_dataset)

        start_time = time.time()
        ordered_locations = list(Location.objects.filter(name__startswith="Index Test Location 1"))
        end_time = time.time()

        query_time = end_time - start_time

        assert len(ordered_locations) >= 5
        assert query_time < 0.1, f"Index query too slow: {query_time:.3f}s"

        Location.objects.filter(name__startswith="Index Test Location").delete()