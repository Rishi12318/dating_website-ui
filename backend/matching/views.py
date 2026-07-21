from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone

from profiles.models import Profile
from .models import Like, Match, Block, Dislike
from .serializers import LikeSerializer, MatchSerializer, BlockSerializer


class LikeView(generics.CreateAPIView):
    serializer_class = LikeSerializer

    def perform_create(self, serializer):
        like = serializer.save(from_user=self.request.user)

        if Block.objects.filter(
            Q(blocker=like.to_user, blocked=self.request.user) |
            Q(blocker=self.request.user, blocked=like.to_user)
        ).exists():
            return

        reverse_like = Like.objects.filter(from_user=like.to_user, to_user=self.request.user).first()
        if reverse_like:
            match = Match.objects.create(
                user_a=self.request.user,
                user_b=like.to_user,
            )
            return {"match_created": True, "match_id": str(match.id)}
        return {"match_created": False}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = self.perform_create(serializer)
        return Response({
            "like": LikeSerializer(serializer.instance).data,
            "match_created": result.get("match_created", False) if result else False,
            "match_id": result.get("match_id") if result else None,
        }, status=status.HTTP_201_CREATED)


class DislikeView(generics.CreateAPIView):
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):
        to_user_id = request.data.get("to_user")
        if not to_user_id:
            return Response({"error": "to_user is required"}, status=status.HTTP_400_BAD_REQUEST)

        dislike, created = Dislike.objects.get_or_create(
            from_user=request.user,
            to_user_id=to_user_id,
        )
        return Response(
            {"message": "Disliked", "id": str(dislike.id)},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class BlockView(generics.CreateAPIView):
    serializer_class = BlockSerializer

    def perform_create(self, serializer):
        blocked_user = serializer.validated_data["blocked"]
        if blocked_user == self.request.user:
            return Response({"error": "Cannot block yourself"}, status=status.HTTP_400_BAD_REQUEST)

        block = serializer.save(blocker=self.request.user)

        Match.objects.filter(
            Q(user_a=self.request.user, user_b=blocked_user) |
            Q(user_a=blocked_user, user_b=self.request.user),
            is_active=True,
        ).update(is_active=False)

        Like.objects.filter(
            Q(from_user=self.request.user, to_user=blocked_user) |
            Q(from_user=blocked_user, to_user=self.request.user),
        ).delete()

        return block

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "User blocked"}, status=status.HTTP_201_CREATED)


class MatchListView(generics.ListAPIView):
    serializer_class = MatchSerializer

    def get_queryset(self):
        return Match.objects.filter(
            Q(user_a=self.request.user) | Q(user_b=self.request.user),
            is_active=True,
        )


class UnmatchView(generics.DestroyAPIView):
    def get_queryset(self):
        return Match.objects.filter(
            Q(user_a=self.request.user) | Q(user_b=self.request.user),
            is_active=True,
        )

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


@api_view(["GET"])
def discover_view(request):
    user = request.user
    try:
        user_profile = user.profile
    except Profile.DoesNotExist:
        return Response({"error": "Complete your profile first"}, status=status.HTTP_400_BAD_REQUEST)

    excluded_user_ids = set()

    liked_ids = Like.objects.filter(from_user=user).values_list("to_user_id", flat=True)
    disliked_ids = Dislike.objects.filter(from_user=user).values_list("to_user_id", flat=True)
    blocked_ids = Block.objects.filter(blocker=user).values_list("blocked_id", flat=True)
    blocked_by_ids = Block.objects.filter(blocked=user).values_list("blocker_id", flat=True)

    excluded_user_ids.update(liked_ids, disliked_ids, blocked_ids, blocked_by_ids)
    excluded_user_ids.add(user.id)

    queryset = Profile.objects.filter(is_active=True).exclude(user_id__in=excluded_user_ids)

    if user_profile.gender_preference != "A":
        queryset = queryset.filter(gender=user_profile.gender_preference)

    if user_profile.latitude and user_profile.longitude:
        from math import radians, cos, sin, asin, sqrt

        def haversine(lat1, lon1, lat2, lon2):
            lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            return 2 * 6371 * asin(sqrt(a))

        profiles_with_distance = []
        for p in queryset.filter(latitude__isnull=False, longitude__isnull=False):
            dist = haversine(user_profile.latitude, user_profile.longitude, p.latitude, p.longitude)
            profiles_with_distance.append((dist, p))
        profiles_with_distance.sort(key=lambda x: x[0])
        queryset = [p for _, p in profiles_with_distance[:50]]
    else:
        queryset = list(queryset[:50])

    from profiles.serializers import ProfileListSerializer
    profiles = ProfileListSerializer(queryset, many=True, context={"request": request})
    return Response(profiles.data)
