from rest_framework import serializers
from django.contrib.gis.geos import Point
from rota_cultural.apps.places.models import TouristSpot, Establishment
from rota_cultural.apps.addresses.models import Address
from rota_cultural.apps.categories.models import Category


class AddressSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = [
            'id', 'street', 'number', 'complement', 'neighborhood',
            'city', 'state', 'postal_code', 'latitude', 'longitude'
        ]

    def get_latitude(self, obj):
        if obj.point:
            return obj.point.y
        return None

    def get_longitude(self, obj):
        if obj.point:
            return obj.point.x
        return None


class TouristSpotSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    organizer_name = serializers.SerializerMethodField()
    address = AddressSerializer(read_only=True)
    image = serializers.ImageField(required=False)
    image_url = serializers.SerializerMethodField()
    
    # Campos opcionais para criar endereço com coordenadas
    address_name = serializers.CharField(required=False, write_only=True, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=11, decimal_places=8, required=False, write_only=True)
    longitude = serializers.DecimalField(max_digits=12, decimal_places=8, required=False, write_only=True)
    street = serializers.CharField(required=False, write_only=True, allow_blank=True)
    number = serializers.CharField(required=False, write_only=True, allow_blank=True)
    neighborhood = serializers.CharField(required=False, write_only=True, allow_blank=True)
    city = serializers.CharField(required=False, write_only=True, allow_blank=True)
    state = serializers.CharField(required=False, write_only=True, allow_blank=True)
    postal_code = serializers.CharField(required=False, write_only=True, allow_blank=True)

    class Meta:
        model = TouristSpot
        fields = [
            'id', 'name', 'description', 'opening_time', 'closing_time',
            'accessibility', 'address', 'category', 'category_name',
            'organizer', 'organizer_name',
            'image', 'image_url', 'address_name', 'latitude', 'longitude',
            'street', 'number', 'neighborhood', 'city', 'state', 'postal_code',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'organizer', 'created_at', 'updated_at']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_organizer_name(self, obj):
        return obj.organizer.username if obj.organizer else None

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        # Extrair dados de localização opcionais
        address_name = validated_data.pop('address_name', None)
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)
        street = validated_data.pop('street', None)
        number = validated_data.pop('number', None)
        neighborhood = validated_data.pop('neighborhood', None)
        city = validated_data.pop('city', None)
        state = validated_data.pop('state', None)
        postal_code = validated_data.pop('postal_code', None)

        # Se coordenadas forem fornecidas, criar endereço
        if latitude and longitude:
            # Criar Point com coordenadas (longitude, latitude)
            point = Point(float(longitude), float(latitude), srid=4326)
            
            # Usar dados do Nominatim se disponíveis, senão usar valores padrão
            address = Address.objects.create(
                street=street or address_name or 'Endereço',
                number=number or 'S/N',
                neighborhood=neighborhood or 'Centro',
                city=city or 'Patos',
                state=state or 'PB',
                postal_code=postal_code or '58700-000',
                point=point
            )
            
            validated_data['address'] = address

        tourist_spot = TouristSpot.objects.create(**validated_data)
        return tourist_spot

    def update(self, instance, validated_data):
        # Extrair dados de localização opcionais
        address_name = validated_data.pop('address_name', None)
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)
        street = validated_data.pop('street', None)
        number = validated_data.pop('number', None)
        neighborhood = validated_data.pop('neighborhood', None)
        city = validated_data.pop('city', None)
        state = validated_data.pop('state', None)
        postal_code = validated_data.pop('postal_code', None)

        # Se coordenadas forem fornecidas, atualizar ou criar endereço
        if latitude and longitude:
            point = Point(float(longitude), float(latitude), srid=4326)
            
            if instance.address:
                # Atualizar endereço existente
                instance.address.street = street or address_name or instance.address.street
                instance.address.number = number or instance.address.number
                instance.address.neighborhood = neighborhood or instance.address.neighborhood
                instance.address.city = city or instance.address.city
                instance.address.state = state or instance.address.state
                instance.address.postal_code = postal_code or instance.address.postal_code
                instance.address.point = point
                instance.address.save()
            else:
                # Criar novo endereço
                address = Address.objects.create(
                    street=street or address_name or 'Endereço',
                    number=number or 'S/N',
                    neighborhood=neighborhood or 'Centro',
                    city=city or 'Patos',
                    state=state or 'PB',
                    postal_code=postal_code or '58700-000',
                    point=point
                )
                instance.address = address

        # Atualizar outros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class TouristSpotListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = TouristSpot
        fields = [
            'id', 'name', 'description', 'location',
            'category_name', 'image_url',
            'latitude', 'longitude'
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_location(self, obj):
        if obj.address:
            return f"{obj.address.city} - {obj.address.state}"
        return None

    def get_image_url(self, obj):
        if hasattr(obj, 'image') and obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

    def get_latitude(self, obj):
        if obj.address and obj.address.point:
            return obj.address.point.y
        return None

    def get_longitude(self, obj):
        if obj.address and obj.address.point:
            return obj.address.point.x
        return None


class EstablishmentSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    address = AddressSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Establishment
        fields = [
            'id', 'name', 'description', 'opening_time', 'closing_time',
            'accessibility', 'address', 'category', 'category_name',
            'image_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_image_url(self, obj):
        if hasattr(obj, 'image') and obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
