from rest_framework import serializers
from .models import Profile, Photo, Interest


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ["id", "name", "category"]


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["id", "image", "is_primary", "is_verified", "uploaded_at"]
        read_only_fields = ["id", "is_verified", "uploaded_at"]


class ProfileSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True, read_only=True)
    interest_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Interest.objects.all(), source="interests", write_only=True, required=False
    )
    photos = PhotoSerializer(many=True, read_only=True)
    age = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = [
            "id", "display_name", "birth_date", "age", "gender", "gender_preference",
            "bio", "city", "occupation", "education", "height", "relationship_goal",
            "lifestyle_tags", "personality_tags", "interests", "interest_ids",
            "photos", "profile_completion_score", "is_active", "created_at",
        ]
        read_only_fields = ["id", "profile_completion_score", "created_at", "is_active"]


class ProfileListSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    age = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = ["id", "display_name", "age", "city", "occupation", "photos", "profile_completion_score"]


class InterestCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    category = serializers.ChoiceField(choices=Interest.CATEGORY_CHOICES, default="hobby")
