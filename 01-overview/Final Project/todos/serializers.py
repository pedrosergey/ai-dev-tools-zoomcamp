from rest_framework import serializers
from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Todo
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'status',
            'is_overdue',
            'created_at',
            'updated_at',
            'resolved_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolved_at']
    
    def get_is_overdue(self, obj):
        return obj.is_overdue()


class TodoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['title', 'description', 'due_date', 'status']
