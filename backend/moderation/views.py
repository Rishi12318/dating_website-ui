from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Report
from .serializers import ReportSerializer, ReportCreateSerializer, ReportAdminSerializer

User = get_user_model()


class ReportCreateView(generics.CreateAPIView):
    serializer_class = ReportCreateSerializer

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class MyReportsView(generics.ListAPIView):
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.filter(reporter=self.request.user)


class AdminReportListView(generics.ListAPIView):
    serializer_class = ReportAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Report.objects.filter(status="pending")


class AdminReportActionView(generics.UpdateAPIView):
    serializer_class = ReportAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Report.objects.all()

    def update(self, request, *args, **kwargs):
        report = self.get_object()
        action = request.data.get("action")
        admin_notes = request.data.get("admin_notes", "")

        if action == "warn":
            report.status = "resolved"
            report.admin_notes = f"Warning issued. {admin_notes}"
        elif action == "suspend":
            report.status = "resolved"
            report.admin_notes = f"Account suspended. {admin_notes}"
            report.reported_user.is_active = False
            report.reported_user.save()
        elif action == "ban":
            report.status = "resolved"
            report.admin_notes = f"Account banned. {admin_notes}"
            report.reported_user.is_banned = True
            report.reported_user.is_active = False
            report.reported_user.save()
        elif action == "dismiss":
            report.status = "dismissed"
            report.admin_notes = f"Dismissed. {admin_notes}"
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        report.save()
        return Response(ReportAdminSerializer(report).data)
