from django.urls import path
from . import views

app_name = "team_matching1"

urlpatterns = [
    path("teamup1/save/", views.save_user_input),
    path("teamup1/apply/", views.apply_teamup),
    path("teamup1/teams/", views.get_matched_teams),
    path("teamup1/feedback/", views.submit_feedback),
    path("teamup1/waiting/", views.get_waiting_users),

    # path("teamup/submit_feedback", views.perform_feedback_action),  # ✔️ 마지막 API만 /teamup 사용
]
