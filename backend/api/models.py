from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skills = models.JSONField(default=list)
    keywords = models.JSONField(default=list)
    main_role = models.CharField(max_length=50)
    sub_role = models.CharField(max_length=50, blank=True)
    rating = models.FloatField(default=0.0)
    participation = models.IntegerField(default=0)
    is_leader = models.BooleanField(default=False)
    has_reward = models.BooleanField(default=False)

    
    def __str__(self):
        return self.user.username
    
    
class Team(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    leader_id= models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='led_teams')
    tech = models.JSONField(default=list)  # ex: ["Django", "AWS"]
    looking_for = models.JSONField(default=list)  # ex: ["디자이너", "기획자"]
    max_members = models.IntegerField()
    members = models.ManyToManyField(UserProfile, related_name='joined_teams', blank=True)
    status = models.CharField(max_length=20, default='open')  # open / closed

    def __str__(self):
        return self.name


class Application(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Invitation(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

class TeamPin(models.Model):
    team = models.ForeignKey("Team", on_delete=models.CASCADE, related_name="pins")
    user = models.ForeignKey("UserProfile", on_delete=models.CASCADE)  # 핀을 사용한 팀장
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)  # 기본 24시간
        super().save(*args, **kwargs)

    def is_active(self):
        return self.active and self.expires_at > timezone.now()
    

class Ticket(models.Model):
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)  # 'pin', 'priority' 등
    used = models.BooleanField(default=False)
    redeemed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)