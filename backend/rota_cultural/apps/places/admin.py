from django.contrib import admin
from .models import TouristSpot, Establishment


@admin.register(TouristSpot)
class TouristSpotAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'address_city', 'opening_time', 'closing_time']
    list_filter = ['category', 'address__state', 'address__city']
    search_fields = ['name', 'address__neighborhood']
    ordering = ['name']

    def address_city(self, obj):
        return obj.address.city
    address_city.short_description = 'Cidade'

    fieldsets = (
        ('Informações Principais', {
            'fields': ('name', 'description', 'category')
        }),
        ('Endereço', {
            'fields': ('address',)
        }),
        ('Horário de Funcionamento', {
            'fields': ('opening_time', 'closing_time')
        }),
        ('Acessibilidade', {
            'fields': ('accessibility',)
        }),
    )


@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'address_city', 'opening_time', 'closing_time']
    list_filter = ['category', 'address__state', 'address__city']
    search_fields = ['name', 'address__neighborhood']
    ordering = ['name']

    def address_city(self, obj):
        return obj.address.city
    address_city.short_description = 'Cidade'

    fieldsets = (
        ('Informações Principais', {
            'fields': ('name', 'description', 'category')
        }),
        ('Endereço', {
            'fields': ('address',)
        }),
        ('Horário de Funcionamento', {
            'fields': ('opening_time', 'closing_time')
        }),
        ('Acessibilidade', {
            'fields': ('accessibility',)
        }),
    )