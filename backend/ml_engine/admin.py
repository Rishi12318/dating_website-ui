from django.contrib import admin
from .models import Recommendation, ModelMetrics


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ("user", "recommended_user", "match_score", "model_version", "created_at")
    list_filter = ("model_version",)


@admin.register(ModelMetrics)
class ModelMetricsAdmin(admin.ModelAdmin):
    list_display = ("model_version", "precision_at_k", "recall_at_k", "training_samples", "created_at")
