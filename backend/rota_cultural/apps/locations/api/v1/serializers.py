from rest_framework import serializers
from rota_cultural.apps.locations.models import Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'latitude', 'longitude', 'created_at', 'updated_at']
        read_only_fields = ['created_at']