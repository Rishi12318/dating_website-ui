from django.contrib import admin
from .models import CompatibilityQuestion, UserAnswer, CompatibilityResult


@admin.register(CompatibilityQuestion)
class CompatibilityQuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "category", "question_type", "weight", "order", "is_active")
    list_filter = ("category", "question_type", "is_active")


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ("user", "question", "answer_value", "created_at")


@admin.register(CompatibilityResult)
class CompatibilityResultAdmin(admin.ModelAdmin):
    list_display = ("user_a", "user_b", "score", "calculated_at")
