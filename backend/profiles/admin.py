from django.contrib import admin
from .models import Interest, Profile, Photo


@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)
    search_fields = ("name",)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("display_name", "user", "gender", "city", "profile_completion_score", "is_active")
    list_filter = ("gender", "gender_preference", "relationship_goal", "is_active")
    search_fields = ("display_name", "user__email", "city")
    filter_horizontal = ("interests",)


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "profile", "is_primary", "is_verified", "uploaded_at")
    list_filter = ("is_primary", "is_verified")
