from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.db.models import OuterRef, Subquery, DateTimeField
from django.utils import timezone
from datetime import timedelta
from .serializers import UserProfileSerializer

from .models import Team, User, Application, Invitation, UserProfile, TeamPin, Ticket
from .serializers import TeamSerializer, UserSerializer
from .serializers import InvitationSerializer


import json

# 1. 팀 생성
class TeamCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        try:
            user_profile = request.user.userprofile
        except Exception as e:
            return Response({"error": f"UserProfile error: {str(e)}"}, status=400)

        name = data.get('name')
        if not name:
            return Response({"error": "팀 이름(name)은 필수입니다."}, status=400)

        max_members = data.get('max_members')
        if max_members is None:
            return Response({"error": "max_members는 필수입니다."}, status=400)

        try:
            max_members = int(max_members)
        except ValueError:
            return Response({"error": "max_members는 숫자여야 합니다."}, status=400)

        tech = data.get('tech', [])
        looking_for = data.get('looking_for', [])

        if isinstance(tech, str):
            try:
                tech = json.loads(tech)
            except Exception:
                tech = []

        if isinstance(looking_for, str):
            try:
                looking_for = json.loads(looking_for)
            except Exception:
                looking_for = []

        try:
            team = Team.objects.create(
                name=name,
                leader_id=user_profile,
                tech=tech,
                looking_for=looking_for,
                max_members=max_members,
            )
            team.members.add(user_profile)

            return Response({
                'message': '팀 생성이 완료되었습니다.',
                'team_id': team.id
            }, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

# 2. 유저 정보 수정
class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        
        # UserProfile이 없으면 생성
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        data = request.data
        profile.skills = data.get('skills', profile.skills)
        profile.keywords = data.get('keywords', profile.keywords)
        profile.main_role = data.get('mainRole', profile.main_role)
        profile.sub_role = data.get('subRole', profile.sub_role)
        profile.save()

        return Response({
            'message': '유저 정보가 성공적으로 수정되었습니다.',
            'user_id': user.id
        }, status=200)
    
    
# 3. 팀 신청
class TeamApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)
        user_profile = UserProfile.objects.get(user=request.user.userprofile)
        
        # 이미 신청했는지 중복 검사 (선택)
        if Application.objects.filter(team=team, user=user_profile).exists():
            return Response({"detail": "이미 신청한 팀입니다."}, status=400)

        Application.objects.create(team=team, user=user_profile)
        return Response({"detail": "팀 신청이 완료되었습니다."}, status=201)


# 4. 초대 수락
class AcceptInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invite_id):
        invitation = get_object_or_404(Invitation, id=invite_id)
        user_profile = UserProfile.objects.get(user=request.user.userprofile)

        if invitation.user != user_profile:
            return Response({"detail": "권한이 없습니다."}, status=403)

        invitation.status = 'accepted'
        invitation.save()

        # 팀 멤버로 추가
        invitation.team.members.add(user_profile)

        return Response({"detail": "초대가 수락되었습니다."})


# 5. 초대 거절
class RejectInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invite_id):
        invite = get_object_or_404(
            Invitation,
            id=invite_id,
            user=request.user.userprofile
        )

        # 상태 변경
        invite.status = 'rejected'
        invite.save()

        return Response({
            'message': f'팀 "{invite.team.id}" 초대를 거절했습니다.',
            'team_id': invite.team.id
        }, status=200)



# 6. 신청 수락
class AcceptApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):
        app = get_object_or_404(Application, id=application_id)

        # 권한 체크: 팀 리더만 가능
        if app.team.leader_id != request.user.userprofile:
            return Response({'error': '권한 없음'}, status=403)

        # 팀원 추가 및 상태 변경
        app.team.members.add(app.user)
        app.status = 'accepted'
        app.save()

        return Response({
            'message': f'"{app.user.username}"님의 신청을 수락했습니다.',
            'team_id': app.team.id
        }, status=200)



# 7. 신청 거절
class RejectApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):
        app = get_object_or_404(Application, id=application_id)

        # 권한 체크: 팀 리더만 가능
        if app.team.leader_id != request.user.userprofile:
            return Response({'error': '권한 없음'}, status=403)

        # 상태 변경
        app.status = 'rejected'
        app.save()

        return Response({
            'message': f'"{app.user.username}"님의 신청을 거절했습니다.',
            'team_id': app.team.id
        }, status=200)



# 8. 초대 보내기
class InviteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)

        # 권한 체크: 팀 리더만 가능
        if team.leader_id.user != request.user.userprofile:
            return Response({'error': '권한 없음'}, status=403)

        # 초대할 사용자 프로필 가져오기
        user_profile = get_object_or_404(UserProfile, user_id=request.data['user_id'])

        # 초대 생성
        Invitation.objects.create(team=team, user=user_profile, status='pending')

        return Response({
            'message': f'"{user_profile.user.username}"님에게 초대를 보냈습니다.',
            'team_id': team.id
        }, status=200)


# 9. 팀 리스트 (핀 사용팀 상단 고정)
class TeamListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Team.objects.prefetch_related('members').select_related('leader')

        now = timezone.now()

        # 각 팀별로 만료되지 않은 가장 최신 TeamPin 조회
        latest_pin_sq = TeamPin.objects.filter(
            team=OuterRef('pk'),
            active=True,
            expires_at__gt=now
        ).order_by('-expires_at').values('expires_at')[:1]

        qs = qs.annotate(
            pin_until=Subquery(latest_pin_sq, output_field=DateTimeField())
        ).order_by(
            '-pin_until',  # pin 있는 팀 우선
            'id'           # 동일 조건일 경우 id 오름차순
        )

        serializer = TeamSerializer(qs, many=True)
        return Response({
            "message": "팀 목록을 상단 고정권(24h) 기준으로 정렬합니다.",
            "teams": serializer.data
        }, status=200)




# 10. 팀 상세
class TeamDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        team = get_object_or_404(
            Team.objects.prefetch_related('members', 'application_set__user'),
            id=team_id
        )
        serializer = TeamSerializer(team)
        return Response(serializer.data)


# 11. 내 초대 내역
class MyInvitesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = request.user.userprofile  # UserProfile 인스턴스 가져오기
        invites = Invitation.objects.filter(user=user_profile, status='pending')
        serializer = InvitationSerializer(invites, many=True)
        return Response(serializer.data)


# 12. 내가 신청한 팀들
class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        apps = Application.objects.filter(user=request.user.userprofile).select_related('team')
        data = [{'id': app.id, 'team': app.team.id, 'status': app.status} for app in apps]
        return Response(data)


# 13. 유저 필터링 
class ApplicantFilterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 쿼리 파라미터
        role = request.query_params.get('role', '')
        sub_role = request.query_params.get('sub_role', '')
        skill = request.query_params.get('skill', '')
        keyword = request.query_params.get('keyword', '')
        min_rating = request.query_params.get('min_rating', '')
        min_participation = request.query_params.get('min_participation', '')
        has_reward = request.query_params.get('has_reward', '')  # 'true' or 'false'
        is_leader = request.query_params.get('is_leader', '')      # 'true' or 'false'

        users = UserProfile.objects.all()  # UserProfile 기준으로 조회

        # 필터 적용
        if role:
            users = users.filter(mainRole__icontains=role)

        if sub_role:
            users = users.filter(subRole__icontains=sub_role)

        if skill:
            users = users.filter(skills__icontains=skill)

        if keyword:
            users = users.filter(keywords__icontains=keyword)

        if min_rating:
            try:
                users = users.filter(rating__gte=float(min_rating))
            except ValueError:
                pass

        if min_participation:
            try:
                users = users.filter(participation__gte=int(min_participation))
            except ValueError:
                pass

        if has_reward.lower() == 'true':
            users = users.filter(has_reward=True)
        elif has_reward.lower() == 'false':
            users = users.filter(has_reward=False)

        serializer = UserProfileSerializer(users, many=True)  # UserSerializer → UserProfileSerializer
        return Response(serializer.data)
    
    

# 14. 팀 리더가 핀 티켓 사용
class UsePinTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)
        profile = request.user.userprofile

        # 팀 리더만 사용 가능
        if team.leader_id != profile:
            return Response({"error": "팀 리더만 핀 티켓을 사용할 수 있습니다."}, status=403)

        # 사용 가능한 티켓 조회 (예: Ticket 모델에서)
        ticket = Ticket.objects.filter(user_profile=profile, type='pin', used=False).first()
        if not ticket:
            return Response({"error": "사용 가능한 핀 티켓이 없습니다."}, status=400)

        # 티켓 사용 처리
        ticket.used = True
        ticket.redeemed_at = timezone.now()
        ticket.expires_at = timezone.now() + timedelta(hours=24)
        ticket.save()

        # 기존 활성 TeamPin 비활성화
        TeamPin.objects.filter(team=team, active=True, expires_at__gt=timezone.now()).update(active=False)

        # 새 TeamPin 생성
        TeamPin.objects.create(team=team, user=profile, active=True, expires_at=ticket.expires_at)

        return Response({
            "message": f"팀 '{team.name}'이(가) 24시간 상단 고정되었습니다.",
            "pinned_until": ticket.expires_at
        }, status=200)