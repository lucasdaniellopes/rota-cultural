from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend

from rota_cultural.apps.favorites.models import Favorite
from .serializers import FavoriteSerializer, FavoriteListSerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['content_type']

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return FavoriteListSerializer
        return FavoriteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path=r'by-type/(?P<content_type>[\w-]+)')
    def by_type(self, request, content_type=None):
        try:
            ct = ContentType.objects.get(model=content_type)
            favorites = self.get_queryset().filter(content_type=ct)
            serializer = self.get_serializer(favorites, many=True)
            return Response(serializer.data)
        except ContentType.DoesNotExist:
            return Response(
                {'error': f'Content type {content_type} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'], url_path='check-favorite')
    def check_favorite(self, request):
        content_type_id = request.data.get('content_type')
        object_id = request.data.get('object_id')

        try:
            content_type = ContentType.objects.get(id=content_type_id)
            is_favorite = Favorite.objects.filter(
                user=request.user,
                content_type=content_type,
                object_id=object_id
            ).exists()
            return Response({'is_favorite': is_favorite})
        except ContentType.DoesNotExist:
            return Response(
                {'error': 'Content type not found'},
                status=status.HTTP_404_NOT_FOUND
            )