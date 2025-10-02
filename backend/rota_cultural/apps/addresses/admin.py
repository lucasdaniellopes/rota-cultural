from django.contrib import admin
from .models import Address

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["street", "number", "neighborhood", "city"]
    list_filter = ["neighborhood"]
    search_fields = ["street", "neighborhood", "city"]
    ordering = ["neighborhood"]

    fieldsets = (
        ("Endereço Principal", {
            "fields": ("street", "number", "complement",)
        }),
        ("Localização", {
            "fields": ("neighborhood", "city", "state", "postal_code",)
        }),
        ("Coordenadas", {
            "fields": ("point",),
        }),
    )
