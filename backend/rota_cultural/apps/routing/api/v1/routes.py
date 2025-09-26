from rest_framework.routers import DefaultRouter
from .viewsets import RouteViewSet

router = DefaultRouter()

router.register(r'routes', RouteViewSet , basename='route')

urlpatterns = router.urls