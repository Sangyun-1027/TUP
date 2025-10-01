from django.urls import path, include
from .views import APIRootView, HealthCheckView, ServerTimeView, WhoAmIView

urlpatterns = [
    path("", APIRootView.as_view(), name="api-root"),
    path("health/", HealthCheckView.as_view(), name="api-health"),
    path("server-time/", ServerTimeView.as_view(), name="api-server-time"),
    path("whoami/", WhoAmIView.as_view(), name="api-whoami"),
    path("team1/", include(("TeamMatching1.urls", "team_matching1"), namespace="team_matching1")),
    path("team2/", include(("TeamMatching2.urls", "team_matching2"), namespace="team_matching2")),
]