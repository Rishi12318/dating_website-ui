from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.email", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "match", "sender", "sender_email", "content", "message_type", "is_read", "read_at", "created_at"]
        read_only_fields = ["id", "sender", "is_read", "read_at", "created_at"]


class MessageListSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.email", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "sender_email", "content", "message_type", "is_read", "created_at"]
