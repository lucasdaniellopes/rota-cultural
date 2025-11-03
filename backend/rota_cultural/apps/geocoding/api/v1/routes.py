from rest_framework.routers import DefaultRouter
from .viewsets import GeocodingViewSet

router = DefaultRouter()
router.register(r'geocoding', GeocodingViewSet, basename='geocoding')

urlpatterns = router.urls