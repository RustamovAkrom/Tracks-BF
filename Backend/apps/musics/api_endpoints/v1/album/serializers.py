from rest_framework import serializers
from apps.musics.models import Album, Track, Artist


class AlbumListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ("id", "name", "slug", "cover")


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ("id", "name", "slug", "owner", "bio", "avatar", "meta")


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
            "slug",
            "is_published",
        )


class AlbumDetailSerializer(serializers.ModelSerializer):
    tracks = TrackSerializer(many=True, read_only=True)
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Album
        fields = (
            "id",
            "name",
            "slug",
            "owner",
            "artist",
            "release_date",
            "cover",
            "is_published",
            "tracks",
            "created_at",
            "updated_at",
        )


class AlbumCreateUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания и обновления альбома."""

    class Meta:
        model = Album
        fields = ("name", "artist", "release_date", "cover", "is_published")
        read_only_fields = ("id", "slug")

    def create(self, validated_data):
        """Автоматически проставляем владельца альбома."""
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)

__all__ = [
    "AlbumListSerializer",
    "AlbumDetailSerializer",
    "AlbumCreateUpdateSerializer",
    "TrackSerializer",
    "ArtistSerializer",
]