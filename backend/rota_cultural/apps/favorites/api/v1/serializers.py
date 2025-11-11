from rest_framework import serializers
from rota_cultural.apps.favorites.models import Favorite

class FavoriteSerializer(serializers.ModelSerializer):
    favoritable_type = serializers.SerializerMethodField()

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'favoritable_type', 'object_id', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_favoritable_type(self, obj):
        return obj.content_type.model

    def validate(self, data):
        user = self.context['request'].user
        content_type = data.get('content_type')
        object_id = data.get('object_id')

        if Favorite.objects.filter(
            user=user,
            content_type=content_type,
            object_id=object_id
        ).exists():
            raise serializers.ValidationError('This item is already in favorites.')

        return data

class FavoriteListSerializer(serializers.ModelSerializer):
    favoritable_type = serializers.SerializerMethodField()
    favoritable_name = serializers.SerializerMethodField()

    class Meta:
        model = Favorite
        fields = ['id', 'favoritable_type', 'favoritable_name', 'object_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_favoritable_type(self, obj):
        return obj.content_type.model

    def get_favoritable_name(self, obj):
        return str(obj.favoritable) if obj.favoritable else 'Unknown'