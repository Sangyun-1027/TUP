# backend/api/views.py
from datetime import datetime, timezone as py_timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated


class APIRootView(APIView):
    """
    API 루트: 사용 가능한 하위 네임스페이스 안내
    GET /api/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "message": "Welcome to TUP API",
            "namespaces": {
                "team_matching_v1": "/api/team1/",
                "team_matching_v2": "/api/team2/",
                "utils": {
                    "health": "/api/health/",
                    "server_time": "/api/server-time/",
                    "whoami": "/api/whoami/",
                },
            },
        })


class HealthCheckView(APIView):
    """
    헬스체크: 단순 상태 확인
    GET /api/health/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


class ServerTimeView(APIView):
    """
    서버 시간 반환 (UTC & 설정 타임존 없이 순수 UTC 표기)
    GET /api/server-time/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        now_utc = datetime.now(py_timezone.utc)
        return Response({
            "utc_iso": now_utc.isoformat(),
            "epoch_ms": int(now_utc.timestamp() * 1000),
        })


class WhoAmIView(APIView):
    """
    현재 로그인한 사용자 정보
    GET /api/whoami/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": getattr(user, "username", None),
            "email": getattr(user, "email", None),
            # UserProfile이 있는 경우 추가 정보도 내려주고 싶다면 아래 주석 해제해서 확장하세요.
            # "profile": {
            #     "id": getattr(getattr(user, "userprofile", None), "id", None),
            # }
        })
