from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rota_cultural.apps.locations.models import Location
from rota_cultural.apps.events.models import Event
from rota_cultural.apps.places.models import TouristSpot
from .serializers import LocationSerializer

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    @action(detail=False, methods=['get'])
    def destinations(self, request):
        destinations = []
        
        # Events
        events = Event.objects.select_related('content_type').all()
        for event in events:
            if event.location:
                lat, lng = None, None
                loc_name = str(event.location)
                
                # Handle Location model
                if hasattr(event.location, 'latitude') and hasattr(event.location, 'longitude'):
                    lat = event.location.latitude
                    lng = event.location.longitude
                # Handle Address model or other models with point
                elif hasattr(event.location, 'point') and event.location.point:
                    lat = event.location.point.y
                    lng = event.location.point.x
                
                if lat and lng:
                    destinations.append({
                        'id': f'event_{event.id}',
                        'name': event.name,
                        'description': loc_name,
                        'latitude': lat,
                        'longitude': lng,
                        'type': 'event'
                    })

        # Tourist Spots
        spots = TouristSpot.objects.select_related('address').all()
        for spot in spots:
            if spot.address:
                lat, lng = None, None
                if spot.address.point:
                    lat = spot.address.point.y
                    lng = spot.address.point.x
                # Fallback if address has lat/long fields (check model)
                elif hasattr(spot.address, 'latitude') and hasattr(spot.address, 'longitude'):
                     lat = spot.address.latitude
                     lng = spot.address.longitude
                # Fallback for plain fields if they exist on Address model (custom)
                elif hasattr(spot.address, 'lat') and hasattr(spot.address, 'lon'):
                     lat = spot.address.lat
                     lng = spot.address.lon

                if lat and lng:
                    destinations.append({
                        'id': f'spot_{spot.id}',
                        'name': spot.name,
                        'description': str(spot.address),
                        'latitude': lat,
                        'longitude': lng,
                        'type': 'tourist_spot'
                    })
        
        return Response(destinations)