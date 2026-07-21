from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    reporter_email = serializers.CharField(source="reporter.email", read_only=True)
    reported_user_email = serializers.CharField(source="reported_user.email", read_only=True)

    class Meta:
        model = Report
        fields = [
            "id", "reporter", "reporter_email", "reported_user", "reported_user_email",
            "reason", "description", "status", "admin_notes", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "reporter", "status", "admin_notes", "created_at", "updated_at"]


class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["reported_user", "reason", "description"]


class ReportAdminSerializer(serializers.ModelSerializer):
    reporter_email = serializers.CharField(source="reporter.email", read_only=True)
    reported_user_email = serializers.CharField(source="reported_user.email", read_only=True)

    class Meta:
        model = Report
        fields = [
            "id", "reporter", "reporter_email", "reported_user", "reported_user_email",
            "reason", "description", "status", "admin_notes", "created_at", "updated_at",
        ]
