from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'read', 'sent_at']
    list_filter = ['read', 'sent_at']
    search_fields = ['user__username', 'title', 'message']
    ordering = ['-sent_at']

    readonly_fields = ['sent_at', 'read_at']

    fieldsets = (
        ('Notificação', {
            'fields': ('user', 'title', 'message')
        }),
        ('Status', {
            'fields': ('read', 'sent_at', 'read_at')
        }),
    )