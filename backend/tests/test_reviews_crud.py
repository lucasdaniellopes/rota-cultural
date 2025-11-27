import pytest
from django.contrib.auth import get_user_model
from rota_cultural.apps.reviews.models import Review
from rota_cultural.apps.places.models import TouristSpot
from rota_cultural.apps.categories.models import Category
from rota_cultural.apps.addresses.models import Address

User = get_user_model()


@pytest.mark.django_db
class TestReviewCRUD:
    """Testes CRUD para Review"""

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

    def test_create_review(self, user, tourist_spot):
        """Teste de criação de avaliação"""
        review = Review.objects.create(
            user=user,
            content_type_id=tourist_spot.id,
            object_id=tourist_spot.id,
            rating=5,
            title='Excelente!',
            comment='Lugar muito bom'
        )
        
        assert review.id is not None
        assert review.rating == 5
        assert review.title == 'Excelente!'
        assert review.user == user

    def test_read_review(self, user, tourist_spot):
        """Teste de leitura de avaliação"""
        review = Review.objects.create(
            user=user,
            content_type_id=tourist_spot.id,
            object_id=tourist_spot.id,
            rating=5,
            title='Excelente!',
            comment='Lugar muito bom'
        )
        
        retrieved_review = Review.objects.get(id=review.id)
        assert retrieved_review.title == 'Excelente!'
        assert retrieved_review.comment == 'Lugar muito bom'

    def test_update_review(self, user, tourist_spot):
        """Teste de atualização de avaliação"""
        review = Review.objects.create(
            user=user,
            content_type_id=tourist_spot.id,
            object_id=tourist_spot.id,
            rating=5,
            title='Excelente!',
            comment='Lugar muito bom'
        )
        
        review.rating = 4
        review.title = 'Muito bom'
        review.comment = 'Lugar interessante'
        review.save()
        
        updated_review = Review.objects.get(id=review.id)
        assert updated_review.rating == 4
        assert updated_review.title == 'Muito bom'

    def test_delete_review(self, user, tourist_spot):
        """Teste de exclusão de avaliação"""
        review = Review.objects.create(
            user=user,
            content_type_id=tourist_spot.id,
            object_id=tourist_spot.id,
            rating=5,
            title='Excelente!',
            comment='Lugar muito bom'
        )
        
        review_id = review.id
        review.delete()
        
        assert not Review.objects.filter(id=review_id).exists()

    def test_list_reviews(self, user, tourist_spot):
        """Teste de listagem de avaliações"""
        Review.objects.create(
            user=user,
            content_type_id=tourist_spot.id,
            object_id=tourist_spot.id,
            rating=5,
            title='Excelente!',
            comment='Muito bom'
        )
        Review.objects.create(
            user=user,
            content_type_id=tourist_spot.id,
            object_id=tourist_spot.id,
            rating=4,
            title='Bom',
            comment='Legal'
        )
        
        reviews = Review.objects.all()
        assert reviews.count() == 2
