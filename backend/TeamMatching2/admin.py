from django.contrib import admin
from .models import UserProfile, Team, Application, Invitation


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'mainRole', 'subRole', 'rating', 'participation', 'is_leader', 'has_reward')
    search_fields = ('user__username', 'mainRole', 'subRole')
    list_filter = ('is_leader', 'has_reward')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'leader', 'max_members', 'status', 'category')
    search_fields = ('name', 'leader__user__username')
    list_filter = ('status', 'category')
    filter_horizontal = ('members',)  # ManyToManyField 관리하기 좋음


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'user', 'status', 'created_at')
    search_fields = ('team__name', 'user__user__username')
    list_filter = ('status', 'created_at')


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'user', 'status', 'created_at')
    search_fields = ('team__name', 'user__user__username')
    list_filter = ('status', 'created_at')