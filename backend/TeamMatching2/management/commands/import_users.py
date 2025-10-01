from django.core.management.base import BaseCommand
from django.db import connection
from django.contrib.auth.models import User
from TeamMatching2.models import UserProfile

class Command(BaseCommand):
    help = "Import custom users table into Django's auth_user and UserProfile"

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, name, main_role, sub_role, skills, keywords, rating, participation, has_reward FROM users;")
            rows = cursor.fetchall()

            for row in rows:
                user_id, name, main_role, sub_role, skills, keywords, rating, participation, has_reward = row

                # Django 기본 User 생성 (username = name)
                user, created = User.objects.get_or_create(
                    username=name,
                    defaults={"email": f"{name}@example.com"}  # 이메일 없으니 임시 생성
                )

                # UserProfile 연결
                profile, _ = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "mainRole": main_role or "",
                        "subRole": sub_role or "",
                        "skills": skills or [],
                        "keywords": keywords or [],
                        "rating": rating or 0.0,
                        "participation": participation or 0,
                        "has_reward": bool(has_reward),
                    }
                )

        self.stdout.write(self.style.SUCCESS("Users imported successfully!"))