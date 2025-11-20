import pytest
import requests
from decimal import Decimal
from unittest.mock import patch, Mock, MagicMock
from django.test import TestCase
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from .api.v1.services import NominatimService


@pytest.mark.django_db
class NominatimServiceTest(TestCase):

    def setUp(self):
        self.service = NominatimService()
        self.base_url = "https://nominatim.openstreetmap.org"

    @patch('requests.get')
    def test_search_successful_response(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "place_id": 123456,
                "display_name": "Praça Getúlio Vargas, Patos, Paraíba, Brasil",
                "lat": "-7.026368",
                "lon": "-37.277010",
                "importance": 0.8,
                "class": "tourism",
                "type": "attraction"
            }
        ]
        mock_get.return_value = mock_response

        result = self.service.search("Praça Getúlio Vargas, Patos PB")

        assert len(result) == 1
        assert result[0]["display_name"] == "Praça Getúlio Vargas, Patos, Paraíba, Brasil"
        assert Decimal(result[0]["lat"]) == Decimal("-7.026368")
        assert Decimal(result[0]["lon"]) == Decimal("-37.277010")
        mock_get.assert_called_once()

    @patch('requests.get')
    def test_search_no_results(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = []
        mock_get.return_value = mock_response

        result = self.service.search("Location That Does Not Exist")

        assert result == []
        mock_get.assert_called_once()

    @patch('requests.get')
    def test_search_network_error(self, mock_get):
        mock_get.side_effect = requests.exceptions.RequestException("Network error")

        with pytest.raises(requests.exceptions.RequestException):
            self.service.search("Praça Getúlio Vargas")

    @patch('requests.get')
    def test_search_rate_limit_error(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 429
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("429")
        mock_get.return_value = mock_response

        with pytest.raises(requests.exceptions.HTTPError):
            self.service.search("Praça Getúlio Vargas")

    @patch('requests.get')
    def test_reverse_geocode_successful(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "place_id": 123456,
            "display_name": "Praça Getúlio Vargas, Patos, Paraíba, Brasil",
            "address": {
                "city": "Patos",
                "state": "Paraíba",
                "country": "Brasil",
                "postcode": "58304-100"
            }
        }
        mock_get.return_value = mock_response

        result = self.service.reverse_geocode("-7.026368", "-37.277010")

        assert result["display_name"] == "Praça Getúlio Vargas, Patos, Paraíba, Brasil"
        assert result["address"]["city"] == "Patos"
        mock_get.assert_called_once()

    @patch('requests.get')
    def test_tourist_search_successful(self, mock_get):
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "place_id": 123456,
                "display_name": "Museu Histórico de Patos, Patos, Paraíba, Brasil",
                "lat": "-7.025500",
                "lon": "-37.276800",
                "importance": 0.9,
                "class": "tourism",
                "type": "museum"
            },
            {
                "place_id": 789012,
                "display_name": "Igreja Matriz de Patos, Patos, Paraíba, Brasil",
                "lat": "-7.027000",
                "lon": "-37.275500",
                "importance": 0.8,
                "class": "tourism",
                "type": "place_of_worship"
            }
        ]
        mock_get.return_value = mock_response

        result = self.service.search_tourist_places("museus igrejas", "Patos")

        assert len(result) == 2
        assert any("museum" in place["type"] for place in result)
        assert any("place_of_worship" in place["type"] for place in result)

    def test_invalid_coordinates_validation(self):
        with pytest.raises(ValueError):
            self.service.reverse_geocode("invalid_lat", "-37.277010")

        with pytest.raises(ValueError):
            self.service.reverse_geocode("-7.026368", "invalid_lon")

        with pytest.raises(ValueError):
            self.service.reverse_geocode("-91", "-37.277010")

        with pytest.raises(ValueError):
            self.service.reverse_geocode("-7.026368", "181")


@pytest.mark.django_db
class GeocodingAPITest(APITestCase):

    def setUp(self):
        self.base_url = "/api/v1/geocoding/"

    @patch('rota_cultural.apps.geocoding.services.NominatimService.search')
    def test_search_endpoint_success(self, mock_search):
        mock_search.return_value = [
            {
                "place_id": 123456,
                "display_name": "Praça Getúlio Vargas, Patos, Paraíba, Brasil",
                "lat": "-7.026368",
                "lon": "-37.277010",
                "importance": 0.8,
                "class": "tourism",
                "type": "attraction"
            }
        ]

        response = self.client.get(f"{self.base_url}search/", {"q": "Praça Getúlio Vargas"})

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["display_name"] == "Praça Getúlio Vargas, Patos, Paraíba, Brasil"
        mock_search.assert_called_once_with("Praça Getúlio Vargas")

    def test_search_endpoint_missing_query(self):
        response = self.client.get(f"{self.base_url}search/")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "q" in response.data

    @patch('rota_cultural.apps.geocoding.services.NominatimService.search')
    def test_search_endpoint_empty_query(self, mock_search):
        mock_search.return_value = []

        response = self.client.get(f"{self.base_url}search/", {"q": ""})

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    @patch('rota_cultural.apps.geocoding.services.NominatimService.search')
    def test_search_endpoint_service_error(self, mock_search):
        mock_search.side_effect = requests.exceptions.RequestException("Service unavailable")

        response = self.client.get(f"{self.base_url}search/", {"q": "Praça Getúlio Vargas"})

        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE

    @patch('rota_cultural.apps.geocoding.services.NominatimService.reverse_geocode')
    def test_reverse_geocode_endpoint_success(self, mock_reverse):
        mock_reverse.return_value = {
            "place_id": 123456,
            "display_name": "Praça Getúlio Vargas, Patos, Paraíba, Brasil",
            "address": {
                "city": "Patos",
                "state": "Paraíba",
                "country": "Brasil"
            }
        }

        response = self.client.get(f"{self.base_url}reverse/", {
            "lat": "-7.026368",
            "lon": "-37.277010"
        })

        assert response.status_code == status.HTTP_200_OK
        assert response.data["display_name"] == "Praça Getúlio Vargas, Patos, Paraíba, Brasil"
        assert response.data["address"]["city"] == "Patos"

    def test_reverse_geocode_endpoint_missing_coordinates(self):
        response = self.client.get(f"{self.base_url}reverse/")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "lat" in response.data
        assert "lon" in response.data

    @patch('rota_cultural.apps.geocoding.services.NominatimService.reverse_geocode')
    def test_reverse_geocode_endpoint_invalid_coordinates(self, mock_reverse):
        mock_reverse.side_effect = ValueError("Invalid coordinates")

        response = self.client.get(f"{self.base_url}reverse/", {
            "lat": "invalid",
            "lon": "-37.277010"
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @patch('rota_cultural.apps.geocoding.services.NominatimService.search_tourist_places')
    def test_tourist_search_endpoint_success(self, mock_search):
        mock_search.return_value = [
            {
                "place_id": 123456,
                "display_name": "Museu Histórico de Patos, Patos, Paraíba, Brasil",
                "lat": "-7.025500",
                "lon": "-37.276800",
                "class": "tourism",
                "type": "museum"
            }
        ]

        response = self.client.get(f"{self.base_url}tourist-search/", {
            "q": "museus",
            "city": "Patos"
        })

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert "museum" in response.data[0]["type"]
        mock_search.assert_called_once_with("museus", "Patos")

    def test_tourist_search_endpoint_missing_parameters(self):
        response = self.client.get(f"{self.base_url}tourist-search/")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "q" in response.data
        assert "city" in response.data


@pytest.mark.django_db
class GeocodingIntegrationTest(APITestCase):

    def setUp(self):
        from .models import Location
        self.praga = Location.objects.create(
            name="Praça Getúlio Vargas",
            description="Praça central da cidade",
            latitude=Decimal("-7.026368"),
            longitude=Decimal("-37.277010")
        )

    @patch('rota_cultural.apps.geocoding.services.NominatimService.reverse_geocode')
    def test_location_reverse_geocoding_integration(self, mock_reverse):
        mock_reverse.return_value = {
            "place_id": 123456,
            "display_name": "Praça Getúlio Vargas, Patos, Paraíba, Brasil",
            "address": {
                "city": "Patos",
                "state": "Paraíba",
                "country": "Brasil",
                "postcode": "58304-100"
            }
        }

        response = self.client.get("/api/v1/geocoding/reverse/", {
            "lat": str(self.praga.latitude),
            "lon": str(self.praga.longitude)
        })

        assert response.status_code == status.HTTP_200_OK
        assert response.data["display_name"] == "Praça Getúlio Vargas, Patos, Paraíba, Brasil"

    @patch('rota_cultural.apps.geocoding.services.NominatimService.search')
    def test_geocoding_to_location_workflow(self, mock_search):
        mock_search.return_value = [
            {
                "place_id": 789012,
                "display_name": "Igreja Matriz, Patos, Paraíba, Brasil",
                "lat": "-7.027000",
                "lon": "-37.276000",
                "class": "tourism",
                "type": "place_of_worship"
            }
        ]

        response = self.client.get("/api/v1/geocoding/search/", {"q": "Igreja Matriz Patos"})

        assert response.status_code == status.HTTP_200_OK
        geocoded_result = response.data[0]

        assert Decimal(geocoded_result["lat"]) == Decimal("-7.027000")
        assert Decimal(geocoded_result["lon"]) == Decimal("-37.276000")