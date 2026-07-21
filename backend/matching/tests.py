import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from matching.models import Like, Match, Block, Dislike

User = get_user_model()


@pytest.mark.django_db
class TestLike:
    def test_like_user(self, auth_client, user, other_user):
        response = auth_client.post("/api/v1/matching/like/", {
            "to_user": str(other_user.id),
        }, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Like.objects.filter(from_user=user, to_user=other_user).exists()

    def test_mutual_like_creates_match(self, auth_client, user, other_user):
        Like.objects.create(from_user=other_user, to_user=user)
        response = auth_client.post("/api/v1/matching/like/", {
            "to_user": str(other_user.id),
        }, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["match_created"] is True
        assert Match.objects.filter(
            user_a=user, user_b=other_user, is_active=True
        ).exists()


@pytest.mark.django_db
class TestBlock:
    def test_block_user(self, auth_client, user, other_user):
        response = auth_client.post("/api/v1/matching/block/", {
            "blocked": str(other_user.id),
        }, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Block.objects.filter(blocker=user, blocked=other_user).exists()

    def test_block_removes_match(self, auth_client, user, other_user):
        match = Match.objects.create(user_a=user, user_b=other_user)
        auth_client.post("/api/v1/matching/block/", {
            "blocked": str(other_user.id),
        }, format="json")
        match.refresh_from_db()
        assert match.is_active is False


@pytest.mark.django_db
class TestDiscover:
    def test_discover_returns_profiles(self, auth_client, user, other_user):
        from profiles.models import Profile
        Profile.objects.create(
            user=user, display_name="Me", birth_date="2000-01-01", gender="M"
        )
        Profile.objects.create(
            user=other_user, display_name="Other", birth_date="2000-01-01", gender="F"
        )
        response = auth_client.get("/api/v1/matching/discover/")
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestMatches:
    def test_list_matches(self, auth_client, user, other_user):
        Match.objects.create(user_a=user, user_b=other_user)
        response = auth_client.get("/api/v1/matching/matches/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
