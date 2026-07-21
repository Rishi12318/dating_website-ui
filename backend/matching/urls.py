from django.urls import path
from . import views

urlpatterns = [
    path("like/", views.LikeView.as_view(), name="like"),
    path("dislike/", views.DislikeView.as_view(), name="dislike"),
    path("block/", views.BlockView.as_view(), name="block"),
    path("matches/", views.MatchListView.as_view(), name="match_list"),
    path("matches/<uuid:pk>/unmatch/", views.UnmatchView.as_view(), name="unmatch"),
    path("discover/", views.discover_view, name="discover"),
]
