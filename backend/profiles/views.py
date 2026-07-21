from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Profile, Photo, Interest
from .serializers import (
    ProfileSerializer, ProfileListSerializer,
    PhotoSerializer, InterestSerializer, InterestCreateSerializer,
)


class ProfileCreateUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "display_name": self.request.user.email.split("@")[0],
                "birth_date": "2000-01-01",
                "gender": "O",
            },
        )
        return profile


class ProfileListView(generics.ListAPIView):
    serializer_class = ProfileListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(is_active=True).exclude(user=self.request.user)


class ProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.filter(is_active=True)


class PhotoUploadView(generics.CreateAPIView):
    serializer_class = PhotoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        profile, _ = Profile.objects.get_or_create(
            user=self.request.user,
            defaults={
                "display_name": self.request.user.email.split("@")[0],
                "birth_date": "2000-01-01",
                "gender": "O",
            },
        )
        serializer.save(profile=profile)


class PhotoDeleteView(generics.DestroyAPIView):
    serializer_class = PhotoSerializer

    def get_queryset(self):
        profile = Profile.objects.filter(user=self.request.user).first()
        if profile:
            return Photo.objects.filter(profile=profile)
        return Photo.objects.none()


class InterestListView(generics.ListAPIView):
    serializer_class = InterestSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Interest.objects.all()


class InterestCreateView(generics.CreateAPIView):
    serializer_class = InterestSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(["POST"])
def set_primary_photo(request, photo_id):
    profile = Profile.objects.filter(user=request.user).first()
    if not profile:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    photo = get_object_or_404(Photo, id=photo_id, profile=profile)
    Photo.objects.filter(profile=profile, is_primary=True).update(is_primary=False)
    photo.is_primary = True
    photo.save()

    return Response({"message": "Primary photo updated"})
