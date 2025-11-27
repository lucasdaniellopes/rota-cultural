import pytest
from django.contrib.auth import get_user_model
from rota_cultural.apps.favorites.models import Favorite
from rota_cultural.apps.places.models import TouristSpot
from rota_cultural.apps.categories.models import Category
from rota_cultural.apps.addresses.models import Address

User = get_user_model()


@pytest.mark.django_db
class TestFavoriteCRUD:
    """Testes CRUD para Favorite"""

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )

    @pytest.fixture
    def tourist_spot(self, user):
        from django.contrib.gis.geos import Point
        category = Category.objects.create(name='Museu', item_type='tourist_spot')
        address = Address.objects.create(
            street='Rua Teste',
            number='123',
            neighborhood='Centro',
            city='Patos',
            state='PB',
            postal_code='58700-000',
            point=Point(-37.2744, -7.0227, srid=4326)
        )
        return TouristSpot.objects.create(
            name='Museu Teste',
            description='Descrição',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )

    def test_create_favorite(self, user, tourist_spot):
        """Teste de criação de favorito"""
        favorite = Favorite.objects.create(
            user=user,
            object_id=tourist_spot.id,
            content_type_id=1
        )
        
        assert favorite.id is not None
        assert favorite.user == user
        assert favorite.object_id == tourist_spot.id

    def test_read_favorite(self, user, tourist_spot):
        """Teste de leitura de favorito"""
        favorite = Favorite.objects.create(
            user=user,
            object_id=tourist_spot.id,
            content_type_id=1
        )
        
        retrieved_favorite = Favorite.objects.get(id=favorite.id)
        assert retrieved_favorite.user == user
        assert retrieved_favorite.object_id == tourist_spot.id

    def test_delete_favorite(self, user, tourist_spot):
        """Teste de exclusão de favorito"""
        favorite = Favorite.objects.create(
            user=user,
            object_id=tourist_spot.id,
            content_type_id=1
        )
        
        favorite_id = favorite.id
        favorite.delete()
        
        assert not Favorite.objects.filter(id=favorite_id).exists()

    def test_list_favorites(self, user, tourist_spot):
        """Teste de listagem de favoritos"""
        Favorite.objects.create(
            user=user,
            object_id=tourist_spot.id,
            content_type_id=1
        )
        Favorite.objects.create(
            user=user,
            object_id=tourist_spot.id + 1,
            content_type_id=1
        )
        
        favorites = Favorite.objects.filter(user=user)
        assert favorites.count() == 2

    def test_unique_favorite(self, user, tourist_spot):
        """Teste de unicidade de favorito"""
        Favorite.objects.create(
            user=user,
            object_id=tourist_spot.id,
            content_type_id=1
        )
        
        # Tentar criar favorito duplicado deve falhar
        with pytest.raises(Exception):
            Favorite.objects.create(
                user=user,
                object_id=tourist_spot.id,
                content_type_id=1
            )
