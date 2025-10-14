from rest_framework import serializers
from apps.musics.models import Artist, Album, Track


# ---------------------- TRACK ----------------------
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
    """Список артистов (для /artists/)"""

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
    """Детали артиста (включая альбомы и треки)"""

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
            "albums",
            "created_at",
            "updated_at",
        )


class ArtistCreateUpdateSerializer(serializers.ModelSerializer):
    """Создание и обновление артиста — без необходимости указывать owner"""

    class Meta:
        model = Artist
        fields = ("name", "bio", "avatar", "meta")
        read_only_fields = ("slug",)

    def create(self, validated_data):
        """Автоматически устанавливаем владельца артиста."""
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)
