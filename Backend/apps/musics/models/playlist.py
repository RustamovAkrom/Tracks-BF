from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.db import models
from django.conf import settings
from apps.shared.models.base import NamedModel

from .track import Track
from apps.musics.managers.playlist import PlayListManager


class Playlist(NamedModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="playlists"
    )
    is_public = models.BooleanField(
        verbose_name=_("Is public?"), default=True, db_index=True
    )
    description = models.TextField(verbose_name=_("Description"), blank=True, null=True)
    tracks = models.ManyToManyField(
        Track, through="PlaylistTrack", related_name="in_playlists"
    )

    objects = PlayListManager()

    class Meta:
        db_table = "musics_playlists"
        indexes = [
            models.Index(fields=["owner", "is_public"]),
        ]
        verbose_name = _("Play List")
        verbose_name_plural = _("Play Lists")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} — {self.owner}"


class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(
        verbose_name=_("Order"), default=0, db_index=True
    )

    class Meta:
        db_table = "musics_playlist_tracks"
        unique_together = (("playlist", "track"),)
        ordering = ["order"]
        verbose_name = _("Play List Track")
        verbose_name_plural = _("Play List Tracks")

    def __str__(self):
        return self.track.name
