from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class CompatibilityQuestion(models.Model):
    CATEGORY_CHOICES = [
        ("values", "Core Values"),
        ("communication", "Communication Style"),
        ("conflict", "Conflict Resolution"),
        ("love_language", "Love Language"),
        ("lifestyle", "Lifestyle Pace"),
        ("ambition", "Ambition & Goals"),
    ]

    QUESTION_TYPE_CHOICES = [
        ("scale_1_5", "Scale 1-5"),
        ("multiple_choice", "Multiple Choice"),
        ("slider", "Slider"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default="scale_1_5")
    options = models.JSONField(default=list, blank=True, help_text="For multiple-choice questions")
    weight = models.FloatField(default=1.0, help_text="Category weight for scoring")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "compatibility_questions"
        ordering = ["order", "category"]

    def __str__(self):
        return f"[{self.get_category_display()}] {self.text[:60]}"


class UserAnswer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="compatibility_answers")
    question = models.ForeignKey(CompatibilityQuestion, on_delete=models.CASCADE, related_name="answers")
    answer_value = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_answers"
        unique_together = ["user", "question"]
        ordering = ["question__order"]

    def __str__(self):
        return f"{self.user.email} - {self.question.text[:30]}: {self.answer_value}"


class CompatibilityResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_a = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="compat_results_as_a")
    user_b = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="compat_results_as_b")
    score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    category_scores = models.JSONField(default=dict, help_text="Per-category breakdown")
    explanation = models.TextField(blank=True, default="")
    calculated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "compatibility_results"
        unique_together = ["user_a", "user_b"]
        ordering = ["-calculated_at"]

    def __str__(self):
        return f"Compat: {self.user_a.email} <-> {self.user_b.email} = {self.score}%"
