from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .services import NominatimService
from .serializers import NominatimResultSerializer, ReverseGeocodeResultSerializer


class GeocodingViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        query = request.query_params.get('q', '').strip()
        limit = int(request.query_params.get('limit', 10))
        country_codes = request.query_params.get('country_codes', '').split(',')
        country_codes = [cc.strip() for cc in country_codes if cc.strip()]

        if not query or len(query) < 2:
            return Response({'error': 'Query too short'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            results = NominatimService.search(query, limit, country_codes)
            serializer = NominatimResultSerializer(many=True, data=results)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='reverse')
    def reverse(self, request):
        try:
            lat = float(request.query_params.get('lat'))
            lon = float(request.query_params.get('lon'))
            zoom = int(request.query_params.get('zoom', 18))
        except (ValueError, TypeError):
            return Response({'error': 'Invalid coordinates'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = NominatimService.reverse_geocode(lat, lon, zoom)
            if not result:
                return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = ReverseGeocodeResultSerializer(data=result)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='tourist-search')
    def tourist_search(self, request):
        query = request.query_params.get('q', '').strip()
        city = request.query_params.get('city', 'Patos')

        if not query or len(query) < 2:
            return Response({'error': 'Query too short'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            results = NominatimService.search_tourist_places(query, city)
            serializer = NominatimResultSerializer(many=True, data=results)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)