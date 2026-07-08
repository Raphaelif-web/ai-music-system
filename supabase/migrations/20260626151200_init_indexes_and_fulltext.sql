-- Mars Sound AI: composite and full-text search indexes

CREATE INDEX idx_tracks_user_status ON public.tracks (user_id, status);
CREATE INDEX idx_tracks_genre_status ON public.tracks (genre_id, status);
CREATE INDEX idx_tracks_play_count_created ON public.tracks (play_count DESC, created_at DESC);

CREATE INDEX idx_playlists_user_visibility ON public.playlists (user_id, visibility);
CREATE INDEX idx_play_history_user_date ON public.play_history (user_id, played_at DESC);
CREATE INDEX idx_notifications_user_read ON public.notifications (user_id, is_read, created_at DESC);

CREATE INDEX idx_tracks_fulltext ON public.tracks
  USING GIN (to_tsvector('english', title || ' ' || artist || ' ' || COALESCE(album, '')));

CREATE INDEX idx_playlists_fulltext ON public.playlists
  USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX idx_users_fulltext ON public.users
  USING GIN (to_tsvector('english', name || ' ' || username || ' ' || COALESCE(bio, '')));
