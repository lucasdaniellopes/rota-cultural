from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Avg

from rota_cultural.apps.reviews.models import Review, ReviewVote
from .serializers import ReviewSerializer, ReviewListSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['content_type', 'rating']
    search_fields = ['comment', 'user__username']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Review.objects.select_related('user', 'content_type')

        content_type = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')

        if content_type and object_id:
            try:
                ct = ContentType.objects.get(model=content_type)
                queryset = queryset.filter(content_type=ct, object_id=object_id)
            except ContentType.DoesNotExist:
                pass

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return ReviewListSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only modify your own reviews')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You can only delete your own reviews')
        instance.delete()

    @action(detail=False, methods=['get'], url_path=r'by-type/(?P<content_type>[\w-]+)/(?P<object_id>[\d]+)')
    def by_object(self, request, content_type=None, object_id=None):
        try:
            ct = ContentType.objects.get(model=content_type)
            reviews = Review.objects.filter(
                content_type=ct,
                object_id=object_id
            ).select_related('user')

            serializer = ReviewListSerializer(reviews, many=True)

            avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']

            return Response({
                'reviews': serializer.data,
                'average_rating': round(avg_rating, 1) if avg_rating else 0,
                'total_reviews': reviews.count()
            })
        except ContentType.DoesNotExist:
            return Response(
                {'error': f'Content type {content_type} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], url_path='my-reviews', permission_classes=[IsAuthenticated])
    def my_reviews(self, request):
        reviews = Review.objects.filter(user=request.user)
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_helpful(self, request, pk=None):
        review = self.get_object()
        user = request.user

        try:
            vote = ReviewVote.objects.get(user=user, review=review)
            vote.delete()
            review.helpful_count = max(0, review.helpful_count - 1)
            review.save()
            return Response({'status': 'unmarked', 'helpful_count': review.helpful_count})
        except ReviewVote.DoesNotExist:
            ReviewVote.objects.create(user=user, review=review)
            review.helpful_count += 1
            review.save()
            return Response({'status': 'marked', 'helpful_count': review.helpful_count})