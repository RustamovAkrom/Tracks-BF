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
from .utils import optimize_track_queryset
from .pagination import SmallResultsSetPagination
from drf_spectacular.utils import extend_schema, extend_schema_view
from .permissions import IsOwnerOrReadOnly


@extend_schema_view(
    list=extend_schema(summary="Get all tracks"),
    retrieve=extend_schema(summary="Get track details"),
    create=extend_schema(summary="Create a new track"),
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
        return optimize_track_queryset(Track.objects.filter(is_published=True))

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
