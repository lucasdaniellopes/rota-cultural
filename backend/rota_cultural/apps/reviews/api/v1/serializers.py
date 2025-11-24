from rest_framework import serializers
from rota_cultural.apps.reviews.models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewable_type = serializers.SerializerMethodField()
    reviewable_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'reviewable_type', 'reviewable_name',
            'object_id', 'title', 'rating', 'comment', 'helpful_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'helpful_count', 'created_at', 'updated_at']

    def get_reviewable_type(self, obj):
        return obj.content_type.model if obj.content_type else 'platform'

    def get_reviewable_name(self, obj):
        return str(obj.reviewable) if obj.reviewable else 'Rota Cultural'

    def get_user_name(self, obj):
        if obj.user:
            full_name = obj.user.get_full_name()
            return full_name if full_name else obj.user.first_name or obj.user.username
        return 'Anonymous'

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate(self, data):
        user = self.context['request'].user
        content_type = data.get('content_type')
        object_id = data.get('object_id')

        if self.instance:
            return data

        # Only check uniqueness if it's not a platform review (or maybe allow multiple platform reviews?)
        # For now, let's allow multiple reviews if content_type is None (Platform)
        if content_type and object_id:
            if Review.objects.filter(
                user=user,
                content_type=content_type,
                object_id=object_id
            ).exists():
                raise serializers.ValidationError('You have already reviewed this item.')

        return data

class ReviewListSerializer(serializers.ModelSerializer):
    reviewable_type = serializers.SerializerMethodField()
    reviewable_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    is_helpful = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'reviewable_type', 'reviewable_name',
            'object_id', 'title', 'rating', 'comment', 'helpful_count', 'created_at', 'is_helpful'
        ]
        read_only_fields = ['id', 'created_at']

    def get_reviewable_type(self, obj):
        return obj.content_type.model if obj.content_type else 'platform'

    def get_reviewable_name(self, obj):
        return str(obj.reviewable) if obj.reviewable else 'Rota Cultural'

    def get_user_name(self, obj):
        if obj.user:
            full_name = obj.user.get_full_name()
            return full_name if full_name else obj.user.first_name or obj.user.username
        return 'Anonymous'

    def get_is_helpful(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.votes.filter(user=user).exists()
        return False