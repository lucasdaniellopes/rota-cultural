from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .viewsets import TouristSpotViewSet, EstablishmentViewSet

router = DefaultRouter()
router.register(r'tourist-spots', TouristSpotViewSet, basename='tourist-spot')
router.register(r'establishments', EstablishmentViewSet, basename='establishment')

urlpatterns = [
    path('', include(router.urls)),
]
