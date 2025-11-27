import pytest
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rota_cultural.apps.events.models import Event
from rota_cultural.apps.categories.models import Category
from rota_cultural.apps.locations.models import Location

User = get_user_model()


@pytest.mark.django_db
class TestEventCRUD:
    """Testes CRUD para Event"""

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
            name='Show',
            item_type='event'
        )

    @pytest.fixture
    def location(self):
        from django.contrib.gis.geos import Point
        return Location.objects.create(
            name='Teatro Municipal',
            description='Teatro da cidade',
            latitude=-7.0227,
            longitude=-37.2744,
            point=Point(-37.2744, -7.0227, srid=4326)
        )

    def test_create_event(self, user, category, location):
        """Teste de criação de evento"""
        start_date = datetime.now()
        end_date = start_date + timedelta(days=1)
        
        content_type = ContentType.objects.get_for_model(location)
        
        event = Event.objects.create(
            name='Show Teste',
            description='Descrição do show',
            category=category,
            start_date=start_date,
            end_date=end_date,
            start_time='20:00:00',
            end_time='23:00:00',
            price=50.00,
            organizer=user,
            content_type=content_type,
            object_id=location.id
        )
        
        assert event.id is not None
        assert event.name == 'Show Teste'
        assert event.category == category
        assert event.price == 50.00

    def test_read_event(self, user, category, location):
        """Teste de leitura de evento"""
        start_date = datetime.now()
        end_date = start_date + timedelta(days=1)
        
        content_type = ContentType.objects.get_for_model(location)
        
        event = Event.objects.create(
            name='Show Teste',
            description='Descrição do show',
            category=category,
            start_date=start_date,
            end_date=end_date,
            start_time='20:00:00',
            end_time='23:00:00',
            price=50.00,
            organizer=user,
            content_type=content_type,
            object_id=location.id
        )
        
        retrieved_event = Event.objects.get(id=event.id)
        assert retrieved_event.name == 'Show Teste'
        assert retrieved_event.location == location

    def test_update_event(self, user, category, location):
        """Teste de atualização de evento"""
        start_date = datetime.now()
        end_date = start_date + timedelta(days=1)
        
        content_type = ContentType.objects.get_for_model(location)
        
        event = Event.objects.create(
            name='Show Teste',
            description='Descrição do show',
            category=category,
            start_date=start_date,
            end_date=end_date,
            start_time='20:00:00',
            end_time='23:00:00',
            price=50.00,
            organizer=user,
            content_type=content_type,
            object_id=location.id
        )
        
        event.name = 'Show Atualizado'
        event.price = 60.00
        event.save()
        
        updated_event = Event.objects.get(id=event.id)
        assert updated_event.name == 'Show Atualizado'
        assert updated_event.price == 60.00

    def test_delete_event(self, user, category, location):
        """Teste de exclusão de evento"""
        start_date = datetime.now()
        end_date = start_date + timedelta(days=1)
        
        content_type = ContentType.objects.get_for_model(location)
        
        event = Event.objects.create(
            name='Show Teste',
            description='Descrição do show',
            category=category,
            start_date=start_date,
            end_date=end_date,
            start_time='20:00:00',
            end_time='23:00:00',
            price=50.00,
            organizer=user,
            content_type=content_type,
            object_id=location.id
        )
        
        event_id = event.id
        event.delete()
        
        assert not Event.objects.filter(id=event_id).exists()

    def test_list_events(self, user, category, location):
        """Teste de listagem de eventos"""
        start_date = datetime.now()
        end_date = start_date + timedelta(days=1)
        
        content_type = ContentType.objects.get_for_model(location)
        
        Event.objects.create(
            name='Show 1',
            description='Descrição 1',
            category=category,
            start_date=start_date,
            end_date=end_date,
            start_time='20:00:00',
            end_time='23:00:00',
            price=50.00,
            organizer=user,
            content_type=content_type,
            object_id=location.id
        )
        Event.objects.create(
            name='Show 2',
            description='Descrição 2',
            category=category,
            start_date=start_date,
            end_date=end_date,
            start_time='20:00:00',
            end_time='23:00:00',
            price=60.00,
            organizer=user,
            content_type=content_type,
            object_id=location.id
        )
        
        events = Event.objects.all()
        assert events.count() == 2
