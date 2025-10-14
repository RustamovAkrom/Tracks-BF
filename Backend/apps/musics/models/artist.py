from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.conf import settings
from django.db import models
from apps.shared.models.base import NamedModel


class Artist(NamedModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="artists"
    )
    bio = models.TextField(verbose_name=_("Bio"), blank=True, null=True)
    avatar = models.ImageField(
        verbose_name=_("Avatar"), upload_to="artists/avatars/", blank=True, null=True
    )
    meta = models.JSONField(
        verbose_name=_("Meta Dates"), default=dict, blank=True
    )  # доп. данные (соц.ссылки и т.п.)

    class Meta:
        db_table = "musics_artists"
        indexes = [
            models.Index(fields=["name"]),
        ]
        verbose_name = _("Artist")
        verbose_name_plural = _("Artists")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Artist.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
