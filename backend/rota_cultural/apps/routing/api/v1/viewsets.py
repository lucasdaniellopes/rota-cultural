from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.conf import settings
from rota_cultural.apps.locations.models import Location
from routingpy.routers import OSRM

class RouteViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def calculate(self, request):

        start_id = request.data.get('start_location_id')
        end_id = request.data.get('end_location_id')

        if not start_id or not end_id:
            return Response({'error': 'start_location_id and end_location_id são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_location = Location.objects.get(id=start_id)
            end_location = Location.objects.get(id=end_id)


            router = OSRM(base_url=settings.OSRM_API_URL)
            route = router.directions(
                locations=[
                    [float(start_location.longitude), float(start_location.latitude)],
                    [float(end_location.longitude), float(end_location.latitude)],
                ],
                profile='driving'
            )

            if not route:
                return Response({'error': 'Não foi possível calcular a rota.'}, status=status.HTTP_400_BAD_REQUEST)
            

            return Response({
                'distance': route.distance, #metros
                'duration': route.duration, #segundos
                'geometry': route.geometry,
                'start_location': {
                    'id': start_location.id,
                    'name': start_location.name,
                    'coordinates': [float(start_location.latitude), float(start_location.longitude)],
                },
                'end_location': {
                    'id': end_location.id,
                    'name': end_location.name,
                    'coordinates': [float(end_location.latitude), float(end_location.longitude)],
                }
            })
        
        except Location.DoesNotExist:
            return Response({'error': 'Location não encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({'error': f'Erro ao calcular rota: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

