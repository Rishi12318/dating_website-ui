import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestRegister:
    def test_register_success(self, api_client):
        response = api_client.post("/api/v1/auth/register/", {
            "email": "new@example.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert "tokens" in response.data
        assert "verification_token" in response.data

    def test_register_password_mismatch(self, api_client):
        response = api_client.post("/api/v1/auth/register/", {
            "email": "new@example.com",
            "password": "StrongPass123!",
            "password_confirm": "DifferentPass!",
        }, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self, api_client, user):
        response = api_client.post("/api/v1/auth/register/", {
            "email": "test@example.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, user):
        response = api_client.post("/api/v1/auth/login/", {
            "email": "test@example.com",
            "password": "testpass123",
        }, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert "tokens" in response.data

    def test_login_invalid_credentials(self, api_client, user):
        response = api_client.post("/api/v1/auth/login/", {
            "email": "test@example.com",
            "password": "wrongpass",
        }, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_banned_user(self, api_client, user):
        user.is_banned = True
        user.save()
        response = api_client.post("/api/v1/auth/login/", {
            "email": "test@example.com",
            "password": "testpass123",
        }, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestVerifyEmail:
    def test_verify_email_success(self, api_client, user):
        from users.models import EmailVerificationToken
        token = EmailVerificationToken.objects.create(
            user=user, token="test-token-123"
        )
        response = api_client.post("/api/v1/auth/verify-email/", {
            "token": "test-token-123",
        }, format="json")
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.is_verified is True

    def test_verify_email_invalid_token(self, api_client):
        response = api_client.post("/api/v1/auth/verify-email/", {
            "token": "invalid-token",
        }, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPasswordReset:
    def test_password_reset_request(self, api_client, user):
        response = api_client.post("/api/v1/auth/password-reset/", {
            "email": "test@example.com",
        }, format="json")
        assert response.status_code == status.HTTP_200_OK

    def test_password_reset_confirm(self, api_client, user):
        from users.models import PasswordResetToken
        from django.utils import timezone
        from datetime import timedelta
        token = PasswordResetToken.objects.create(
            user=user,
            token="reset-token-123",
            expires_at=timezone.now() + timedelta(hours=1),
        )
        response = api_client.post("/api/v1/auth/password-reset/confirm/", {
            "token": "reset-token-123",
            "new_password": "NewStrongPass123!",
            "new_password_confirm": "NewStrongPass123!",
        }, format="json")
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.check_password("NewStrongPass123!")


@pytest.mark.django_db
class TestProfile:
    def test_get_profile(self, auth_client, user):
        response = auth_client.get("/api/v1/profiles/")
        assert response.status_code == status.HTTP_200_OK

    def test_update_profile(self, auth_client, user):
        response = auth_client.patch("/api/v1/profiles/", {
            "display_name": "Test User",
            "bio": "Hello world",
            "city": "New York",
        }, format="json")
        assert response.status_code == status.HTTP_200_OK
