from rest_framework.serializers import ModelSerializer
from apps.musics.models import Album, Track, Artist


class AlbumListSerializer(ModelSerializer):
    class Meta:
        model = Album
        fields = ("id", "name", "slug", "cover")


class ArtistSerializer(ModelSerializer):
    class Meta:
        model = Artist
        fields = ("id", "name", "slug", "bio", "avatar", "meta")


class TrackSerializer(ModelSerializer):
    
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


class AlbumDetailSerializer(ModelSerializer):
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

class ALbumCreateUpdateSerializer(ModelSerializer):
    class Meta:
        model = Album
        fields = ("name", "owner", "artist", "release_date", "cover", "is_published")
