from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from apps.musics.models import Playlist
from .serializers import (
    PlaylistListSerializer,
    PlaylistDetailSerializer,
    PlaylistCreateUpdateSerializer,
)
from .utils import optimize_playlist_queryset
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from .permisions import IsOwnerOrReadOnly


@extend_schema_view(
    list=extend_schema(
        tags=["Playlists"],
        summary="Get all playlists",
        description="Retrieve a list of all playlists.",
        responses={200: PlaylistListSerializer(many=True)},
    ),
    retrieve=extend_schema(
        tags=["Playlists"],
        summary="Get playlist details",
        description="Retrieve detailed information about a specific playlist by ID.",
        responses={200: PlaylistDetailSerializer},
    ),
    create=extend_schema(
        tags=["Playlists"],
        summary="Create a new playlist",
        description="Create and add a new playlist to the system.",
        request=PlaylistCreateUpdateSerializer,
        responses={201: PlaylistDetailSerializer},
    ),
    update=extend_schema(
        tags=["Playlists"],
        summary="Update playlist",
        description="Update an existing playlist by ID.",
        request=PlaylistCreateUpdateSerializer,
        responses={200: PlaylistDetailSerializer},
    ),
    partial_update=extend_schema(
        tags=["Playlists"],
        summary="Partially update playlist",
        description="Update some fields of an existing playlist by ID.",
        request=PlaylistCreateUpdateSerializer,
        responses={200: PlaylistDetailSerializer},
    ),
    destroy=extend_schema(
        tags=["Playlists"],
        summary="Delete playlist",
        description="Delete an existing playlist by ID.",
        responses={204: OpenApiResponse(description="Playlist successfully deleted")},
    ),
)
class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "owner__username"]
    ordering_fields = ["created_at", "updated_at", "name"]

    def get_queryset(self):
        qs = Playlist.objects.all().annotate(tracks_count=Count("playlisttrack"))
        return optimize_playlist_queryset(qs)

    def get_serializer_class(self):
        if self.action == "list":
            return PlaylistListSerializer
        if self.action == "retrieve":
            return PlaylistDetailSerializer
        if self.action in ["create", "update", "partial_update"]:
            return PlaylistCreateUpdateSerializer
        return PlaylistDetailSerializer

    @extend_schema(
        tags=["Playlists"],
        summary="Clear all tracks from a playlist",
        description="Remove all tracks from the specified playlist.",
        responses={200: OpenApiResponse(description="Tracks successfully cleared")},
    )
    @action(detail=True, methods=["post"])
    def clear_tracks(self, request, slug=None):
        playlist = self.get_object()
        playlist.playlisttrack_set.all().delete()
        return Response({"status": "tracks cleared"})
