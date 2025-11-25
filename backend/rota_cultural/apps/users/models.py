from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager as BaseUserManager
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        # Auto-generate username if not provided
        if 'username' not in extra_fields or not extra_fields.get('username'):
            extra_fields['username'] = f"user_{uuid.uuid4().hex[:12]}"
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    is_tourist = models.BooleanField(default=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Removed username since it's auto-generated

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['-date_joined']

    def save(self, *args, **kwargs):
        # Auto-generate username with UUID if not provided
        if not self.username:
            self.username = f"user_{uuid.uuid4().hex[:12]}"
        
        # Split full_name into first_name and last_name for Django compatibility
        if self.full_name:
            parts = self.full_name.strip().split(maxsplit=1)
            self.first_name = parts[0] if parts else ''
            self.last_name = parts[1] if len(parts) > 1 else ''
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.email})"
