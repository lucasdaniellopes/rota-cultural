from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from rota_cultural.apps.locations.models import Location
from routingpy.routers import OSRM

class RouteViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def calculate(self, request):

        waypoint_ids = request.data.get('waypoint_ids', [])
        if len(waypoint_ids) < 2:
            return Response({'error': 'Pelo menos dois waypoint_ids são necessários.'}, status=status.HTTP_400_BAD_REQUEST)

        locations = []
        for waypoint_id in waypoint_ids:
            try:
                location = Location.objects.get(id=waypoint_id)
                locations.append(location)
            except Location.DoesNotExist:
                return Response({'error': f'Location com id {waypoint_id} não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        coordinates = []
        for location in locations:
            coordinates.append([float(location.longitude), float(location.latitude)])

        try:
            router = OSRM(base_url=settings.OSRM_API_URL)
            route = router.directions(
                locations=coordinates,
                profile='driving'
            )

            if not route:
                return Response({'error': 'Não foi possível calcular a rota.'}, status=status.HTTP_400_BAD_REQUEST)

            waypoints_data = []
            for location in locations:
                waypoints_data.append({
                    'id': location.id,
                    'name': location.name,
                    'coordinates': [float(location.latitude), float(location.longitude)],
                })

            return Response({
                'distance': route.distance, #metros
                'duration': route.duration, #segundos
                'geometry': route.geometry,
                'waypoints': waypoints_data,
            })

        except Exception as e:
            return Response({'error': f'Erro ao calcular rota: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

