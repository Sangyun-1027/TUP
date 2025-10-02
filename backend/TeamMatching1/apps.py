from django.apps import AppConfig

class TeamMatching1Config(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    # 패키지 폴더명이 'TeamMatching1' 이므로 아래 name은 정확한 파이썬 모듈 경로여야 합니다.
    name = "TeamMatching1"
    # 마이그레이션/모델에서 참조한 라벨: team_matching1
    label = "team_matching1"
    verbose_name = "Team Matching 1"
