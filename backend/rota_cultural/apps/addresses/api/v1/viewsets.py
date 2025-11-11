from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import Distance

from rota_cultural.apps.addresses.models import Address
from .serializers import AddressSerializer, AddressListSerializer

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['neighborhood', 'city', 'state']
    search_fields = ['street', 'neighborhood', 'city']
    ordering_fields = ['neighborhood', 'city', 'created_at']
    ordering = ['neighborhood']

    def get_queryset(self):
        queryset = Address.objects.all()

        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius', 5)

        if lat and lng:
            try:
                point = Point(float(lng), float(lat), srid=4326)
                queryset = queryset.filter(
                    point__distance_lte=(point, Distance(km=float(radius)))
                )
            except (ValueError, TypeError):
                pass

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return AddressListSerializer
        return AddressSerializer

    @action(detail=False, methods=['get'], url_path='nearby')
    def nearby(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = request.query_params.get('radius', 5)

        if not lat or not lng:
            return Response(
                {'error': 'lat and lng parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            point = Point(float(lng), float(lat), srid=4326)
            addresses = Address.objects.filter(
                point__distance_lte=(point, Distance(km=float(radius)))
            ).order_by('point__distance', point)

            serializer = AddressListSerializer(addresses, many=True)
            return Response({
                'addresses': serializer.data,
                'center_point': {'lat': float(lat), 'lng': float(lng)},
                'radius_km': float(radius),
                'count': addresses.count()
            })
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid lat/lng coordinates'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path=r'by-neighborhood/(?P<neighborhood>[^/]+)')
    def by_neighborhood(self, request, neighborhood=None):
        addresses = Address.objects.filter(neighborhood__icontains=neighborhood)
        serializer = AddressListSerializer(addresses, many=True)
        return Response(serializer.data)