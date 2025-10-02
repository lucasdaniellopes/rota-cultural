from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Itinerary(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='itineraries')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Roteiro"
        verbose_name_plural = "Roteiros"
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class ItineraryItem(models.Model):
    ITEM_TYPES = [
        ('tourist_spot', 'Ponto Turístico'),
        ('event', 'Evento'),
    ]

    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name='items')
    order = models.IntegerField()
    item_type = models.CharField(max_length=15, choices=ITEM_TYPES)
    item_id = models.PositiveIntegerField()
    estimated_arrival = models.TimeField(null=True, blank=True)
    estimated_departure = models.TimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Item do Roteiro"
        verbose_name_plural = "Itens dos Roteiros"
        ordering = ['itinerary', 'order']
        unique_together = ['itinerary', 'order']

    def __str__(self):
        return f"{self.itinerary.name} - Item {self.order}"