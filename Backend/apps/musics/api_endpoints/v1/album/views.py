from rest_framework import viewsets, permissions, filters
from apps.musics.models import Album
from .serializers import AlbumListSerializer, AlbumDetailSerializer, ALbumCreateUpdateSerializer
from rest_framework import generics

generics.RetrieveAPIView
generics.CreateAPIView

class AlbumViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "artist__name"]
    ordering_fields = ["release_date", "name"]

    def get_queryset(self):
        return (
            Album.objects.filter(is_published=True)
            .select_related("artist")
            .prefetch_related("tracks")
            .all()
        )

    def get_serializer_class(self):
        if self.action == "list":
            return AlbumListSerializer
        if self.action in ['create', 'update']:
            return ALbumCreateUpdateSerializer
        return AlbumDetailSerializer
