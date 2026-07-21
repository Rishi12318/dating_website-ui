from django.db import models
from django.conf import settings
import uuid


class Recommendation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recommendations")
    recommended_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recommended_to")
    match_score = models.FloatField(default=0)
    reason = models.TextField(blank=True, default="")
    model_version = models.CharField(max_length=50, default="v1.0")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "recommendations"
        ordering = ["-match_score", "-created_at"]
        unique_together = ["user", "recommended_user"]

    def __str__(self):
        return f"Recommend: {self.user.email} -> {self.recommended_user.email} ({self.match_score})"


class ModelMetrics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model_version = models.CharField(max_length=50)
    precision_at_k = models.FloatField(null=True, blank=True)
    recall_at_k = models.FloatField(null=True, blank=True)
    training_samples = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "model_metrics"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Metrics: {self.model_version} ({self.created_at})"
