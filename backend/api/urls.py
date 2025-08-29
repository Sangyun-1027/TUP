from django.urls import path
from .views import (
    TeamListView, TeamCreateView, TeamDetailView, TeamApplyView, InviteUserView,
    AcceptInviteView, RejectInviteView, MyInvitesView,
    AcceptApplicationView, RejectApplicationView, MyApplicationsView,
    ApplicantFilterView
)
from .views import UserProfileUpdateView
from .views import UsePinTicketView


urlpatterns = [
    # 팀
    path('teams/', TeamListView.as_view(), name='team-list'),  
    path('teams/create/', TeamCreateView.as_view(), name='team-create'),  
    path('teams/<int:team_id>/', TeamDetailView.as_view(), name='team-detail'),  
    path('teams/<int:team_id>/apply/', TeamApplyView.as_view(), name='team-apply'),  
    path('teams/<int:team_id>/invite/', InviteUserView.as_view(), name='team-invite'),  

    # 초대
    path('invitations/<int:invite_id>/accept/', AcceptInviteView.as_view(), name='accept-invite'),  
    path('invitations/<int:invite_id>/reject/', RejectInviteView.as_view(), name='reject-invite'),  
    path('my-invites/', MyInvitesView.as_view(), name='my-invites'),  

    # 신청
    path('applications/<int:application_id>/accept/', AcceptApplicationView.as_view(), name='accept-application'),  
    path('applications/<int:application_id>/reject/', RejectApplicationView.as_view(), name='reject-application'),  
    path('my-applications/', MyApplicationsView.as_view(), name='my-applications'),  

    # 유저 필터링 
    path('applicants/filter/', ApplicantFilterView.as_view(), name='applicant-filter'),
    
    # 프로필 업데이트
    path('profile/update/', UserProfileUpdateView.as_view(), name='userprofile-update'),
    
    # 리워드 티켓 사용
    path('teams/<int:team_id>/use-pin/', UsePinTicketView.as_view(), name='use-pin-ticket'),
]
