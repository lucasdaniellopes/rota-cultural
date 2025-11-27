import pytest
from rota_cultural.apps.categories.models import Category


@pytest.mark.django_db
class TestCategoryCRUD:
    """Testes CRUD para Category"""

    def test_create_category(self):
        """Teste de criação de categoria"""
        category = Category.objects.create(
            name='Museu',
            item_type='tourist_spot'
        )
        
        assert category.id is not None
        assert category.name == 'Museu'
        assert category.item_type == 'tourist_spot'

    def test_read_category(self):
        """Teste de leitura de categoria"""
        category = Category.objects.create(
            name='Museu',
            item_type='tourist_spot'
        )
        
        retrieved_category = Category.objects.get(id=category.id)
        assert retrieved_category.name == 'Museu'
        assert retrieved_category.item_type == 'tourist_spot'

    def test_update_category(self):
        """Teste de atualização de categoria"""
        category = Category.objects.create(
            name='Museu',
            item_type='tourist_spot'
        )
        
        category.name = 'Museu Histórico'
        category.save()
        
        updated_category = Category.objects.get(id=category.id)
        assert updated_category.name == 'Museu Histórico'

    def test_delete_category(self):
        """Teste de exclusão de categoria"""
        category = Category.objects.create(
            name='Museu',
            item_type='tourist_spot'
        )
        
        category_id = category.id
        category.delete()
        
        assert not Category.objects.filter(id=category_id).exists()

    def test_list_categories(self):
        """Teste de listagem de categorias"""
        Category.objects.create(name='Museu', item_type='tourist_spot')
        Category.objects.create(name='Parque', item_type='tourist_spot')
        Category.objects.create(name='Show', item_type='event')
        
        categories = Category.objects.all()
        assert categories.count() == 3
        
        tourist_spot_categories = Category.objects.filter(item_type='tourist_spot')
        assert tourist_spot_categories.count() == 2

    def test_category_str(self):
        """Teste do método __str__ da categoria"""
        category = Category.objects.create(
            name='Museu',
            item_type='tourist_spot'
        )
        
        assert str(category) == 'Museu (Ponto Turístico)'
