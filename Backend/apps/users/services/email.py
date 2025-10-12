from django.core.mail import send_mail
from django.conf import settings


def send_verification_email(user, uid, token):
    link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{str(token)}/"
    send_mail(
        "Verify your email",
        f"Click to verify your email: {link}",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )


def send_password_reset_email(user, token):
    link = f"{settings.FRONTEND_URL}/reset-password/?token={str(token)}/"
    send_mail(
        "Reset your password",
        f"Click to reset your password: {link}",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )
