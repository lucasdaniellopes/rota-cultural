from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .viewsets import FavoriteViewSet, ContentTypeViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'contenttypes', ContentTypeViewSet, basename='contenttype')

urlpatterns = [
    path('', include(router.urls)),
]