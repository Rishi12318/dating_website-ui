from django.urls import path
from . import views

urlpatterns = [
    path("report/", views.ReportCreateView.as_view(), name="report_create"),
    path("my-reports/", views.MyReportsView.as_view(), name="my_reports"),
    path("admin/reports/", views.AdminReportListView.as_view(), name="admin_report_list"),
    path("admin/reports/<uuid:pk>/action/", views.AdminReportActionView.as_view(), name="admin_report_action"),
]
