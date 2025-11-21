from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from rota_cultural.apps.events.models import Event
from .serializers import EventSerializer, EventListSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'content_type']
    search_fields = ['name', 'description']
    ordering_fields = ['start_date', 'name', 'price']
    ordering = ['start_date']

    def get_queryset(self):
        queryset = Event.objects.select_related(
            'category', 'organizer', 'content_type'
        )

        today = timezone.now().date()
        filter_type = self.request.query_params.get('filter', 'all')

        if filter_type == 'upcoming':
            queryset = queryset.filter(end_date__gte=today)
        elif filter_type == 'past':
            queryset = queryset.filter(end_date__lt=today)
        elif filter_type == 'today':
            queryset = queryset.filter(start_date__lte=today, end_date__gte=today)

        price_filter = self.request.query_params.get('price_filter')
        if price_filter == 'free':
            queryset = queryset.filter(price=0)
        elif price_filter == 'paid':
            queryset = queryset.filter(price__gt=0)

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.organizer != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only modify your own events')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.organizer != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only delete your own events')
        instance.delete()

    @action(detail=False, methods=['get'])
    def my_events(self, request):
        events = Event.objects.filter(organizer=request.user)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path=r'by-location/(?P<content_type>[\w-]+)/(?P<object_id>[\d]+)')
    def by_location(self, request, content_type=None, object_id=None):
        try:
            ct = ContentType.objects.get(model=content_type)
            events = Event.objects.filter(
                content_type=ct,
                object_id=object_id
            ).select_related('category', 'organizer')

            serializer = EventListSerializer(events, many=True)
            return Response(serializer.data)
        except ContentType.DoesNotExist:
            return Response(
                {'error': f'Content type {content_type} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def featured(self, request):
        events = Event.objects.filter(
            start_date__gte=timezone.now().date()
        ).order_by('start_date')[:10]

        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)