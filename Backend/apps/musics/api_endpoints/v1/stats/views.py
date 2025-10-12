from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view

from apps.musics.models import Like, ListeningHistory
from .serializers import LikeSerializer, ListeningHistorySerializer
from .utils import optimize_likes_queryset, optimize_history_queryset
from .pagination import SmallResultsSetPagination


@extend_schema_view(
    list=extend_schema(
        summary="Get all liked tracks",
        description="Retrieve a list of all tracks liked by the authenticated user.",
        responses={200: LikeSerializer(many=True)},
    ),
    create=extend_schema(
        summary="Like a track",
        description="Add a track to the authenticated user's liked list.",
        responses={201: LikeSerializer},
    ),
    destroy=extend_schema(
        summary="Unlike a track",
        description="Remove a track from the authenticated user's liked list.",
        responses={204: None},
    ),
)
class LikeViewSet(ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        qs = Like.objects.filter(user=self.request.user)
        return optimize_likes_queryset(qs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema_view(
    list=extend_schema(
        summary="Get listening history",
        description="Retrieve a list of all tracks the authenticated user has listened to (most recent first).",
        responses={200: ListeningHistorySerializer(many=True)},
    ),
    create=extend_schema(
        summary="Add listening record",
        description="Add a track to the authenticated user's listening history.",
        responses={201: ListeningHistorySerializer},
    ),
)
class ListeningHistoryViewSet(ModelViewSet):
    serializer_class = ListeningHistorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        qs = ListeningHistory.objects.filter(user=self.request.user).order_by(
            "-listened_at"
        )
        return optimize_history_queryset(qs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
