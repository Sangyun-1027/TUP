from django.db import models

class WaitingUser(models.Model):
    user_id = models.IntegerField(unique=True)   # max_length 제거
    skills = models.JSONField(default=list)
    main_role = models.CharField(max_length=100)
    sub_role = models.CharField(max_length=100, blank=True, null=True)
    keywords = models.JSONField(default=list)
    has_reward = models.BooleanField(default=False)  # 🎖️ 리워드 우선 매칭

    def __str__(self):
        return str(self.user_id)


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