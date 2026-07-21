from django.contrib import admin
from .models import Like, Match, Block, Dislike


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ("from_user", "to_user", "is_super_like", "created_at")
    list_filter = ("is_super_like",)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ("user_a", "user_b", "matched_at", "is_active")
    list_filter = ("is_active",)


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("blocker", "blocked", "created_at")


@admin.register(Dislike)
class DislikeAdmin(admin.ModelAdmin):
    list_display = ("from_user", "to_user", "created_at")
