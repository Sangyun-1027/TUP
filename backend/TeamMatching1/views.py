from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import json

from .models import WaitingUser, Team, TeamMember, Feedback  # ✅ 같은 앱에서 import

User = get_user_model()  # ✅ Django 기본 User (username, email만 있음)

# 팀 정원(기존 TM1 로직 기준 4명)
TEAM_SIZE = 4


@csrf_exempt
@api_view(['POST'])
def save_user_input(request):
    d = request.data
    user_id = str(d.get("userId", "")).strip()
    if not user_id:
        return Response({"message": "userId가 필요합니다."}, status=400)

    WaitingUser.objects.update_or_create(
        user_id=user_id,
        defaults={
            "skills": d.get("skills", []) or [],
            "main_role": d.get("mainRole") or "unknown",
            "sub_role": d.get("subRole"),
            "keywords": d.get("keywords", []) or [],
            "has_reward": bool(d.get("hasReward", False)),
        },
    )
    return Response({"message": "사용자 정보 저장 완료"}, status=200)


@csrf_exempt
@api_view(['POST'])
def apply_teamup(request):
    print("🔥 [views.py] apply_teamup 요청 도착!", request.method)
    print("📦 request.data:", request.data)

    raw = request.data.get("userId")
    if raw is None:
        return Response({"message": "userId가 필요합니다."}, status=400)

    try:
        user_pk = int(str(raw).strip())
    except ValueError:
        return Response({"message": "userId는 정수여야 합니다."}, status=400)

    # 이미 팀에 소속된 경우 예외 처리
    if TeamMember.objects.filter(user_id=user_pk).exists():
        return Response({"message": "이미 팀에 속한 유저입니다."}, status=400)

    # Django User 테이블에서 존재 여부 확인
    try:
        applicant = User.objects.get(id=user_pk)
    except User.DoesNotExist:
        return Response({"message": "해당 유저를 찾을 수 없습니다."}, status=404)

    # 아직 팀에 소속되지 않은 모든 유저
    available_users = list(
        User.objects.exclude(id__in=TeamMember.objects.values_list("user_id", flat=True))
    )

    # 리워드 유저 우선 + 신청자 우선
    available_users.sort(key=lambda u: (not bool(getattr(u, "has_reward", False)), u.id != user_pk))

    if len(available_users) < TEAM_SIZE:
        # 매칭 인원 부족 시 대기열 등록
        WaitingUser.objects.update_or_create(
            user_id=user_pk,
            defaults={
                "skills": getattr(applicant, "skills", []),
                "main_role": getattr(applicant, "main_role", "unknown"),
                "sub_role": getattr(applicant, "sub_role", None),
                "keywords": getattr(applicant, "keywords", []),
                "has_reward": getattr(applicant, "has_reward", False),
            }
        )
        return Response({"message": "인원이 부족합니다. 대기열에 등록되었습니다."}, status=200)

    selected_users = available_users[:TEAM_SIZE]
    leader_pk = selected_users[0].id

    with transaction.atomic():
        new_team = Team.objects.create(
            name=None,
            leader_id=leader_pk,
            matching_type='auto',
            is_finalized=False
        )
        for idx, u in enumerate(selected_users):
            TeamMember.objects.create(
                team_id=new_team.id,
                user_id=u.id,
                role='leader' if idx == 0 else 'member'
            )

    return Response({"message": "팀 매칭 완료", "teamId": new_team.id}, status=201)

# backend/TeamMatching1/views.py

@csrf_exempt
@api_view(['GET'])
def get_matched_teams(request):
    teams = Team.objects.prefetch_related('teammember_set').all()
    data = []
    for t in teams:
        members = list(t.teammember_set.values_list('user_id', flat=True))
        data.append({
            "teamId": t.id,
            "members": members,
            "status": "confirmed" if t.is_finalized else "pending",
        })
    return Response(data, status=200)


@csrf_exempt
@api_view(['POST'])
def submit_feedback(request):
    team_id = request.data.get("teamId")
    raw_user = request.data.get("userId")
    agree = bool(request.data.get("agree", True))

    if team_id is None or raw_user is None:
        return Response({"message": "teamId, userId가 필요합니다."}, status=400)

    try:
        user_pk = int(str(raw_user).strip())
    except ValueError:
        return Response({"message": "userId는 정수여야 합니다."}, status=400)

    Feedback.objects.update_or_create(
        team_id=team_id, user_id=user_pk, defaults={"is_agree": agree}
    )

    members_qs = TeamMember.objects.filter(team_id=team_id)
    cnt_members = members_qs.count()
    fbs = list(Feedback.objects.filter(team_id=team_id))

    if len(fbs) < cnt_members:
        return Response({"message": "피드백 저장 완료"}, status=201)

    if all(f.is_agree for f in fbs):
        Team.objects.filter(id=team_id).update(is_finalized=True)
        return Response({"message": "모두 동의. 팀 확정 완료."}, status=200)

    # 일부 비동의 → 비동의자 제거 + 대기열 등록
    disagree_ids = [f.user_id for f in fbs if not f.is_agree]
    for uid in disagree_ids:
        TeamMember.objects.filter(team_id=team_id, user_id=uid).delete()
        WaitingUser.objects.update_or_create(
            user_id=str(uid),
            defaults={"skills": [], "main_role": "unknown", "sub_role": None,
                      "keywords": [], "has_reward": False}
        )

    Team.objects.filter(id=team_id).update(is_finalized=False)
    Feedback.objects.filter(team_id=team_id).delete()

    members = list(TeamMember.objects.filter(team_id=team_id).values_list('user_id', flat=True))
    return Response({
        "message": f"비동의 {len(disagree_ids)}명 제거 후 대기열 등록",
        "teamId": team_id,
        "members": members
    }, status=200)


@api_view(['GET'])
def get_waiting_users(request):
    waitings = WaitingUser.objects.all()
    result = []
    for w in waitings:
        result.append({
            "id": w.user_id,
            "mainRole": w.main_role,
            "subRole": w.sub_role,
            "keywords": w.keywords,
            "hasReward": w.has_reward,
        })
    return Response(result, status=200)


# ✅ 나머지 get_matched_teams, submit_feedback, get_waiting_users도 동일하게
# ✅ models에서 가져오고, User는 get_user_model()을 쓰도록 통일