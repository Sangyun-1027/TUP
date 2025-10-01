from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skills = models.JSONField(default=list)
    keywords = models.JSONField(default=list)
    mainRole = models.CharField(max_length=50, default='', blank=True)
    subRole = models.CharField(max_length=50, blank=True)
    rating = models.FloatField(default=0.0)
    participation = models.IntegerField(default=0)
    is_leader = models.BooleanField(default=False)
    has_reward = models.BooleanField(default=False)

    
    def __str__(self):
        return self.user.username
    
    
class Team(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    leader = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='led_teams')
    tech = models.JSONField(default=list)
    looking_for = models.JSONField(default=list)
    max_members = models.IntegerField()
    members = models.ManyToManyField(UserProfile, related_name='joined_teams', blank=True)
    status = models.CharField(max_length=20, default='open')

    category = models.CharField(max_length=100, blank=True) # 공모전 분야
    intro = models.CharField(max_length=255, blank=True)  # 한 줄 소개

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
