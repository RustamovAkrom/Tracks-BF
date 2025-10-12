# serializers.py
from rest_framework import serializers
from apps.users.models import User


class ProfileSerializer(serializers.ModelSerializer):
    """Расширенный профиль"""

    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "avatar")
        read_only_fields = ("email", "username")  # нельзя менять
