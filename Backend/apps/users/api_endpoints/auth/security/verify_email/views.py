from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from apps.users.models import User


class VerifyEmailAPIView(APIView):
    """
    Подтверждение email пользователя через токен.
    """

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        token = request.query_params.get("token")
        if not token:
            return Response(
                {"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            access_token = AccessToken(token)
        except TokenError:
            return Response(
                {"detail": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_id = access_token.get("user_id")
        if not user_id:
            return Response(
                {"detail": "Invalid token payload"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        # Активируем пользователя
        user.is_email_verified = True
        user.is_active = True
        user.save(update_fields=["is_email_verified"])

        return Response(
            {"detail": "Email verified successfully"}, status=status.HTTP_200_OK
        )


__all__ = ("VerifyEmailAPIView",)
