from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rota_cultural.apps.locations.models import Location
from .serializers import LocationSerializer

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]