from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Q

from profiles.models import Profile
from matching.models import Like, Dislike, Block, Match
from .models import Recommendation
from .serializers import RecommendationSerializer
from .engine import ContentBasedRecommender


class RecommendationListView(generics.ListAPIView):
    serializer_class = RecommendationSerializer

    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user)[:20]

    def list(self, request, *args, **kwargs):
        self.generate_recommendations(request.user)
        return super().list(request, *args, **kwargs)

    def generate_recommendations(self, user):
        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return

        excluded_ids = set()
        excluded_ids.add(user.id)
        excluded_ids.update(Like.objects.filter(from_user=user).values_list("to_user_id", flat=True))
        excluded_ids.update(Dislike.objects.filter(from_user=user).values_list("to_user_id", flat=True))
        excluded_ids.update(Block.objects.filter(blocker=user).values_list("blocked_id", flat=True))
        excluded_ids.update(Block.objects.filter(blocked=user).values_list("blocker_id", flat=True))
        excluded_ids.update(Match.objects.filter(
            Q(user_a=user) | Q(user_b=user), is_active=True
        ).values_list("user_a_id", "user_b_id"))

        candidates = Profile.objects.filter(is_active=True).exclude(user_id__in=excluded_ids)[:50]

        if not candidates.exists():
            return

        recommender = ContentBasedRecommender()
        similarities = recommender.compute_similarity(user_profile, candidates)

        for i, (candidate, score) in enumerate(zip(candidates, similarities)):
            match_score = round(float(score) * 100, 1)
            reason = recommender.generate_reason(user_profile, candidate, match_score)

            Recommendation.objects.update_or_create(
                user=user,
                recommended_user=candidate.user,
                defaults={
                    "match_score": match_score,
                    "reason": reason,
                    "model_version": "v1.0_content",
                },
            )
