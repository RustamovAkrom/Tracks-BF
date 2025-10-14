# serializers.py
from rest_framework import serializers
from apps.users.models import User


class MeSerializer(serializers.ModelSerializer):
    """Минимальные данные о юзере"""

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "is_email_verified",
            "avatar",
        )
        read_only_fields = ("id", "username", "email", "is_email_verified", "avatar")
