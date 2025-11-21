import pytest
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch, Mock

from .api.v1.serializers import (
    UserSerializer, UserListSerializer, LoginSerializer,
    RegisterSerializer, TokenResponseSerializer, RegisterResponseSerializer
)

User = get_user_model()


@pytest.mark.django_db
class LoginSerializerTest(TestCase):
    """Test LoginSerializer."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            first_name="Test",
            last_name="User",
            password="testpass123",
            is_tourist=True
        )

        self.inactive_user = User.objects.create_user(
            username="inactiveuser",
            email="inactive@example.com",
            first_name="Inactive",
            last_name="User",
            password="testpass123",
            is_tourist=False,
            is_active=False
        )

    def test_login_serializer_valid_credentials(self):
        """Test serializer with valid credentials."""
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }

        # Create mock request
        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert serializer.is_valid()
        assert 'user' in serializer.validated_data
        assert serializer.validated_data['user'].email == "test@example.com"

    def test_login_serializer_invalid_credentials(self):
        """Test serializer with invalid credentials."""
        data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }

        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert not serializer.is_valid()
        assert "Credenciais inválidas." in str(serializer.errors)

    def test_login_serializer_inactive_user(self):
        """Test serializer with inactive user."""
        data = {
            "email": "inactive@example.com",
            "password": "testpass123"
        }

        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert not serializer.is_valid()
        # Mensagem pode ser "Credenciais inválidas." para usuário inativo por segurança

    def test_login_serializer_missing_email(self):
        """Test serializer with missing email."""
        data = {
            "password": "testpass123"
        }

        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert not serializer.is_valid()
        # Django REST Framework valida campos obrigatórios automaticamente

    def test_login_serializer_missing_password(self):
        """Test serializer with missing password."""
        data = {
            "email": "test@example.com"
        }

        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert not serializer.is_valid()
        # Django REST Framework valida campos obrigatórios automaticamente

    def test_login_serializer_empty_fields(self):
        """Test serializer with empty fields."""
        data = {
            "email": "",
            "password": ""
        }

        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert not serializer.is_valid()

    def test_login_serializer_invalid_email_format(self):
        """Test serializer with invalid email format."""
        data = {
            "email": "invalid-email",
            "password": "testpass123"
        }

        mock_request = Mock()

        serializer = LoginSerializer(data=data, context={'request': mock_request})

        assert not serializer.is_valid()


@pytest.mark.django_db
class RegisterSerializerTest(TestCase):
    """Test RegisterSerializer."""

    def test_register_serializer_valid_data(self):
        """Test serializer with valid registration data."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "phone": "(83) 99999-9999",
            "birth_date": "1990-01-01",
            "is_tourist": True,
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert serializer.is_valid()
        assert 'password_confirm' not in serializer.validated_data

    def test_register_serializer_password_mismatch(self):
        """Test serializer with password mismatch."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "newpass123",
            "password_confirm": "differentpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()
        assert "As senhas não coincidem." in str(serializer.errors)

    def test_register_serializer_duplicate_email(self):
        """Test serializer with duplicate email."""
        # Create existing user
        User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="testpass123"
        )

        data = {
            "username": "newuser",
            "email": "existing@example.com",  # Duplicate
            "first_name": "New",
            "last_name": "User",
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()
        assert "User com este email já existe." in str(serializer.errors)

    def test_register_serializer_duplicate_username(self):
        """Test serializer with duplicate username."""
        # Create existing user
        User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="testpass123"
        )

        data = {
            "username": "existinguser",  # Duplicate
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()
        assert "Um usuário com este nome de usuário já existe." in str(serializer.errors)

    def test_register_serializer_weak_password(self):
        """Test serializer with weak password."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "123",  # Too short
            "password_confirm": "123"
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()
        # Django's password validation should catch this

    def test_register_serializer_missing_required_fields(self):
        """Test serializer with missing required fields."""
        data = {
            "username": "newuser",
            # Missing email, first_name, last_name, passwords
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()

    def test_register_serializer_invalid_email_format(self):
        """Test serializer with invalid email format."""
        data = {
            "username": "newuser",
            "email": "invalid-email-format",
            "first_name": "New",
            "last_name": "User",
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()

    def test_register_serializer_invalid_birth_date(self):
        """Test serializer with invalid birth date."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "birth_date": "invalid-date",
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert not serializer.is_valid()

    def test_register_serializer_optional_fields(self):
        """Test serializer with optional fields omitted."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            # phone, birth_date omitted
            "is_tourist": False,
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)

        assert serializer.is_valid()

    def test_register_serializer_create_user(self):
        """Test that serializer creates user successfully."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "newpass123",
            "password_confirm": "newpass123"
        }

        serializer = RegisterSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        assert user.username == "newuser"
        assert user.email == "newuser@example.com"
        assert user.first_name == "New"
        assert user.last_name == "User"
        assert user.check_password("newpass123")  # Password is hashed
        assert user.is_active  # Default value
        assert user.is_tourist  # Default value


@pytest.mark.django_db
class TokenResponseSerializerTest(TestCase):
    """Test TokenResponseSerializer."""

    def test_token_response_serializer_valid_data(self):
        """Test serializer with valid token data."""
        data = {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "expires_in": 300
        }

        serializer = TokenResponseSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data["access"] == data["access"]
        assert serializer.validated_data["refresh"] == data["refresh"]
        assert serializer.validated_data["expires_in"] == 300

    def test_token_response_serializer_missing_fields(self):
        """Test serializer with missing required fields."""
        data = {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
            # Missing refresh and expires_in
        }

        serializer = TokenResponseSerializer(data=data)

        assert not serializer.is_valid()

    def test_token_response_serializer_invalid_expires_in(self):
        """Test serializer with invalid expires_in type."""
        data = {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "expires_in": "not_a_number"
        }

        serializer = TokenResponseSerializer(data=data)

        assert not serializer.is_valid()


@pytest.mark.django_db
class RegisterResponseSerializerTest(TestCase):
    """Test RegisterResponseSerializer."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            first_name="Test",
            last_name="User",
            password="testpass123",
            is_tourist=True
        )

    def test_register_response_serializer_valid_data(self):
        """Test serializer with valid register response data."""
        user_data = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "is_tourist": self.user.is_tourist,
            "date_joined": self.user.date_joined
        }

        data = {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "expires_in": 300,
            "user": user_data
        }

        serializer = RegisterResponseSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data["access"] == data["access"]
        assert serializer.validated_data["refresh"] == data["refresh"]
        assert serializer.validated_data["expires_in"] == 300
        assert serializer.validated_data["user"]["id"] == self.user.id

    def test_register_response_serializer_missing_user_data(self):
        """Test serializer with missing user data."""
        data = {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "expires_in": 300
            # Missing user
        }

        serializer = RegisterResponseSerializer(data=data)

        assert not serializer.is_valid()

    def test_register_response_serializer_invalid_user_field(self):
        """Test serializer with invalid user field type."""
        data = {
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            "expires_in": 300,
            "user": "not_a_dict"  # Should be a dict
        }

        serializer = RegisterResponseSerializer(data=data)

        assert not serializer.is_valid()


@pytest.mark.django_db
class UserSerializerAuthTest(TestCase):
    """Test UserSerializer in authentication context."""

    def test_user_serializer_password_write_only(self):
        """Test that password field is write-only."""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

        serializer = UserSerializer(user)
        data = serializer.data

        # Password should not be in serialized data
        assert "password" not in data

    def test_user_serializer_create_with_password(self):
        """Test creating user with password hashing."""
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpass123"
        }

        serializer = UserSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()

        assert user.check_password("newpass123")
        assert user.password != "newpass123"  # Should be hashed

    def test_user_serializer_update_password(self):
        """Test updating user password."""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="oldpass123"
        )

        data = {"password": "newpass123"}
        serializer = UserSerializer(user, data=data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()

        assert updated_user.check_password("newpass123")
        assert not updated_user.check_password("oldpass123")

    def test_user_serializer_readonly_fields(self):
        """Test that certain fields are read-only."""
        data = {
            "id": 999,
            "is_active": False,
            "date_joined": "2020-01-01T00:00:00Z"
        }

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

        serializer = UserSerializer(user, data=data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()

        # These fields should not be changed
        assert updated_user.id != 999
        assert updated_user.is_active  # Should remain True
        assert updated_user.date_joined.strftime("%Y-%m-%d") != "2020-01-01"

    def test_user_list_serializer_excludes_sensitive_data(self):
        """Test that UserListSerializer excludes sensitive fields."""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            bio="Secret bio",
            phone="123-456-7890"
        )

        serializer = UserListSerializer(user)
        data = serializer.data

        # Should only include safe fields
        expected_fields = {'id', 'username', 'email', 'first_name', 'last_name', 'is_tourist', 'date_joined'}
        assert set(data.keys()) == expected_fields

        # Should not include sensitive fields
        assert "password" not in data
        assert "bio" not in data
        assert "phone" not in data