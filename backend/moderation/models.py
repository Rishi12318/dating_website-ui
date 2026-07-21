from django.db import models
from django.conf import settings
import uuid


class Report(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("resolved", "Resolved"),
        ("dismissed", "Dismissed"),
    ]

    REASON_CHOICES = [
        ("fake_profile", "Fake profile"),
        ("inappropriate_content", "Inappropriate content"),
        ("harassment", "Harassment"),
        ("spam", "Spam"),
        ("underage", "Underage user"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reports_filed")
    reported_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reports_received")
    reason = models.CharField(max_length=30, choices=REASON_CHOICES)
    description = models.TextField(max_length=1000, blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    admin_notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reports"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Report by {self.reporter.email} against {self.reported_user.email}"
