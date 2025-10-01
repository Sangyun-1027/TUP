from django.urls import path, include
from .views import (
    TeamListView, TeamCreateView, TeamDetailView, TeamApplyView, InviteUserView,
    AcceptInviteView, RejectInviteView, MyInvitesView,
    AcceptApplicationView, RejectApplicationView, MyApplicationsView,
    ApplicantFilterView
)
from .views import UserProfileUpdateView
from . import views


urlpatterns = [

    # 팀 (Teams)
    path('teams/', views.TeamListView.as_view(), name='team-list'),
    path('teams/create/', views.TeamCreateView.as_view(), name='team-create'),
    path('teams/<int:team_id>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('teams/<int:team_id>/apply/', views.TeamApplyView.as_view(), name='team-apply'),
    path('teams/<int:team_id>/invite/', views.InviteUserView.as_view(), name='team-invite'),
    path('teams/<int:team_id>/accept/', views.AcceptApplicationView.as_view(), name='accept-application'),

    # 초대 (Invitations)
    path('invitations/<int:invite_id>/accept/', views.AcceptInviteView.as_view(), name='accept-invite'),
    path('invitations/<int:invite_id>/reject/', views.RejectInviteView.as_view(), name='reject-invite'),
    path('my-invites/', views.MyInvitesView.as_view(), name='my-invites'),

    # 신청 (Applications)
    path('applications/<int:application_id>/reject/', views.RejectApplicationView.as_view(), name='reject-application'),
    path('my-applications/', views.MyApplicationsView.as_view(), name='my-applications'),

    # 유저 프로필 (User Profiles)
    path('applicants/filter/', views.ApplicantFilterView.as_view(), name='applicant-filter'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='userprofile-update'),
]
