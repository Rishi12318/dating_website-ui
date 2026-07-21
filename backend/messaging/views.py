from django.urls import path
from rest_framework import generics, permissions
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer, MessageListSerializer


class MessageListView(generics.ListAPIView):
    serializer_class = MessageListSerializer

    def get_queryset(self):
        match_id = self.kwargs["match_id"]
        from matching.models import Match
        match = Match.objects.filter(
            id=match_id,
            is_active=True,
        ).filter(
            Q(user_a=self.request.user) | Q(user_b=self.request.user)
        ).first()

        if not match:
            return Message.objects.none()

        return Message.objects.filter(match=match)


class MessageSendView(generics.CreateAPIView):
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        match_id = self.kwargs["match_id"]
        from matching.models import Match
        match = Match.objects.filter(
            id=match_id,
            is_active=True,
        ).filter(
            Q(user_a=self.request.user) | Q(user_b=self.request.user)
        ).first()

        if not match:
            from rest_framework.exceptions import NotFound
            raise NotFound("Match not found")

        serializer.save(sender=self.request.user, match=match)
