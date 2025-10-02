from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def healthz(_):
    return JsonResponse({"ok": True})

urlpatterns = [
    path("admin/", admin.site.urls),

    # 헬스체크 (Docker healthcheck 용)
    path("healthz/", healthz),

    # JWT
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # 공용 API (ping/version 등)
    path("api/", include("api.urls")),
]
