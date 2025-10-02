from django.db import models

class Category(models.Model):
    
    name = models.CharField(max_length=120, unique=True)

    ITEM_TYPES = [
        ("tourist_spot", "Ponto Turístico"),
        ("event", "Evento"),
        ("establishment", "Estabelecimento"),
    ]

    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.get_item_type_display()})"