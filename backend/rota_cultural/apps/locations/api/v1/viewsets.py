from rest_framework import viewsets
from rota_cultural.apps.locations.models import Location
from .serializers import LocationSerializer

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer