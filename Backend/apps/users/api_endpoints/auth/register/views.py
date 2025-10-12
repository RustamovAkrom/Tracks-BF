from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema
from django.contrib.auth import get_user_model

from .serializers import UserRegisterSerializer

User = get_user_model()


@extend_schema(
    tags=["Authentication"],
    summary="User registration",
    description="Create a new user account by providing username, email and password.",
    request=UserRegisterSerializer,
    responses=UserRegisterSerializer,
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


__all__ = ("RegisterView",)
