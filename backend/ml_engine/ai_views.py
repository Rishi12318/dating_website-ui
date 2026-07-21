from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .ai_service import ai_service
from profiles.models import Profile
from matching.models import Match
from messaging.models import Message


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_bio(request):
    hobbies = request.data.get("hobbies", "")
    interests = request.data.get("interests", "")
    personality_traits = request.data.get("personality_traits", "")

    if not any([hobbies, interests, personality_traits]):
        return Response(
            {"error": "Provide at least one of: hobbies, interests, personality_traits"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    bios = ai_service.generate_bio(hobbies, interests, personality_traits)
    return Response({"bios": bios})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_icebreaker(request, match_id):
    match = get_object_or_404(
        Match, id=match_id, is_active=True,
    )

    if request.user not in [match.user_a, match.user_b]:
        return Response({"error": "Not your match"}, status=status.HTTP_403_FORBIDDEN)

    other_user = match.user_b if match.user_a == request.user else match.user_a
    user_profile = request.user.profile
    other_profile = Profile.objects.filter(user=other_user).first()

    shared_interests = []
    if user_profile and other_profile:
        shared_interests = list(
            set(user_profile.interests.values_list("name", flat=True)) &
            set(other_profile.interests.values_list("name", flat=True))
        )

    icebreakers = ai_service.generate_icebreakers(
        shared_interests,
        user_profile.display_name if user_profile else "User",
        other_profile.display_name if other_profile else "User",
    )

    return Response({"icebreakers": icebreakers, "shared_interests": shared_interests})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def suggest_reply(request, message_id):
    message = get_object_or_404(Message, id=message_id)
    match = message.match

    if request.user not in [match.user_a, match.user_b]:
        return Response({"error": "Not your match"}, status=status.HTTP_403_FORBIDDEN)

    recent_messages = list(
        Message.objects.filter(match=match)
        .order_by("-created_at")[:10]
        .values("sender__email", "content")
    )
    recent_messages.reverse()

    formatted_messages = [
        {"sender": m["sender__email"], "content": m["content"]}
        for m in recent_messages
    ]

    suggestions = ai_service.suggest_reply(formatted_messages)
    return Response({"suggestions": suggestions})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def explain_compatibility(request, other_user_id):
    from compatibility.models import CompatibilityResult
    from django.contrib.auth import get_user_model
    User = get_user_model()

    other_user = get_object_or_404(User, id=other_user_id)

    user_a = request.user if request.user.id < other_user.id else other_user
    user_b = other_user if request.user.id < other_user.id else request.user

    result = CompatibilityResult.objects.filter(user_a=user_a, user_b=user_b).first()
    if not result:
        return Response(
            {"error": "Calculate compatibility first"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user_profile = request.user.profile
    other_profile = Profile.objects.filter(user=other_user).first()

    shared_traits = []
    if user_profile and other_profile:
        shared_interests = set(user_profile.interests.values_list("name", flat=True)) & \
                          set(other_profile.interests.values_list("name", flat=True))
        shared_traits.extend(list(shared_interests))

        if user_profile.relationship_goal == other_profile.relationship_goal:
            shared_traits.append(f"same relationship goal ({user_profile.get_relationship_goal_display()})")

        lifestyle_overlap = set(user_profile.lifestyle_tags or []) & set(other_profile.lifestyle_tags or [])
        shared_traits.extend(list(lifestyle_overlap))

    explanation = ai_service.explain_compatibility(
        result.score,
        result.category_scores,
        shared_traits,
    )

    result.explanation = explanation
    result.save(update_fields=["explanation"])

    return Response({
        "score": result.score,
        "category_scores": result.category_scores,
        "explanation": explanation,
    })
