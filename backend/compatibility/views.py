from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import CompatibilityQuestion, UserAnswer, CompatibilityResult
from .serializers import (
    CompatibilityQuestionSerializer, UserAnswerSerializer,
    CompatibilityResultSerializer,
)


class QuestionListView(generics.ListAPIView):
    serializer_class = CompatibilityQuestionSerializer
    permission_classes = [permissions.AllowAny]
    queryset = CompatibilityQuestion.objects.filter(is_active=True)


class AnswerSubmitView(generics.CreateAPIView):
    serializer_class = UserAnswerSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        answers = request.data.get("answers", [])
        if not answers:
            return super().create(request, *args, **kwargs)

        created = []
        for answer_data in answers:
            question_id = answer_data.get("question")
            answer_value = answer_data.get("answer_value")

            answer, was_created = UserAnswer.objects.update_or_create(
                user=request.user,
                question_id=question_id,
                defaults={"answer_value": answer_value},
            )
            created.append(UserAnswerSerializer(answer).data)

        return Response(created, status=status.HTTP_201_CREATED)


class MyAnswersView(generics.ListAPIView):
    serializer_class = UserAnswerSerializer

    def get_queryset(self):
        return UserAnswer.objects.filter(user=self.request.user)


class CalculateCompatibilityView(generics.GenericAPIView):
    def post(self, request, other_user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        my_answers = UserAnswer.objects.filter(user=request.user).select_related("question")
        other_answers = UserAnswer.objects.filter(user=other_user).select_related("question")

        my_answer_map = {a.question_id: a.answer_value for a in my_answers}
        other_answer_map = {a.question_id: a.answer_value for a in other_answers}

        common_questions = set(my_answer_map.keys()) & set(other_answer_map.keys())
        if not common_questions:
            return Response({"error": "No common questions answered"}, status=status.HTTP_400_BAD_REQUEST)

        category_scores = {}
        all_questions = CompatibilityQuestion.objects.filter(id__in=common_questions)

        for category in CompatibilityQuestion.CATEGORY_CHOICES:
            cat_key = category[0]
            cat_questions = all_questions.filter(category=cat_key)
            if not cat_questions.exists():
                continue

            diffs = []
            total_weight = 0
            for q in cat_questions:
                my_val = my_answer_map.get(q.id, 0)
                other_val = other_answer_map.get(q.id, 0)
                max_diff = 5.0
                similarity = 1.0 - (abs(my_val - other_val) / max_diff)
                weighted = similarity * q.weight
                diffs.append(weighted)
                total_weight += q.weight

            if total_weight > 0:
                cat_score = (sum(diffs) / total_weight) * 100
                category_scores[cat_key] = round(cat_score, 1)

        if category_scores:
            overall_score = round(sum(category_scores.values()) / len(category_scores), 1)
        else:
            overall_score = 0

        user_a = request.user if request.user.id < other_user.id else other_user
        user_b = other_user if request.user.id < other_user.id else request.user

        result, _ = CompatibilityResult.objects.update_or_create(
            user_a=user_a,
            user_b=user_b,
            defaults={
                "score": overall_score,
                "category_scores": category_scores,
            },
        )

        return Response(CompatibilityResultSerializer(result).data)
