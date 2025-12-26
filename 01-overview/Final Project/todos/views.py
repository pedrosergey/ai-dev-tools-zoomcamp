from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Todo
from .serializers import TodoSerializer, TodoCreateUpdateSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing TODO items.
    
    Provides CRUD operations and additional actions:
    - mark_resolved: Mark a TODO as resolved
    - mark_pending: Mark a TODO as pending
    - overdue: Get all overdue TODOs
    """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TodoCreateUpdateSerializer
        return TodoSerializer
    
    @action(detail=True, methods=['post'])
    def mark_resolved(self, request, pk=None):
        """Mark a TODO as resolved"""
        todo = self.get_object()
        if todo.mark_resolved():
            return Response(
                {
                    'status': 'success',
                    'message': f'TODO "{todo.title}" marked as resolved',
                    'todo': TodoSerializer(todo).data
                }
            )
        return Response(
            {
                'status': 'error',
                'message': 'TODO is already resolved'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def mark_pending(self, request, pk=None):
        """Mark a TODO as pending"""
        todo = self.get_object()
        if todo.mark_pending():
            return Response(
                {
                    'status': 'success',
                    'message': f'TODO "{todo.title}" marked as pending',
                    'todo': TodoSerializer(todo).data
                }
            )
        return Response(
            {
                'status': 'error',
                'message': 'TODO is already pending'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue TODOs"""
        overdue_todos = [todo for todo in self.queryset if todo.is_overdue()]
        serializer = self.get_serializer(overdue_todos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def resolved(self, request):
        """Get all resolved TODOs"""
        resolved_todos = self.queryset.filter(status='resolved')
        serializer = self.get_serializer(resolved_todos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending TODOs"""
        pending_todos = self.queryset.filter(status='pending')
        serializer = self.get_serializer(pending_todos, many=True)
        return Response(serializer.data)
