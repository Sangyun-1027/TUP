from django.urls import path
from . import views

app_name = "team_matching1"

urlpatterns = [
    path("teamup1/save/", views.save_user_input, name="save_user_input"),
    path("teamup1/apply/", views.apply_teamup, name="apply_teamup"),
    path("teamup1/teams/", views.get_matched_teams, name="get_matched_teams"),
    path("teamup1/feedback/", views.submit_feedback, name="submit_feedback"),
]