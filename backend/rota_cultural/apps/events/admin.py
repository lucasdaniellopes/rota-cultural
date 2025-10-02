from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'organizer', 'start_date', 'price']
    list_filter = ['category', 'start_date', 'content_type']
    search_fields = ['name', 'description']
    ordering = ['start_date']

    fieldsets = (
        ('Informações Principais', {
            'fields': ('name', 'description', 'category', 'organizer',)
        }),
        ('Data e Horário', {
            'fields': ('start_date', 'end_date', 'start_time', 'end_time',)
        }),
        ('Local', {
            'fields': ('content_type', 'object_id',)
        }),
        ('Detalhes', {
            'fields': ('price', 'accessibility',)
        }),
    )