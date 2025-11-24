from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from rota_cultural.apps.users.models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'full_name', 'is_tourist', 'is_active', 'date_joined']
    list_filter = ['is_tourist', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'full_name']
    ordering = ['-date_joined']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Additional Info', {
            'fields': ('phone', 'birth_date', 'is_tourist', 'bio', 'avatar')
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'phone', 'birth_date', 'is_tourist')
        }),
    )
