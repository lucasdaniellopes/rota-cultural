from django.db import models
from django.contrib.gis.db import models as gis_models

class Address(models.Model):
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    complement = models.CharField(max_length=255, blank=True, null=True)
    neighborhood = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    point = gis_models.PointField(srid=4326, geography=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        ordering = ["neighborhood"]

    def __str__(self):
        return f"{self.street}, {self.number} -  {self.city}, {self.state}"
