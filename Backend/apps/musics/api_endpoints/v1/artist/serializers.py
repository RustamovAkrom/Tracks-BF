from rest_framework import serializers
from apps.musics.models import Artist, Album, Track


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = (
            "id",
            "name",
            "duration",
            "audio",
            "cover",
            "plays_count",
            "likes_count",
            "genre",
            "is_published",
        )


class AlbumWithTracksSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = (
            "id",
            "name",
            "slug",
            "cover",
            "release_date",
            "is_published",
            "tracks",
        )


class ArtistListSerializer(serializers.ModelSerializer):
    """Для списка артистов"""

    albums_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Artist
        fields = (
            "id",
            "name",
            "slug",
            "avatar",
            "albums_count",
            "created_at",
            "updated_at",
        )


class ArtistDetailSerializer(serializers.ModelSerializer):
    albums = AlbumWithTracksSerializer(many=True, read_only=True)

    class Meta:
        model = Artist
        fields = (
            "id",
            "name",
            "slug",
            "owner",
            "bio",
            "avatar",
            "meta",
            "albums",  # 👈 здесь альбомы с треками
            "created_at",
            "updated_at",
        )


class ArtistSerializer(serializers.ModelSerializer):
    """CRUD (создание/обновление)"""

    class Meta:
        model = Artist
        fields = ("name", "slug", "bio", "avatar", "meta")
