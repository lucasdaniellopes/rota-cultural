from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'object_id', 'rating', 'created_at']
    list_filter = ['rating', 'content_type', 'created_at']
    search_fields = ['user__username', 'comment']
    ordering = ['-created_at']

    fieldsets = (
        ('Avaliação', {
            'fields': ('user', 'rating', 'comment')
        }),
        ('Item Avaliado', {
            'fields': ('content_type', 'object_id')
        }),
    )