import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lovelle.settings")
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
from messaging.consumers import ChatConsumer

websocket_urlpatterns = [
    path("ws/chat/<uuid:match_id>/", ChatConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})
