from django.contrib import admin
from .models import WaitingUser, Team, TeamMember, Feedback

@admin.register(WaitingUser)
class WaitingUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'main_role', 'sub_role', 'has_reward')
    search_fields = ('user_id', 'main_role', 'sub_role')
    list_filter = ('has_reward',)

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'created_at')
    list_filter = ('status', 'created_at')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'team')
    search_fields = ('user_id',)
    list_filter = ('team',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'team', 'agree')
    list_filter = ('agree', 'team')
    search_fields = ('user_id',)