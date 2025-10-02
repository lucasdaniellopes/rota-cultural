from django.contrib import admin
from .models import Itinerary, ItineraryItem


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'user__username']
    ordering = ['-updated_at']


@admin.register(ItineraryItem)
class ItineraryItemAdmin(admin.ModelAdmin):
    list_display = ['itinerary', 'order', 'item_type', 'item_id']
    list_filter = ['item_type']
    ordering = ['itinerary', 'order']