from rest_framework import serializers
from rota_cultural.apps.events.models import Event
from rota_cultural.apps.categories.models import Category
from rota_cultural.apps.locations.models import Location
from django.utils import timezone
from zoneinfo import ZoneInfo
from datetime import datetime

class EventSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    organizer_name = serializers.SerializerMethodField()
    location_type = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)
    image_url = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    
    # Campos opcionais para criar location com coordenadas
    location_name_input = serializers.CharField(required=False, write_only=True, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=11, decimal_places=8, required=False, write_only=True)
    longitude = serializers.DecimalField(max_digits=12, decimal_places=8, required=False, write_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date',
            'start_time', 'end_time', 'price', 'accessibility', 'image', 'image_url',
            'category', 'category_name', 'organizer', 'organizer_name',
            'content_type', 'object_id', 'location_type', 'location_name',
            'location_name_input', 'latitude', 'longitude',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organizer', 'created_at', 'updated_at', 'content_type', 'object_id']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_organizer_name(self, obj):
        return obj.organizer.username if obj.organizer else None

    def get_location_type(self, obj):
        return obj.content_type.model if obj.content_type else None

    def get_location_name(self, obj):
        return str(obj.location) if obj.location else None

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

    def get_price_display(self, obj):
        return float(obj.price)

    def create(self, validated_data):
        # Extrair dados de localização opcionais
        location_name = validated_data.pop('location_name_input', None)
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)

        # Adicionar timezone aos datetimes se não tiverem
        start_date = validated_data.get('start_date')
        end_date = validated_data.get('end_date')
        
        if start_date and not start_date.tzinfo:
            # Usar timezone do Brasil
            tz = ZoneInfo('America/Fortaleza')
            validated_data['start_date'] = start_date.replace(tzinfo=tz)
        
        if end_date and not end_date.tzinfo:
            tz = ZoneInfo('America/Fortaleza')
            validated_data['end_date'] = end_date.replace(tzinfo=tz)

        # Se coordenadas forem fornecidas, criar ou buscar localização
        if latitude and longitude and location_name:
            location, _ = Location.objects.get_or_create(
                latitude=latitude,
                longitude=longitude,
                defaults={'name': location_name, 'description': f'Evento em {location_name}'}
            )
            
            from django.contrib.contenttypes.models import ContentType
            content_type = ContentType.objects.get_for_model(Location)
            
            validated_data['content_type'] = content_type
            validated_data['object_id'] = location.id

        event = Event.objects.create(**validated_data)
        return event

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError('Start date must be before end date.')

        if start_date == end_date and start_time and end_time and start_time > end_time:
            raise serializers.ValidationError('Start time must be before end time.')

        return data

    def validate_price(self, value):
        # Ensure price is not empty or None
        if value is None or value == '':
            raise serializers.ValidationError('Price is required.')
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value

class EventListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    is_free = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'start_date', 'end_date',
            'start_time', 'end_time', 'price', 'is_free',
            'category_name', 'location_name', 'image_url'
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_location_name(self, obj):
        return str(obj.location) if obj.location else None

    def get_is_free(self, obj):
        return obj.price == 0

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None