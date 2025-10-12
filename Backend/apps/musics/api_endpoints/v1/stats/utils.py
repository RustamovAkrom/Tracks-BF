def optimize_likes_queryset(queryset):
    """Оптимизация выборки лайков"""
    return queryset.select_related("track", "user").order_by("-created_at")


def optimize_history_queryset(queryset):
    """Оптимизация выборки истории"""
    return queryset.select_related("track", "user")


def optimize_track_queryset(qs):
    return (
        qs.select_related("artist", "album")
        .order_by("-plays_count")
        .order_by("-created_at")
    )
