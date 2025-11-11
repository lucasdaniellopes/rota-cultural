from rest_framework import serializers
from rota_cultural.apps.events.models import Event
from rota_cultural.apps.categories.models import Category

class EventSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    organizer_name = serializers.SerializerMethodField()
    location_type = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date',
            'start_time', 'end_time', 'price', 'accessibility',
            'category', 'category_name', 'organizer', 'organizer_name',
            'content_type', 'object_id', 'location_type', 'location_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organizer', 'created_at', 'updated_at']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_organizer_name(self, obj):
        return obj.organizer.username if obj.organizer else None

    def get_location_type(self, obj):
        return obj.content_type.model if obj.content_type else None

    def get_location_name(self, obj):
        return str(obj.location) if obj.location else None

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
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value

class EventListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    is_free = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'start_date', 'end_date',
            'start_time', 'end_time', 'price', 'is_free',
            'category_name', 'location_name'
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_location_name(self, obj):
        return str(obj.location) if obj.location else None

    def get_is_free(self, obj):
        return obj.price == 0