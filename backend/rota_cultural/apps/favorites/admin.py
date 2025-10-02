from django.contrib import admin
from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'object_id', 'created_at']
    list_filter = ['content_type', 'created_at']
    search_fields = ['user__username']
    ordering = ['-created_at']

    readonly_fields = ['created_at']

    fieldsets = (
        ('Favorito', {
            'fields': ('user', 'content_type', 'object_id')
        }),
        ('Informações', {
            'fields': ('created_at',)
        }),
    )