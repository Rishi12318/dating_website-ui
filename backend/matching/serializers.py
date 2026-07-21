from rest_framework import serializers
from .models import Like, Match, Block, Dislike
from profiles.serializers import ProfileListSerializer


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "to_user", "is_super_like", "created_at"]
        read_only_fields = ["id", "created_at"]


class MatchSerializer(serializers.ModelSerializer):
    other_user_profile = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ["id", "user_a", "user_b", "matched_at", "is_active", "other_user_profile"]
        read_only_fields = ["id", "matched_at"]

    def get_other_user_profile(self, obj):
        request = self.context.get("request")
        if not request:
            return None
        other_user = obj.user_b if obj.user_a == request.user else obj.user_a
        from profiles.models import Profile
        profile = Profile.objects.filter(user=other_user).first()
        if profile:
            return ProfileListSerializer(profile).data
        return None


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ["id", "blocked", "created_at"]
        read_only_fields = ["id", "created_at"]


class DiscoverSerializer(serializers.ModelSerializer):
    photos = serializers.SerializerMethodField()
    age = serializers.ReadOnlyField()
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = None
        fields = ["id", "display_name", "age", "city", "occupation", "photos", "distance_km"]

    def __init__(self, *args, **kwargs):
        from profiles.models import Profile
        self.Meta.model = Profile
        super().__init__(*args, **kwargs)

    def get_photos(self, obj):
        from profiles.serializers import PhotoSerializer
        return PhotoSerializer(obj.photos.all()[:5], many=True).data

    def get_distance_km(self, obj):
        request = self.context.get("request")
        if not request or not hasattr(request.user, "profile"):
            return None
        user_profile = request.user.profile
        if user_profile.latitude and user_profile.longitude and obj.latitude and obj.longitude:
            from math import radians, cos, sin, asin, sqrt
            lat1, lon1, lat2, obj_lat, obj_lon = map(radians, [user_profile.latitude, user_profile.longitude, obj.latitude, obj.longitude])
            dlat = obj_lat - lat1
            dlon = obj_lon - lon1
            a = sin(dlat/2)**2 + cos(lat1) * cos(obj_lat) * sin(dlon/2)**2
            return round(2 * 6371 * asin(sqrt(a)), 1)
        return None
