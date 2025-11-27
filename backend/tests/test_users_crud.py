import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestUserCRUD:
    """Testes CRUD para User"""

    def test_create_user(self):
        """Teste de criação de usuário"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        assert user.id is not None
        assert user.email == 'test@example.com'
        assert user.full_name == 'Test User'
        assert user.check_password('testpass123')

    def test_read_user(self):
        """Teste de leitura de usuário"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        retrieved_user = User.objects.get(id=user.id)
        assert retrieved_user.email == 'test@example.com'
        assert retrieved_user.full_name == 'Test User'

    def test_update_user(self):
        """Teste de atualização de usuário"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        user.full_name = 'Updated User'
        user.save()
        
        updated_user = User.objects.get(id=user.id)
        assert updated_user.full_name == 'Updated User'

    def test_delete_user(self):
        """Teste de exclusão de usuário"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        user_id = user.id
        user.delete()
        
        assert not User.objects.filter(id=user_id).exists()

    def test_list_users(self):
        """Teste de listagem de usuários"""
        User.objects.create_user(
            email='user1@example.com',
            password='testpass123',
            full_name='User 1'
        )
        User.objects.create_user(
            email='user2@example.com',
            password='testpass123',
            full_name='User 2'
        )
        
        users = User.objects.all()
        assert users.count() == 2

    def test_create_superuser(self):
        """Teste de criação de superusuário"""
        superuser = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            full_name='Admin User'
        )
        
        assert superuser.is_staff is True
        assert superuser.is_superuser is True

    def test_user_email_unique(self):
        """Teste de unicidade de email"""
        User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        
        # Tentar criar usuário com email duplicado deve falhar
        with pytest.raises(Exception):
            User.objects.create_user(
                email='test@example.com',
                password='testpass456',
                full_name='Another User'
            )
