
from .viewsets import UserViewSet, AuthViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]