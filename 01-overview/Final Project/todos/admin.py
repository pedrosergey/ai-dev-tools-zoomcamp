from django.contrib import admin
from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'due_date', 'created_at', 'is_overdue')
    list_filter = ('status', 'created_at', 'due_date')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at', 'resolved_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description')
        }),
        ('Dates', {
            'fields': ('due_date', 'created_at', 'updated_at', 'resolved_at')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )
    
    actions = ['mark_resolved', 'mark_pending']
    
    def mark_resolved(self, request, queryset):
        count = 0
        for todo in queryset:
            if todo.mark_resolved():
                count += 1
        self.message_user(request, f"{count} TODO(s) marked as resolved.")
    mark_resolved.short_description = "Mark selected TODOs as resolved"
    
    def mark_pending(self, request, queryset):
        count = 0
        for todo in queryset:
            if todo.mark_pending():
                count += 1
        self.message_user(request, f"{count} TODO(s) marked as pending.")
    mark_pending.short_description = "Mark selected TODOs as pending"
