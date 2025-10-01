from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.contrib.auth.models import User

from .models import Team, UserProfile, Application, Invitation
from .serializers import (
    TeamSerializer, UserProfileSerializer, InvitationSerializer
)
import json

# ===================================================================
# [임시 조치] 더미 유저를 찾아오거나 새로 만드는 함수
# ===================================================================
def get_dummy_user_profile():
    dummy_user, user_created = User.objects.get_or_create(username='dummyuser')
    user_profile, profile_created = UserProfile.objects.get_or_create(user=dummy_user)
    if profile_created:
        user_profile.mainRole = "임시 역할"
        user_profile.save()
    return user_profile

# ---------- 내부 유틸 ----------
def _member_count(team: Team) -> int:
    return team.members.count()

def _is_leader(team: Team, user_profile: UserProfile) -> bool:
    return team.leader_id == user_profile.id

def _already_member(team: Team, user_profile: UserProfile) -> bool:
    return team.members.filter(id=user_profile.id).exists()

def _team_is_full(team: Team) -> bool:
    return _member_count(team) >= int(team.max_members or 0)


# 1) 팀 생성
class TeamCreateView(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data
        user_profile = get_dummy_user_profile()
        name = f"{user_profile.user.username}의 팀"
        
        leader_info = data.get('leaderInfo', {})
        if leader_info:
            user_profile.mainRole = leader_info.get('mainRole', user_profile.mainRole)
            user_profile.subRole = leader_info.get('subRole', user_profile.subRole)
            user_profile.keywords = leader_info.get('keywords', user_profile.keywords)
            user_profile.save()
        
        max_members = data.get('maxMembers')
        if max_members is None: return Response({"error": "max_members는 필수입니다."}, status=400)
        
        team = Team.objects.create(
            name=name,
            leader=user_profile,
            tech=data.get('skills', []),
            looking_for=data.get('lookingFor', []),
            max_members=int(max_members),
            category=data.get('category', ''),
            intro=data.get('intro', '')
        )
        team.members.add(user_profile)
        return Response(TeamSerializer(team).data, status=201)

# 2) 유저 프로필 수정 및 등록 해제 (post와 delete가 모두 포함된 최종본)
class UserProfileUpdateView(APIView):
    @transaction.atomic
    def post(self, request):
        user_profile = get_dummy_user_profile()
        d = request.data
        user_profile.skills = d.get('skills', user_profile.skills)
        user_profile.keywords = d.get('keywords', user_profile.keywords)
        user_profile.mainRole = d.get('mainRole', user_profile.mainRole)
        user_profile.subRole = d.get('subRole', user_profile.subRole)
        user_profile.save()
        return Response({"message": "유저 정보가 성공적으로 수정되었습니다."}, status=200)

    # 이 delete 함수가 포함되어 있어야 합니다.
    def delete(self, request):
        user_profile = get_dummy_user_profile()
        try:
            # UserProfile만 삭제합니다. 기본 User(dummyuser)는 남겨둡니다.
            user_profile.delete()
            return Response({"message": "프로필이 성공적으로 삭제(등록 해제)되었습니다."}, status=200)
        except UserProfile.DoesNotExist:
            return Response({"error": "삭제할 프로필이 없습니다."}, status=404)

# 3) 팀 신청 (유저 → 팀)
class TeamApplyView(APIView):
    @transaction.atomic
    def post(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)
        user_profile = get_dummy_user_profile()
        if _already_member(team, user_profile): return Response({"detail": "이미 팀원입니다."}, status=400)
        if Application.objects.filter(team=team, user=user_profile, status='pending').exists(): return Response({"detail": "대기 중인 신청이 이미 있습니다."}, status=400)
        Application.objects.create(team=team, user=user_profile, status='pending')
        return Response({"detail": "팀 신청이 완료되었습니다."}, status=201)

# 4) 초대 수락
class AcceptInviteView(APIView):
    @transaction.atomic
    def post(self, request, invite_id):
        user_profile = get_dummy_user_profile()
        invitation = get_object_or_404(Invitation, id=invite_id, user=user_profile)
        if invitation.status != 'pending': return Response({"detail": "이미 처리된 초대입니다."}, status=400)
        
        team = invitation.team
        if _team_is_full(team): return Response({"detail": "정원 초과로 수락할 수 없습니다."}, status=400)

        team.members.add(user_profile)
        invitation.status = 'accepted'
        invitation.save()
        return Response({"detail": "초대를 수락했습니다.", "team_id": team.id}, status=200)

# 5) 초대 거절
class RejectInviteView(APIView):
    @transaction.atomic
    def post(self, request, invite_id):
        user_profile = get_dummy_user_profile()
        invite = get_object_or_404(Invitation, id=invite_id, user=user_profile)
        if invite.status != 'pending': return Response({"detail": "이미 처리된 초대입니다."}, status=400)
        invite.status = 'rejected'
        invite.save()
        return Response({"message": f'팀 "{invite.team.id}" 초대를 거절했습니다.'}, status=200)

# 6) 신청 수락 (팀 리더만)
class AcceptApplicationView(APIView):
    @transaction.atomic
    def post(self, request, team_id):
        me = get_dummy_user_profile()
        team = get_object_or_404(Team, id=team_id)
        if not _is_leader(team, me): return Response({'error': '권한 없음'}, status=403)
        
        applicant_user_id = request.data.get('user_id')
        applicant_profile = get_object_or_404(UserProfile, id=applicant_user_id)
        app = get_object_or_404(Application, team=team, user=applicant_profile, status='pending')
        
        if _team_is_full(team): return Response({'error': '정원 초과로 수락 불가'}, status=400)

        team.members.add(app.user)
        app.status = 'accepted'
        app.save()
        return Response({'message': f'"{app.user.user.username}"님의 신청을 수락했습니다.'}, status=200)

# 7) 신청 거절 (팀 리더만)
class RejectApplicationView(APIView):
    @transaction.atomic
    def post(self, request, application_id):
        me = get_dummy_user_profile()
        app = get_object_or_404(Application, id=application_id)
        if not _is_leader(app.team, me): return Response({'error': '권한 없음'}, status=403)
        if app.status != 'pending': return Response({'error': '이미 처리된 신청입니다.'}, status=400)
        
        app.status = 'rejected'
        app.save()
        return Response({'message': f'"{app.user.user.username}"님의 신청을 거절했습니다.'}, status=200)

# 8) 초대 보내기 (팀 리더만)
class InviteUserView(APIView):
    @transaction.atomic
    def post(self, request, team_id):
        me = get_dummy_user_profile()
        team = get_object_or_404(Team, id=team_id)
        if not _is_leader(team, me): return Response({'error': '권한 없음'}, status=403)
        
        target_user_id = request.data.get('user_id')
        target_profile = get_object_or_404(UserProfile, user__id=target_user_id)
        
        if Invitation.objects.filter(team=team, user=target_profile, status='pending').exists():
            return Response({'error': '대기 중인 초대가 이미 있습니다.'}, status=400)
            
        Invitation.objects.create(team=team, user=target_profile, status='pending')
        return Response({'message': f'"{target_profile.user.username}"님에게 초대를 보냈습니다.'}, status=200)


# 10. 팀 상세 정보 조회 및 삭제 (get과 delete가 모두 포함된 최종본)
class TeamDetailView(APIView):
    # 팀 상세 정보를 가져오는 기능
    def get(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)
        serializer = TeamSerializer(team)
        return Response(serializer.data)

    # 팀을 삭제하는 기능
    def delete(self, request, team_id):
        me = get_dummy_user_profile()
        team = get_object_or_404(Team, id=team_id)

        # 현재 사용자가 팀장인지 확인 (권한 체크)
        if not _is_leader(team, me):
            return Response({"error": "팀을 삭제할 권한이 없습니다."}, status=403)

        # 팀 삭제
        team.delete()

        return Response({"message": "팀이 성공적으로 삭제되었습니다."}, status=200)


# 11) 팀 리스트 (리워드 우선 정렬 기능 복구)
class TeamListView(APIView):
    def get(self, request):
        qs = Team.objects.select_related('leader').prefetch_related('members').all()
        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        team_with_flags = []
        for team in qs:
            has_reward = getattr(team.leader, 'has_reward', False) or any(
                getattr(m, 'has_reward', False) for m in team.members.all()
            )
            team_with_flags.append((has_reward, team))

        sorted_teams = [t for _, t in sorted(team_with_flags, key=lambda x: (not x[0], x[1].id))]
        data = TeamSerializer(sorted_teams, many=True).data
        return Response({"message": "리워드 우선으로 정렬된 팀 목록입니다.", "teams": data}, status=200)


# 12) 내 초대 내역 (상태 필터링 기능 복구)
class MyInvitesView(APIView):
    def get(self, request):
        user_profile = get_dummy_user_profile()
        status_param = request.query_params.get('status') # 기본값 'pending' 제거하여 전체 조회 가능하게
        invites = Invitation.objects.filter(user=user_profile)
        if status_param:
            invites = invites.filter(status=status_param)
        return Response(InvitationSerializer(invites.order_by('-id'), many=True).data, status=200)
    
# 13) 내가 신청한 팀들
class MyApplicationsView(APIView):
    def get(self, request):
        user_profile = get_dummy_user_profile()
        apps = Application.objects.select_related('team').filter(user=user_profile).order_by('-id')
        data = [{'id': a.id, 'team': a.team.id, 'status': a.status} for a in apps]
        return Response(data, status=200)

# 14) 지원자 필터 (검색 기능 복구)
class ApplicantFilterView(APIView):
    def get(self, request):
        role = request.query_params.get('role', '')
        skill = request.query_params.get('skill', '')
        min_rating = request.query_params.get('min_rating', '')
        qs = UserProfile.objects.select_related('user').all()

        if role:
            qs = qs.filter(mainRole__icontains=role) | qs.filter(subRole__icontains=role)
        if skill:
            # skills 필드가 JSONField(list) 이므로, icontains 대신 다른 방식 필요
            # 여기서는 간단하게 텍스트 검색으로 유지하나, 실제로는 list 검색 로직이 더 적합
            qs = qs.filter(skills__icontains=skill) 
        if min_rating:
            try:
                qs = qs.filter(rating__gte=float(min_rating))
            except (ValueError, TypeError):
                pass # 잘못된 값이면 무시
        data = UserProfileSerializer(qs.order_by('-rating', 'id'), many=True).data
        return Response(data, status=200)