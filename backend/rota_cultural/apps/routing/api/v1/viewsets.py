from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django.conf import settings
from rota_cultural.apps.locations.models import Location
from routingpy.routers import OSRM

class RouteViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    @action(detail=False, methods=['post'])
    def calculate(self, request):
        waypoint_ids = request.data.get('waypoint_ids', [])
        coordinates_input = request.data.get('coordinates', [])

        locations_coords = []
        waypoints_data = []

        # Opção 1: Usar IDs (para locais salvos)
        if waypoint_ids:
            for waypoint_id in waypoint_ids:
                try:
                    location = Location.objects.get(id=waypoint_id)
                    locations_coords.append([float(location.longitude), float(location.latitude)])
                    waypoints_data.append({
                        'id': location.id,
                        'name': location.name,
                        'coordinates': [float(location.latitude), float(location.longitude)],
                    })
                except Location.DoesNotExist:
                    # Se não achar pelo ID, ignora ou retorna erro? 
                    # Melhor retornar erro se o ID foi explicitamente passado
                    return Response({'error': f'Location com id {waypoint_id} não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Opção 2: Usar coordenadas diretas (para pontos temporários)
        elif coordinates_input:
            for coord in coordinates_input:
                # Espera [lat, lon] ou {lat, lon}
                if isinstance(coord, list) and len(coord) == 2:
                    lat, lon = coord
                elif isinstance(coord, dict):
                    lat = coord.get('lat') or coord.get('latitude')
                    lon = coord.get('lon') or coord.get('longitude')
                else:
                    continue
                
                if lat is not None and lon is not None:
                    locations_coords.append([float(lon), float(lat)]) # OSRM usa [lon, lat]
                    waypoints_data.append({
                        'id': None,
                        'name': 'Ponto Personalizado',
                        'coordinates': [float(lat), float(lon)],
                    })

        if len(locations_coords) < 2:
            return Response({'error': 'Pelo menos dois pontos são necessários.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            router = OSRM(base_url=settings.OSRM_API_URL)
            route = router.directions(
                locations=locations_coords,
                profile='driving'
            )

            if not route:
                return Response({'error': 'Não foi possível calcular a rota.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'distance': route.distance, #metros
                'duration': route.duration, #segundos
                'geometry': route.geometry,
                'waypoints': waypoints_data,
            })

        except Exception as e:
            return Response({'error': f'Erro ao calcular rota: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

