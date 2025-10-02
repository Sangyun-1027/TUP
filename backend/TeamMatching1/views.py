from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from dbapp.models import WaitingUser, Team, TeamMember, Feedback, User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json



# 팀 정원(기존 TM1 로직 기준 4명)
TEAM_SIZE = 4

@csrf_exempt  # ✅ 없으면 CSRF 오류
@api_view(['POST'])
def save_user_input(request):
    d = request.data
    user_id = str(d.get("userId", "")).strip()
    if not user_id:
        return Response({"message": "userId가 필요합니다."}, status=400)

    # User 테이블에만 저장
    User.objects.update_or_create(
        id=user_id,
        defaults={
            "name": d.get("name", ""),
            "skills": d.get("skills", []) or [],
            "main_role": d.get("mainRole") or "unknown",
            "sub_role": d.get("subRole"),
            "keywords": d.get("keywords", []) or [],
            "rating": d.get("rating", 0),
            "participation": d.get("participation", 0),
            "has_reward": bool(d.get("hasReward", False)),
        },
    )

    return Response({"message": "사용자 정보 저장 완료 (User 테이블에만)"}, status=200)

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

    # 현재 DB에 존재하는 유저인지 확인
    try:
        applicant = User.objects.get(id=user_pk)
    except User.DoesNotExist:
        return Response({"message": "해당 유저를 찾을 수 없습니다."}, status=404)

    # 아직 팀에 소속되지 않은 모든 유저
    available_users = list(User.objects.exclude(
        id__in=TeamMember.objects.values_list("user_id", flat=True)
    ))

    # 리워드 유저 우선 + 신청자는 무조건 포함
    available_users.sort(key=lambda u: (not bool(getattr(u, "has_reward", False)), u.id != user_pk))

    created_team_ids = []

    with transaction.atomic():
        # 4명씩 팀을 계속 생성
        while len(available_users) >= TEAM_SIZE:
            selected_users = available_users[:TEAM_SIZE]
            available_users = available_users[TEAM_SIZE:]

            leader_pk = selected_users[0].id

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
            created_team_ids.append(new_team.id)

        # 만약 인원이 4명 미만 남으면 WaitingUser에 넣기
        for u in available_users:
            WaitingUser.objects.update_or_create(
                user_id=u.id,
                defaults={
                    "skills": u.skills,
                    "main_role": u.main_role,
                    "sub_role": u.sub_role,
                    "keywords": u.keywords,
                    "has_reward": u.has_reward,
                }
            )

    if created_team_ids:
        return Response({"message": f"{len(created_team_ids)}개 팀 매칭 완료", "teamIds": created_team_ids}, status=201)
    else:
        return Response({"message": "인원이 부족합니다. 대기열에 등록되었습니다."}, status=200)


@csrf_exempt
@api_view(['GET'])
def get_matched_teams(request):
    teams = Team.objects.prefetch_related('teammember_set').all()
    return Response([{
        "teamId": t.id,
        "members": [tm.user_id for tm in t.teammember_set.all()],
        "status": "confirmed" if t.is_finalized else "pending",
    } for t in teams], status=200)
@csrf_exempt
@api_view(['POST'])
def submit_feedback(request):
    team_id = request.data.get("teamId")
    raw = request.data.get("userId")
    agree = bool(request.data.get("agree", True))
    if team_id is None or raw is None:
        return Response({"message":"teamId, userId가 필요합니다."}, status=400)
    try:
        user_pk = int(str(raw).strip())
    except ValueError:
        return Response({"message":"userId는 정수여야 합니다."}, status=400)

    # 피드백 저장/갱신
    Feedback.objects.update_or_create(
        team_id=team_id, user_id=user_pk, defaults={"is_agree": agree}
    )

    # 현재 팀 구성원 수와 피드백 수 비교
    members_qs = TeamMember.objects.filter(team_id=team_id)
    cnt_members = members_qs.count()
    fbs = list(Feedback.objects.filter(team_id=team_id))
    if len(fbs) < cnt_members:
        return Response({"message":"피드백 저장 완료"}, status=201)

    # 전원 제출됨
    if all(f.is_agree for f in fbs):
        Team.objects.filter(id=team_id).update(is_finalized=True)
        return Response({"message":"모두 동의. 팀 확정 완료."}, status=200)

    # 일부 비동의 → 비동의자만 팀 이탈 + 대기열 복귀 + 결원 자동보충(4명까지)
    disagree_ids = [f.user_id for f in fbs if not f.is_agree]

    # 가능한 경우 api.UserProfile에서 WaitingUser 기본값 복구
    def _rehydrate_defaults(uid: int):
        try:
            from api.models import UserProfile
            up = UserProfile.objects.get(user__id=uid)
            return {
                "skills": up.skills or [],
                "main_role": getattr(up, "mainRole", None) or "unknown",
                "sub_role": getattr(up, "subRole", None),
                "keywords": up.keywords or [],
                "has_reward": bool(getattr(up, "has_reward", False)),
            }
        except Exception:
            return {
                "skills": [],
                "main_role": "unknown",
                "sub_role": None,
                "keywords": [],
                "has_reward": False,
            }

    with transaction.atomic():
        team = Team.objects.select_for_update().get(id=team_id)

        # 1) 비동의자만 팀에서 제거 + 대기열 복귀
        removed_leader = False
        for uid in disagree_ids:
            # 팀원 제거
            TeamMember.objects.filter(team_id=team_id, user_id=uid).delete()
            if team.leader_id == uid:
                removed_leader = True
            # 대기열 복귀(정보 복구)
            WaitingUser.objects.update_or_create(
                user_id=str(uid),
                defaults=_rehydrate_defaults(uid),
            )

        # 2) 남은 팀원이 없으면 팀 해체
        remaining = list(TeamMember.objects.filter(team_id=team_id).order_by('user_id'))
        if not remaining:
            Feedback.objects.filter(team_id=team_id).delete()
            Team.objects.filter(id=team_id).delete()
            return Response({"message": f"모두 비동의로 팀 해체. 비동의 {len(disagree_ids)}명 대기열 복귀 완료."}, status=200)

        # 3) 리더가 나갔으면 새 리더 선임(남은 팀원 중 user_id가 가장 작은 사람) -> db 무결성 때문에 하나 무조건 정해야댐
        if removed_leader:
            new_leader_id = remaining[0].user_id
            Team.objects.filter(id=team_id).update(leader_id=new_leader_id)

        # 4) 결원 자동 보충 (정원 TEAM_SIZE까지)
        current_cnt = len(remaining)
        need = max(0, TEAM_SIZE - current_cnt)
        if need > 0:
            # 방금 팀에서 나간 비동의자들은 같은 라운드에서 재합류하지 않도록 제외
            exclude_ids = set(str(x) for x in disagree_ids)
            waiting = list(WaitingUser.objects.exclude(user_id__in=exclude_ids))
            # 리워드 우선, 그다음 user_id 오름차순
            waiting.sort(key=lambda w: (not bool(w.has_reward), int(w.user_id) if str(w.user_id).isdigit() else 1_000_000))
            take = waiting[:need]
            for w in take:
                # 중복 방지
                if not TeamMember.objects.filter(team_id=team_id, user_id=int(w.user_id)).exists():
                    TeamMember.objects.create(team_id=team_id, user_id=int(w.user_id), role='member')
                    w.delete()
            # 인원 재확인
            current_cnt = TeamMember.objects.filter(team_id=team_id).count()

        # 팀은 아직 확정 아님(재동의 필요 가능성) → 기존 피드백은 리셋
        Team.objects.filter(id=team_id).update(is_finalized=False)
        Feedback.objects.filter(team_id=team_id).delete()

        # 현재 멤버 목록 반환
        members = list(TeamMember.objects.filter(team_id=team_id).values_list('user_id', flat=True))
        return Response({
            "message": f"비동의 {len(disagree_ids)}명 팀 이탈 및 대기열 복귀. 현재 팀원 {current_cnt}명, 정원 {TEAM_SIZE}명.",
            "teamId": team_id,
            "members": members
        }, status=200)
# ✅ 추가할 코드 (TeamMatching1/views.py 맨 아래에 넣어줘)


@api_view(['GET'])
def get_waiting_users(request):
    users = User.objects.all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "mainRole": u.main_role,
            "subRole": u.sub_role,
            "keywords": u.keywords,
            "rating": u.rating,
            "participation": u.participation,
        })
    return Response(result)