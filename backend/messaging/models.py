from django.db import models
from django.conf import settings
import uuid


class Message(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ("text", "Text"),
        ("image", "Image"),
        ("emoji", "Emoji"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    match = models.ForeignKey("matching.Match", on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    content = models.TextField()
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPE_CHOICES, default="text")
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messages"
        ordering = ["created_at"]

    def __str__(self):
        return f"Message from {self.sender.email} in match {self.match.id}"
