def optimize_track_queryset(qs):
    # select_related чтобы избежать N+1 на artist и album
    return qs.select_related("artist", "album").order_by("-plays_count")
