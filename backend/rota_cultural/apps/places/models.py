from django.db import models
from rota_cultural.apps.categories.models import Category
from rota_cultural.apps.addresses.models import Address


class TouristSpot(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    accessibility = models.TextField(blank=True)

    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Tourist Spot"
        verbose_name_plural = "Tourist Spots"
        ordering = ['name']

    def __str__(self):
        return self.name


class Establishment(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    accessibility = models.TextField(blank=True)

    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Establishment"
        verbose_name_plural = "Establishments"
        ordering = ['name']

    def __str__(self):
        return self.name
