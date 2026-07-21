from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("users.urls")),
    path("api/v1/profiles/", include("profiles.urls")),
    path("api/v1/matching/", include("matching.urls")),
    path("api/v1/messaging/", include("messaging.urls")),
    path("api/v1/moderation/", include("moderation.urls")),
    path("api/v1/compatibility/", include("compatibility.urls")),
    path("api/v1/ml/", include("ml_engine.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
