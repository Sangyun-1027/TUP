from django.db import models

class WaitingUser(models.Model):
    user_id = models.IntegerField(max_length=100, unique=True)
    skills = models.JSONField(default=list)
    main_role = models.CharField(max_length=100)
    sub_role = models.CharField(max_length=100, blank=True, null=True)
    keywords = models.JSONField(default=list)
    has_reward = models.BooleanField(default=False)  # 🎖️ 리워드 우선 매칭

    def __str__(self):
        return self.user_id


class Team(models.Model):
    status = models.CharField(max_length=20, default='pending')  # 'pending', 'confirmed'
    created_at = models.DateTimeField(auto_now_add=True)


class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user_id} - Team {self.team_id}"


class Feedback(models.Model):
    user_id = models.CharField(max_length=100)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    agree = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user_id} ({'👍' if self.agree else '👎'})"

# dbapp/models.py

class User(models.Model):
    id = models.IntegerField(primary_key=True)  # 기존 users 테이블의 PK
    name = models.CharField(max_length=100)
    main_role = models.CharField(max_length=100)
    sub_role = models.CharField(max_length=100, blank=True, null=True)
    keywords = models.JSONField(default=list)
    rating = models.FloatField(blank=True, null=True)
    participation = models.IntegerField(default=0)

    class Meta:
        db_table = 'users'  # 기존 MySQL 테이블 이름 지정
        managed = False     # Django가 이 테이블을 관리(migrate)하지 않음

    def __str__(self):
        return self.name

