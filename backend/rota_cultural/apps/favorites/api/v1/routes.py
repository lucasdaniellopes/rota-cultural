from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .viewsets import FavoriteViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
]