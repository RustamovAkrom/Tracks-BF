from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.db import models
from django.conf import settings
from apps.shared.models.base import NamedModel
from .artist import Artist


class Album(NamedModel):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="albums")
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="albums")
    release_date = models.DateField(
        verbose_name=_("Release date"), blank=True, null=True, db_index=True
    )
    cover = models.ImageField(
        verbose_name=_("Cover"), upload_to="albums/covers/", blank=True, null=True
    )
    is_published = models.BooleanField(verbose_name=_("Is published"), default=False)

    class Meta:
        db_table = "musics_albums"
        indexes = [
            models.Index(fields=["release_date"]),
            models.Index(fields=["artist"]),
        ]
        verbose_name = _("Album")
        verbose_name_plural = _("Albums")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} — {self.artist.name}"
