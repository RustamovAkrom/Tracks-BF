# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.users.models import UserToken
from .serializers import ResetPasswordSerializer

User = get_user_model()


class ResetPasswordAPIView(APIView):
    """
    Сброс пароля через одноразовый токен из email.
    """

    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not token or not new_password:
            return Response(
                {"detail": "Token and new_password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_token = UserToken.objects.get(token=token, token_type="reset")
        except UserToken.DoesNotExist:
            return Response(
                {"detail": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # проверяем срок жизни токена
        if user_token.is_expired():
            return Response(
                {"detail": "Token expired or already used"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = user_token.user
        user.set_password(new_password)
        user.save()

        # помечаем токен как использованный
        user_token.is_used = True
        user_token.save()

        return Response(
            {"detail": "Password has been reset successfully"},
            status=status.HTTP_200_OK,
        )
