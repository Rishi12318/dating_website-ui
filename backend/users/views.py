import secrets
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import EmailVerificationToken, PasswordResetToken
from .serializers import (
    UserRegisterSerializer, UserSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    EmailVerificationSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token_obj = EmailVerificationToken.objects.create(
            user=user,
            token=secrets.token_urlsafe(64),
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            "verification_token": token_obj.token,
            "message": "Registration successful. Please verify your email.",
        }, status=status.HTTP_201_CREATED)


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_obj = EmailVerificationToken.objects.filter(
            token=serializer.validated_data["token"],
            is_used=False,
        ).first()

        if not token_obj:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        token_obj.is_used = True
        token_obj.save()

        user = token_obj.user
        user.is_verified = True
        user.save()

        return Response({"message": "Email verified successfully"})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if not user or not user.check_password(serializer.validated_data["password"]):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if user.is_banned:
            return Response({"error": "Account is banned"}, status=status.HTTP_403_FORBIDDEN)

        if not user.is_active:
            return Response({"error": "Account is deactivated"}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
        })


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user:
            PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
            token_obj = PasswordResetToken.objects.create(
                user=user,
                token=secrets.token_urlsafe(64),
                expires_at=timezone.now() + timedelta(hours=1),
            )
            return Response({
                "message": "If an account with that email exists, a reset link has been sent.",
                "reset_token": token_obj.token,
            })
        return Response({"message": "If an account with that email exists, a reset link has been sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_obj = PasswordResetToken.objects.filter(
            token=serializer.validated_data["token"],
            is_used=False,
        ).first()

        if not token_obj or token_obj.is_expired:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        token_obj.is_used = True
        token_obj.save()

        user = token_obj.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response({"message": "Password reset successful"})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
