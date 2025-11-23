from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    is_tourist = models.BooleanField(default=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.email})"
