# apps/users/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from django.core.mail import send_mail
from django.urls import reverse
from apps.users.models import User
from django.conf import settings

class SendVerifyEmailAPIView(APIView):
    """
    Отправка письма с подтверждением email.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user: User = request.user

        if user.is_email_verified:
            return Response({"detail": "Email уже подтверждён"}, status=status.HTTP_400_BAD_REQUEST)

        # Создаём токен
        token = str(AccessToken.for_user(user))

        # Ссылка на фронтенд с токеном
        frontend_url = settings.FRONTEND_URL + "/verify-email"
        verify_link = f"{frontend_url}/{token}"

        # Отправка письма
        send_mail(
            subject="Подтвердите ваш email",
            message=f"Нажмите на ссылку для подтверждения email: {verify_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"detail": "Ссылка для подтверждения отправлена на вашу почту"}, status=status.HTTP_200_OK)
__all__ = ("SendVerifyEmailAPIView",)
