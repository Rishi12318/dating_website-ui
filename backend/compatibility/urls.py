from django.urls import path
from . import views

urlpatterns = [
    path("questions/", views.QuestionListView.as_view(), name="compat_questions"),
    path("answers/", views.AnswerSubmitView.as_view(), name="compat_answers"),
    path("answers/my/", views.MyAnswersView.as_view(), name="my_answers"),
    path("calculate/<uuid:other_user_id>/", views.CalculateCompatibilityView.as_view(), name="compat_calculate"),
]
