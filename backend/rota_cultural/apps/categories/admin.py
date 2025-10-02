from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "item_type", "created_at"]
    list_filter = ["item_type"]
    search_fields = ["name"]