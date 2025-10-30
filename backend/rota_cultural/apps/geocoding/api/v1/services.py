import requests
from django.conf import settings
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)


class NominatimService:
    BASE_URL = getattr(settings, 'NOMINATIM_BASE_URL', 'https://nominatim.openstreetmap.org')
    USER_AGENT = getattr(settings, 'NOMINATIM_USER_AGENT', 'RotaCultural/1.0 (https://github.com/lucasdaniellopes/rota-cultural)')

    @classmethod
    def search(cls, query: str, limit: int = 10, country_codes: List[str] = None) -> List[Dict[str, Any]]:
        if not query or len(query.strip()) < 2:
            return []

        try:
            params = {
                'format': 'json',
                'q': query.strip(),
                'addressdetails': '1',
                'limit': str(limit),
                'extratags': '1',
                'namedetails': '1',
            }

            if country_codes:
                params['countrycodes'] = ','.join(country_codes)

            response = requests.get(
                f"{cls.BASE_URL}/search",
                params=params,
                headers={'User-Agent': cls.USER_AGENT},
                timeout=10
            )

            if not response.ok:
                logger.error(f"Nominatim search failed: {response.status_code} {response.text}")
                return []

            data = response.json()
            return data if isinstance(data, list) else []

        except requests.RequestException as e:
            logger.error(f"Nominatim search error: {e}")
            return []

    @classmethod
    def reverse_geocode(cls, lat: float, lon: float, zoom: int = 18) -> Optional[Dict[str, Any]]:
        try:
            params = {
                'format': 'json',
                'lat': str(lat),
                'lon': str(lon),
                'addressdetails': '1',
                'zoom': str(zoom),
            }

            response = requests.get(
                f"{cls.BASE_URL}/reverse",
                params=params,
                headers={'User-Agent': cls.USER_AGENT},
                timeout=10
            )

            if not response.ok:
                logger.error(f"Nominatim reverse geocoding failed: {response.status_code} {response.text}")
                return None

            data = response.json()

            if data.get('error'):
                return None

            return data

        except requests.RequestException as e:
            logger.error(f"Nominatim reverse geocoding error: {e}")
            return None

    @classmethod
    def search_tourist_places(cls, query: str, city: str = 'Patos') -> List[Dict[str, Any]]:
        target_city = f'{city}, Paraíba'
        search_query = query

        if 'patos' not in query.lower():
            search_query = f'{query}, {target_city}'

        results = cls.search(search_query, 15, ['br'])

        patos_results = []
        for result in results:
            address = result.get('address', {})
            display_name = result.get('display_name', '').lower()

            if (
                address.get('city') == 'Patos' or
                address.get('municipality') == 'Patos' or
                address.get('town') == 'Patos' or
                'patos' in display_name or
                (address.get('state') == 'Paraíba' and (
                    'patos' in address.get('county', '').lower() or
                    'patos' in address.get('state_district', '').lower()
                ))
            ):
                patos_results.append(result)

        return patos_results[:10]