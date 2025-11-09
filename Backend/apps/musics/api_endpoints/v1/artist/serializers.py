from rest_framework import serializers
from apps.musics.models import Artist, Album, Track, Genre


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name", "slug"]


# ---------------------- TRACK ----------------------
class ArtistTrackSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

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
            "genres",
            "is_published",
        )


class AlbumWithTracksSerializer(serializers.ModelSerializer):
    tracks = ArtistTrackSerializer(many=True, read_only=True)

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


from rest_framework import serializers

class ArtistListSerializer(serializers.ModelSerializer):
    albums_count = serializers.IntegerField(read_only=True)
    tracks_count = serializers.SerializerMethodField()  # <-- используем метод

    class Meta:
        model = Artist
        fields = (
            "id",
            "name",
            "slug",
            "avatar",
            "albums_count",
            "tracks_count",
            "created_at",
            "updated_at",
        )

    def get_tracks_count(self, obj):
        return Track.objects.filter(album__artist=obj).count()


class ArtistDetailSerializer(serializers.ModelSerializer):
    albums = AlbumWithTracksSerializer(many=True, read_only=True)
    tracks = ArtistTrackSerializer(many=True, read_only=True)
    tracks_count = serializers.SerializerMethodField()  # <-- метод

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
            "tracks",
            "tracks_count",
            "created_at",
            "updated_at",
        )

    def get_tracks(self, obj):
        tracks = Track.objects.filter(album__artist=obj)
        return ArtistTrackSerializer(tracks, many=True).data
    
    def get_tracks_count(self, obj):
        return Track.objects.filter(album__artist=obj).count()

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
