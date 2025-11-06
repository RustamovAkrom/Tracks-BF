from rest_framework import serializers
from apps.musics.models import Track, Like as TrackLike


class TrackListSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(read_only=True)
    album_name = serializers.CharField(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = [
            "id",
            "name",
            "slug",
            "artist_name",
            "album_name",
            "audio",
            "cover",
            "duration",
            "genre",
            "plays_count",
            "likes_count",
            "is_published",
            "is_liked",
        ]
    
    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if not user.is_authenticated:
            return False
        return TrackLike.objects.filter(user=user, track=obj).exists()


class TrackDetailSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(read_only=True)
    album_name = serializers.CharField(read_only=True)

    class Meta:
        model = Track
        fields = "__all__"


class TrackCreateUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Track
        fields = [
            "name",
            "artist",
            "album",
            "duration",
            "audio",
            "cover",
            "genre",
            "owner",
            "is_published",
        ]
