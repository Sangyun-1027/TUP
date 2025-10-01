from rest_framework import serializers
from TeamMatching2.models import UserProfile, Team, Application, Invitation
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'skills', 'keywords', 'mainRole', 'subRole',
            'rating', 'participation', 'is_leader', 'has_reward', 'name'
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'user', 'status']


class InvitationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Invitation
        fields = ['id', 'user', 'status']


class TeamSerializer(serializers.ModelSerializer):
    leader = UserProfileSerializer(read_only=True)
    members = UserProfileSerializer(many=True, read_only=True)
    applications = ApplicationSerializer(many=True, read_only=True, source='application_set')
    invitations = InvitationSerializer(many=True, read_only=True, source='invitation_set')

    class Meta:
        model = Team
        fields = [
            'id', 'name', 'leader', 'tech', 'looking_for', 'max_members',
            'status', 'members', 'applications', 'invitations'
        ]
