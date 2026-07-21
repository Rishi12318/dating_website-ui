from django.urls import path
from . import views

urlpatterns = [
    path("<uuid:match_id>/messages/", views.MessageListView.as_view(), name="message_list"),
    path("<uuid:match_id>/messages/send/", views.MessageSendView.as_view(), name="message_send"),
]
