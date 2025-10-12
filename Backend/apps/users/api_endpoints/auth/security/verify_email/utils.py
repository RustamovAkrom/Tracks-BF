from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from django.core.mail import send_mail


def send_verification_email(user):
    token = str(AccessToken.for_user(user))
    verification_link = f"{settings.FRONTEND_URL}/verify-email/?token={token}"

    send_mail(
        subject="Verify your email",
        message=f"Click this link to verify your email: {verification_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
