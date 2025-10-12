from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.db import models
from django.db.models import F
from django.conf import settings
from django.core.validators import MinValueValidator
from apps.shared.models.base import NamedModel
from .artist import Artist
from .album import Album
from apps.musics.managers.track import TrackManager
from django.core.cache import cache


class Track(NamedModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tracks"
    )
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="tracks")
    album = models.ForeignKey(
        Album, on_delete=models.SET_NULL, null=True, blank=True, related_name="tracks"
    )
    duration = models.PositiveIntegerField(
        verbose_name=_("Duration"),
        help_text="seconds",
        validators=[MinValueValidator(1)],
    )
    audio = models.FileField(verbose_name=_("Audio"), upload_to="tracks/audio/")
    cover = models.ImageField(
        verbose_name=_("Cover"), upload_to="tracks/covers/", blank=True, null=True
    )
    genre = models.CharField(
        verbose_name=_("Genre"), max_length=100, db_index=True, blank=True
    )
    plays_count = models.BigIntegerField(
        verbose_name=_("Plays Count"), default=0, db_index=True
    )
    likes_count = models.BigIntegerField(
        verbose_name=_("Likes count"), default=0, db_index=True
    )
    is_published = models.BooleanField(
        verbose_name=_("Is published"), default=True, db_index=True
    )

    objects = TrackManager()

    class Meta:
        db_table = "musics_tracks"
        indexes = [
            models.Index(fields=["genre"]),
            models.Index(fields=["-plays_count", "is_published"]),
            models.Index(fields=["-likes_count", "is_published"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "artist"], name="unique_track_per_artist"
            )
        ]

    def __str__(self):
        return f"{self.name} — {self.artist.name}"

    # --- Atomарные методы ---
    def increment_plays(self, delta=1):
        self.__class__.objects.filter(pk=self.pk).update(
            plays_count=F("plays_count") + delta
        )
        self.refresh_from_db(fields=["plays_count"])
        return self.plays_count

    def increment_likes(self, delta=1):
        self.__class__.objects.filter(pk=self.pk).update(
            likes_count=F("likes_count") + delta
        )
        self.refresh_from_db(fields=["likes_count"])
        return self.likes_count

    # --- Bulk методы ---
    @classmethod
    def bulk_increment_plays(cls, track_ids, delta=1):
        cls.objects.filter(pk__in=track_ids).update(
            plays_count=F("plays_count") + delta
        )

    @classmethod
    def bulk_increment_likes(cls, track_ids, delta=1):
        cls.objects.filter(pk__in=track_ids).update(
            likes_count=F("likes_count") + delta
        )

    # --- Кэш топ треков ---
    @classmethod
    def get_top_tracks(cls, limit=10):
        key = f"top_tracks_{limit}"
        top_tracks = cache.get(key)
        if top_tracks is None:
            top_tracks = list(
                cls.objects.filter(is_published=True).order_by("-plays_count")[:limit]
            )
            cache.set(key, top_tracks, timeout=60)
        return top_tracks

    # --- Свойства для сериализатора ---
    @property
    def artist_name(self):
        return self.artist.name if self.artist else None

    @property
    def album_name(self):
        return self.album.name if self.album else None

    # --- Уникальный slug ---
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Track.objects.filter(slug=slug, artist=self.artist).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
