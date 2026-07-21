from rest_framework import serializers
from .models import CompatibilityQuestion, UserAnswer, CompatibilityResult


class CompatibilityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompatibilityQuestion
        fields = ["id", "text", "category", "question_type", "options", "order"]


class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.text", read_only=True)
    question_category = serializers.CharField(source="question.category", read_only=True)

    class Meta:
        model = UserAnswer
        fields = ["id", "question", "question_text", "question_category", "answer_value", "created_at"]
        read_only_fields = ["id", "created_at"]


class CompatibilityResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompatibilityResult
        fields = ["id", "user_a", "user_b", "score", "category_scores", "explanation", "calculated_at"]
        read_only_fields = ["id", "score", "category_scores", "explanation", "calculated_at"]
