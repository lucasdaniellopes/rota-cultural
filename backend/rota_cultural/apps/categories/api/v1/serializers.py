from rest_framework import serializers
from rota_cultural.apps.categories.models import Category

class CategorySerializer(serializers.ModelSerializer):
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'item_type', 'item_type_display', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        if Category.objects.filter(name__iexact=value).exists():
            if self.instance and self.instance.name.lower() == value.lower():
                return value
            raise serializers.ValidationError('Category with this name already exists.')
        return value

class CategoryListSerializer(serializers.ModelSerializer):
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'item_type', 'item_type_display']