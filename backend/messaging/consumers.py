import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import Q
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
        self.room_group_name = f"chat_{self.match_id}"
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        is_participant = await self.check_match_participant()
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get("type", "text")

        if msg_type == "message":
            content = data.get("content", "")
            message_type = data.get("message_type", "text")

            if not content.strip():
                return

            message = await self.save_message(content, message_type)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": {
                        "id": str(message.id),
                        "sender": str(self.user.id),
                        "sender_email": self.user.email,
                        "content": content,
                        "message_type": message_type,
                        "created_at": message.created_at.isoformat(),
                    },
                },
            )
        elif msg_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_indicator",
                    "user_id": str(self.user.id),
                    "is_typing": data.get("is_typing", False),
                },
            )
        elif msg_type == "read":
            message_id = data.get("message_id")
            if message_id:
                await self.mark_message_read(message_id)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message": event["message"],
        }))

    async def typing_indicator(self, event):
        if event["user_id"] != str(self.user.id):
            await self.send(text_data=json.dumps({
                "type": "typing",
                "user_id": event["user_id"],
                "is_typing": event["is_typing"],
            }))

    @database_sync_to_async
    def check_match_participant(self):
        from matching.models import Match
        return Match.objects.filter(
            id=self.match_id,
            is_active=True,
        ).filter(
            Q(user_a=self.user) | Q(user_b=self.user)
        ).exists()

    @database_sync_to_async
    def save_message(self, content, message_type):
        from matching.models import Match
        from .models import Message
        match = Match.objects.get(id=self.match_id)
        return Message.objects.create(
            match=match,
            sender=self.user,
            content=content,
            message_type=message_type,
        )

    @database_sync_to_async
    def mark_message_read(self, message_id):
        from .models import Message
        Message.objects.filter(
            id=message_id,
            match_id=self.match_id,
        ).exclude(sender=self.user).update(
            is_read=True,
            read_at=timezone.now(),
        )
