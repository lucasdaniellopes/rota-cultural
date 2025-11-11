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
            'object_id', 'rating', 'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_reviewable_type(self, obj):
        return obj.content_type.model

    def get_reviewable_name(self, obj):
        return str(obj.reviewable) if obj.reviewable else 'Unknown'

    def get_user_name(self, obj):
        return obj.user.username if obj.user else 'Anonymous'

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

    class Meta:
        model = Review
        fields = [
            'id', 'user_name', 'reviewable_type', 'reviewable_name',
            'object_id', 'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_reviewable_type(self, obj):
        return obj.content_type.model

    def get_reviewable_name(self, obj):
        return str(obj.reviewable) if obj.reviewable else 'Unknown'

    def get_user_name(self, obj):
        return obj.user.username if obj.user else 'Anonymous'