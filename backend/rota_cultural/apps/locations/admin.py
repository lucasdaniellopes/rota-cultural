from django.contrib.gis.geos import Point
from django.contrib import admin
from .models import Location

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'latitude', 'longitude', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

    def save_model(self, request, obj, form, change):
        if obj.latitude and obj.longitude:
            obj.point = Point(float(obj.longitude), float(obj.latitude))
            super().save_model(request, obj, form, change)