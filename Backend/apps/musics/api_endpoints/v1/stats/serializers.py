from rest_framework import serializers
from apps.musics.models import Like, ListeningHistory


class LikeSerializer(serializers.ModelSerializer):
    track_name = serializers.CharField(source="track.name", read_only=True)

    class Meta:
        model = Like
        fields = ["id", "track", "track_name"]
        read_only_fields = ["id", "track_name"]


class ListeningHistorySerializer(serializers.ModelSerializer):
    track_name = serializers.CharField(source="track.name", read_only=True)

    class Meta:
        model = ListeningHistory
        fields = ["id", "track", "track_name", "listened_at", "duration"]
        read_only_fields = ["id", "track_name", "listened_at"]
