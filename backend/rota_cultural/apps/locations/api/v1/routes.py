from rest_framework.routers import DefaultRouter
from .viewsets import LocationViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet)

urlpatterns = router.urls