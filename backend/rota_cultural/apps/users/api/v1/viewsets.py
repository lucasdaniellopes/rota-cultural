from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings

from rota_cultural.apps.users.models import User
from .serializers import UserSerializer, UserListSerializer, LoginSerializer, TokenResponseSerializer, RegisterSerializer, RegisterResponseSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_tourist', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'username', 'email']
    ordering = ['-date_joined']

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return []
        elif self.action in ['destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch', 'put'], permission_classes=[IsAuthenticated])
    def me_update(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'user activated'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': 'user deactivated'})


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    @action(detail=False, methods=['post'], url_path='register', serializer_class=RegisterSerializer)
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_tourist': user.is_tourist,
            'date_joined': user.date_joined
        }

        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'expires_in': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            'user': user_data
        }

        response_serializer = RegisterResponseSerializer(response_data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'expires_in': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
        }

        response_serializer = TokenResponseSerializer(response_data)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='token/refresh')
    def refresh_token(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token

            response_data = {
                'access': str(access_token),
                'expires_in': settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except TokenError:
            return Response(
                {'error': 'Refresh token inválido ou expirado'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    @action(
        detail=False,
        methods=['post'],
        url_path='logout',
        permission_classes=[IsAuthenticated]
    )
    def logout(self, request):
        refresh_token = request.data.get('refresh')

        # Simple logout - just return success
        # In production, consider implementing token blacklist
        return Response(
            {'message': 'Logout realizado com sucesso'},
            status=status.HTTP_200_OK
        )