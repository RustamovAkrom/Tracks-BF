def optimize_playlist_queryset(queryset):
    """
    Оптимизация выборки:
    - prefetch_related для PlaylistTrack + Track
    - select_related для owner
    """
    return queryset.select_related("owner").prefetch_related("tracks")
