from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from rota_cultural.apps.places.models import TouristSpot, Establishment
from .serializers import (
    TouristSpotSerializer,
    TouristSpotListSerializer,
    EstablishmentSerializer
)


class TouristSpotViewSet(viewsets.ModelViewSet):
    queryset = TouristSpot.objects.select_related('address', 'category')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description', 'address__city']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return TouristSpotListSerializer
        return TouristSpotSerializer

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """Retorna os pontos turísticos mais populares (ex: primeiros 6)"""
        featured = self.queryset[:6]
        serializer = TouristSpotListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def by_city(self, request):
        """Retorna pontos turísticos agrupados por cidade"""
        city = request.query_params.get('city')
        if not city:
            return Response(
                {'detail': 'city parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        spots = self.queryset.filter(address__city__icontains=city)
        serializer = TouristSpotListSerializer(spots, many=True, context={'request': request})
        return Response(serializer.data)


class EstablishmentViewSet(viewsets.ModelViewSet):
    queryset = Establishment.objects.select_related('address', 'category')
    serializer_class = EstablishmentSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description', 'address__city']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Retorna os estabelecimentos mais populares"""
        featured = self.queryset[:6]
        serializer = EstablishmentSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)
