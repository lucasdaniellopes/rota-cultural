from rest_framework import serializers
from rota_cultural.apps.addresses.models import Address

class AddressSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    full_address = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = [
            'id', 'street', 'number', 'complement', 'neighborhood',
            'city', 'state', 'postal_code', 'point', 'latitude',
            'longitude', 'full_address', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_latitude(self, obj):
        if obj.point:
            return obj.point.y
        return None

    def get_longitude(self, obj):
        if obj.point:
            return obj.point.x
        return None

    def get_full_address(self, obj):
        return str(obj)

    def validate_postal_code(self, value):
        import re
        if not re.match(r'^\d{5}-?\d{3}$', value):
            raise serializers.ValidationError('Invalid postal code format. Use XXXXX-XXX.')
        return value

class AddressListSerializer(serializers.ModelSerializer):
    full_address = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = ['id', 'full_address', 'neighborhood', 'city', 'state', 'postal_code']

    def get_full_address(self, obj):
        return str(obj)