from rest_framework import serializers
from apps.musics.models import Playlist, PlaylistTrack, Track


class TrackInPlaylistSerializer(serializers.ModelSerializer):
    """Упрощённый трек внутри плейлиста (для деталей)"""

    class Meta:
        model = Track
        fields = ["id", "name", "duration"]


class PlaylistTrackSerializer(serializers.ModelSerializer):
    """Трек в плейлисте с порядком"""

    track = TrackInPlaylistSerializer()

    class Meta:
        model = PlaylistTrack
        fields = ["id", "track", "order"]


class PlaylistListSerializer(serializers.ModelSerializer):
    """Для списка плейлистов (лёгкий вариант)"""

    owner = serializers.StringRelatedField()
    tracks_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Playlist
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_public",
            "owner",
            "tracks_count",
            "created_at",
            "updated_at",
        ]


class PlaylistDetailSerializer(serializers.ModelSerializer):
    """Для детальной информации о плейлисте"""

    tracks = PlaylistTrackSerializer(
        source="playlisttrack_set", many=True, read_only=True
    )
    owner = serializers.StringRelatedField()

    class Meta:
        model = Playlist
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_public",
            "owner",
            "tracks",
            "created_at",
            "updated_at",
        ]


class PlaylistCreateUpdateSerializer(serializers.ModelSerializer):
    """Создание/обновление с поддержкой треков"""

    track_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Playlist
        fields = ["id", "name", "description", "is_public", "track_ids"]

    def validate_track_ids(self, value):
        if not Track.objects.filter(id__in=value).count() == len(value):
            raise serializers.ValidationError("Некоторые треки не существуют.")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        if not user:
            raise serializers.ValidationError(
                "Только авторизованные пользователи могут создавать плейлисты."
            )

        track_ids = validated_data.pop("track_ids", [])
        playlist = Playlist.objects.create(owner=user, **validated_data)

        for i, track_id in enumerate(track_ids):
            PlaylistTrack.objects.create(playlist=playlist, track_id=track_id, order=i)

        return playlist

    def update(self, instance, validated_data):
        track_ids = validated_data.pop("track_ids", None)
        instance = super().update(instance, validated_data)

        if track_ids is not None:
            instance.playlisttrack_set.all().delete()
            for i, track_id in enumerate(track_ids):
                PlaylistTrack.objects.create(
                    playlist=instance, track_id=track_id, order=i
                )

        return instance
