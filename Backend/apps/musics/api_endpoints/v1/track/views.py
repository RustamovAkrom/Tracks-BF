from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from apps.musics.models import Track
from .serializers import (
    TrackListSerializer,
    TrackDetailSerializer,
    TrackCreateUpdateSerializer,
)
from apps.shared.paginations.base import SmallResultsSetPagination
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiResponse
from apps.shared.permissions.base import IsOwnerOrReadOnly


@extend_schema_view(
    list=extend_schema(
        tags=["Tracks"],
        summary="Get all tracks",
        description="Retrieve a list of all published tracks.",
        responses={200: TrackListSerializer(many=True)},
    ),
    retrieve=extend_schema(
        tags=["Tracks"],
        summary="Get track details",
        description="Retrieve detailed information about a specific track by ID.",
        responses={200: TrackDetailSerializer},
    ),
    create=extend_schema(
        tags=["Tracks"],
        summary="Create a new track",
        description="Create and add a new track to the system.",
        request=TrackCreateUpdateSerializer,
        responses={201: TrackDetailSerializer},
    ),
    update=extend_schema(
        tags=["Tracks"],
        summary="Update track",
        description="Update an existing track by ID.",
        request=TrackCreateUpdateSerializer,
        responses={200: TrackDetailSerializer},
    ),
    partial_update=extend_schema(
        tags=["Tracks"],
        summary="Partially update track",
        description="Update some fields of an existing track by ID.",
        request=TrackCreateUpdateSerializer,
        responses={200: TrackDetailSerializer},
    ),
    destroy=extend_schema(
        tags=["Tracks"],
        summary="Delete track",
        description="Delete an existing track by ID.",
        responses={204: OpenApiResponse(description="Track successfully deleted")},
    ),
)
class TrackViewSet(ModelViewSet):
    queryset = Track.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["genre", "artist", "album"]
    search_fields = ["name", "artist__name", "album__name"]
    ordering_fields = ["plays_count", "likes_count", "duration"]
    ordering = ["-plays_count"]
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        qs = Track.objects.filter(is_published=True)
        return qs.select_related("artist", "album").order_by("-plays_count")

    def get_serializer_class(self):
        if self.action == "list":
            return TrackListSerializer
        if self.action == "retrieve":
            return TrackDetailSerializer
        if self.action in ["create", "update", "partial_update"]:
            return TrackCreateUpdateSerializer
        return TrackDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


__all__ = ["TrackViewSet"]
