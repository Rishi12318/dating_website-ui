from django.urls import path
from . import views, ai_views

urlpatterns = [
    path("recommendations/", views.RecommendationListView.as_view(), name="recommendations"),
    path("ai/generate-bio/", ai_views.generate_bio, name="ai_generate_bio"),
    path("ai/icebreaker/<uuid:match_id>/", ai_views.generate_icebreaker, name="ai_icebreaker"),
    path("ai/suggest-reply/<uuid:message_id>/", ai_views.suggest_reply, name="ai_suggest_reply"),
    path("ai/explain-compatibility/<uuid:other_user_id>/", ai_views.explain_compatibility, name="ai_explain_compatibility"),
]
