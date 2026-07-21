from rest_framework import serializers
from .models import Recommendation


class RecommendationSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    match_score = serializers.ReadOnlyField()
    reason = serializers.ReadOnlyField()

    class Meta:
        model = Recommendation
        fields = ["id", "recommended_user", "match_score", "reason", "model_version", "created_at"]
        read_only_fields = ["id", "match_score", "reason", "model_version", "created_at"]

    def get_profile(self, obj):
        from profiles.serializers import ProfileListSerializer
        from profiles.models import Profile
        profile = Profile.objects.filter(user=obj.recommended_user).first()
        if profile:
            return ProfileListSerializer(profile).data
        return None
