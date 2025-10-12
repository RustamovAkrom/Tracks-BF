from rest_framework import viewsets, permissions, filters
from django.db.models import Count
from apps.musics.models import Artist
from .serializers import ArtistSerializer, ArtistListSerializer, ArtistDetailSerializer


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = (
        Artist.objects.all()
        .annotate(albums_count=Count("albums"))
        .order_by("-created_at")
        .prefetch_related("albums__tracks")
    )
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return ArtistListSerializer
        if self.action == "retrieve":
            return ArtistDetailSerializer
        return ArtistSerializer
