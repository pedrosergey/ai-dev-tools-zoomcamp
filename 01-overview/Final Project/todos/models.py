from django.db import models
from django.utils import timezone

class Todo(models.Model):
    """
    Model for TODO items with the ability to:
    - Create, edit, and delete TODO items
    - Assign due dates
    - Mark TODOs as resolved
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
    ]
    
    title = models.CharField(
        max_length=200,
        help_text="Title of the TODO item"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Detailed description of the TODO item"
    )
    due_date = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Due date for the TODO item"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Status of the TODO item"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the TODO was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the TODO was last updated"
    )
    resolved_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Timestamp when the TODO was marked as resolved"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Todo"
        verbose_name_plural = "Todos"
    
    def __str__(self):
        return self.title
    
    def mark_resolved(self):
        """Mark the TODO as resolved"""
        if self.status == 'pending':
            self.status = 'resolved'
            self.resolved_at = timezone.now()
            self.save()
            return True
        return False
    
    def mark_pending(self):
        """Mark the TODO as pending"""
        if self.status == 'resolved':
            self.status = 'pending'
            self.resolved_at = None
            self.save()
            return True
        return False
    
    def is_overdue(self):
        """Check if the TODO is overdue"""
        if self.due_date and self.status == 'pending':
            return timezone.now() > self.due_date
        return False
