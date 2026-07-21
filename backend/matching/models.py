from django.db import models
from django.conf import settings
import uuid


class Like(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="likes_given")
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="likes_received")
    is_super_like = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "likes"
        unique_together = ["from_user", "to_user"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.from_user.email} -> {self.to_user.email}"


class Match(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_a = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="matches_as_a")
    user_b = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="matches_as_b")
    matched_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "matches"
        ordering = ["-matched_at"]

    def __str__(self):
        return f"Match: {self.user_a.email} <-> {self.user_b.email}"

    def save(self, *args, **kwargs):
        if self.user_a.id > self.user_b.id:
            self.user_a, self.user_b = self.user_b, self.user_a
        super().save(*args, **kwargs)


class Block(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blocker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blocks_given")
    blocked = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blocks_received")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "blocks"
        unique_together = ["blocker", "blocked"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.blocker.email} blocked {self.blocked.email}"


class Dislike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="dislikes_given")
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="dislikes_received")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "dislikes"
        unique_together = ["from_user", "to_user"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.from_user.email} disliked {self.to_user.email}"
