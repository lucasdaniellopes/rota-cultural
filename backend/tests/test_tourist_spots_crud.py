import pytest
from django.contrib.auth import get_user_model
from rota_cultural.apps.places.models import TouristSpot
from rota_cultural.apps.categories.models import Category
from rota_cultural.apps.addresses.models import Address

User = get_user_model()


@pytest.mark.django_db
class TestTouristSpotCRUD:
    """Testes CRUD para TouristSpot"""

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )

    @pytest.fixture
    def category(self):
        return Category.objects.create(
            name='Museu',
            item_type='tourist_spot'
        )

    @pytest.fixture
    def address(self):
        from django.contrib.gis.geos import Point
        return Address.objects.create(
            street='Rua Teste',
            number='123',
            neighborhood='Centro',
            city='Patos',
            state='PB',
            postal_code='58700-000',
            point=Point(-37.2744, -7.0227, srid=4326)
        )

    def test_create_tourist_spot(self, user, category, address):
        """Teste de criação de ponto turístico"""
        spot = TouristSpot.objects.create(
            name='Museu Teste',
            description='Descrição do museu',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )
        
        assert spot.id is not None
        assert spot.name == 'Museu Teste'
        assert spot.category == category
        assert spot.address == address

    def test_read_tourist_spot(self, user, category, address):
        """Teste de leitura de ponto turístico"""
        spot = TouristSpot.objects.create(
            name='Museu Teste',
            description='Descrição do museu',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )
        
        retrieved_spot = TouristSpot.objects.get(id=spot.id)
        assert retrieved_spot.name == 'Museu Teste'
        assert retrieved_spot.description == 'Descrição do museu'

    def test_update_tourist_spot(self, user, category, address):
        """Teste de atualização de ponto turístico"""
        spot = TouristSpot.objects.create(
            name='Museu Teste',
            description='Descrição do museu',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )
        
        spot.name = 'Museu Atualizado'
        spot.description = 'Nova descrição'
        spot.save()
        
        updated_spot = TouristSpot.objects.get(id=spot.id)
        assert updated_spot.name == 'Museu Atualizado'
        assert updated_spot.description == 'Nova descrição'

    def test_delete_tourist_spot(self, user, category, address):
        """Teste de exclusão de ponto turístico"""
        spot = TouristSpot.objects.create(
            name='Museu Teste',
            description='Descrição do museu',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )
        
        spot_id = spot.id
        spot.delete()
        
        assert not TouristSpot.objects.filter(id=spot_id).exists()

    def test_list_tourist_spots(self, user, category, address):
        """Teste de listagem de pontos turísticos"""
        TouristSpot.objects.create(
            name='Museu 1',
            description='Descrição 1',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )
        TouristSpot.objects.create(
            name='Museu 2',
            description='Descrição 2',
            category=category,
            address=address,
            opening_time='08:00:00',
            closing_time='18:00:00',
            organizer=user
        )
        
        spots = TouristSpot.objects.all()
        assert spots.count() == 2
