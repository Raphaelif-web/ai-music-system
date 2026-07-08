-- Mars Sound AI: Row Level Security and policies

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ── Users ──────────────────────────────────────────────
CREATE POLICY users_select_public_or_own
  ON public.users FOR SELECT
  USING (
    is_public = TRUE
    OR id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.follows
      WHERE follower_id = auth.uid() AND following_id = users.id
    )
    OR private.is_staff()
  );

CREATE POLICY users_insert_own
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY users_update_own
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY users_delete_own
  ON public.users FOR DELETE
  USING (id = auth.uid());

CREATE POLICY users_admin_select
  ON public.users FOR SELECT
  USING (private.is_staff());

CREATE POLICY users_admin_update
  ON public.users FOR UPDATE
  USING (private.is_staff())
  WITH CHECK (private.is_staff());

CREATE POLICY users_admin_delete
  ON public.users FOR DELETE
  USING (private.is_staff());

-- ── Tracks ─────────────────────────────────────────────
CREATE POLICY tracks_select_published_or_own
  ON public.tracks FOR SELECT
  USING (status = 'PUBLISHED' OR user_id = auth.uid());

CREATE POLICY tracks_insert_own
  ON public.tracks FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY tracks_update_own
  ON public.tracks FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY tracks_delete_own
  ON public.tracks FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY tracks_admin_select
  ON public.tracks FOR SELECT
  USING (private.is_staff());

CREATE POLICY tracks_admin_insert
  ON public.tracks FOR INSERT
  WITH CHECK (private.is_staff());

CREATE POLICY tracks_admin_update
  ON public.tracks FOR UPDATE
  USING (private.is_staff())
  WITH CHECK (private.is_staff());

CREATE POLICY tracks_admin_delete
  ON public.tracks FOR DELETE
  USING (private.is_staff());

-- ── Playlists ──────────────────────────────────────────
CREATE POLICY playlists_select_visible
  ON public.playlists FOR SELECT
  USING (
    visibility = 'PUBLIC'
    OR user_id = auth.uid()
    OR (
      visibility = 'UNLISTED'
      AND EXISTS (SELECT 1 FROM public.playlist_tracks pt WHERE pt.playlist_id = playlists.id)
    )
    OR private.is_staff()
  );

CREATE POLICY playlists_insert_own
  ON public.playlists FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY playlists_update_own
  ON public.playlists FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY playlists_delete_own
  ON public.playlists FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY playlists_admin_select
  ON public.playlists FOR SELECT
  USING (private.is_staff());

CREATE POLICY playlists_admin_update
  ON public.playlists FOR UPDATE
  USING (private.is_staff())
  WITH CHECK (private.is_staff());

CREATE POLICY playlists_admin_delete
  ON public.playlists FOR DELETE
  USING (private.is_staff());

-- ── Playlist Tracks ────────────────────────────────────
CREATE POLICY playlist_tracks_select_visible
  ON public.playlist_tracks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_tracks.playlist_id
        AND (
          p.visibility = 'PUBLIC'
          OR p.user_id = auth.uid()
          OR p.visibility = 'UNLISTED'
        )
    )
    OR private.is_staff()
  );

CREATE POLICY playlist_tracks_insert_owner
  ON public.playlist_tracks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id
        AND (p.user_id = auth.uid() OR (p.is_collaborative AND auth.uid() IS NOT NULL))
    )
  );

CREATE POLICY playlist_tracks_update_owner
  ON public.playlist_tracks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY playlist_tracks_delete_owner
  ON public.playlist_tracks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists p
      WHERE p.id = playlist_id
        AND (p.user_id = auth.uid() OR (p.is_collaborative AND auth.uid() IS NOT NULL))
    )
  );

-- ── Favorites ──────────────────────────────────────────
CREATE POLICY favorites_select_own
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY favorites_insert_own
  ON public.favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY favorites_delete_own
  ON public.favorites FOR DELETE
  USING (user_id = auth.uid());

-- ── Likes ──────────────────────────────────────────────
CREATE POLICY likes_select_own
  ON public.likes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY likes_insert_own
  ON public.likes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY likes_delete_own
  ON public.likes FOR DELETE
  USING (user_id = auth.uid());

-- ── Follows ────────────────────────────────────────────
CREATE POLICY follows_select_related
  ON public.follows FOR SELECT
  USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY follows_insert_own
  ON public.follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY follows_delete_own
  ON public.follows FOR DELETE
  USING (follower_id = auth.uid());

-- ── Comments ───────────────────────────────────────────
CREATE POLICY comments_select_on_published_tracks
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks t
      WHERE t.id = comments.track_id AND t.status = 'PUBLISHED'
    )
    OR private.is_staff()
  );

CREATE POLICY comments_insert_own
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY comments_update_own
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY comments_delete_own
  ON public.comments FOR DELETE
  USING (user_id = auth.uid() OR private.is_staff());

-- ── Play History ───────────────────────────────────────
CREATE POLICY play_history_select_own
  ON public.play_history FOR SELECT
  USING (user_id = auth.uid() OR private.is_staff());

CREATE POLICY play_history_insert_own
  ON public.play_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ── Notifications ──────────────────────────────────────
CREATE POLICY notifications_select_own
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR private.is_staff());

CREATE POLICY notifications_update_own
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY notifications_insert_restricted
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid() OR private.is_staff());

-- ── Genres (lookup) ────────────────────────────────────
CREATE POLICY genres_select_all
  ON public.genres FOR SELECT
  USING (TRUE);

CREATE POLICY genres_admin_insert
  ON public.genres FOR INSERT
  WITH CHECK (private.is_staff());

CREATE POLICY genres_admin_update
  ON public.genres FOR UPDATE
  USING (private.is_staff())
  WITH CHECK (private.is_staff());

CREATE POLICY genres_admin_delete
  ON public.genres FOR DELETE
  USING (private.is_staff());

-- ── Tags (lookup) ──────────────────────────────────────
CREATE POLICY tags_select_all
  ON public.tags FOR SELECT
  USING (TRUE);

CREATE POLICY tags_admin_insert
  ON public.tags FOR INSERT
  WITH CHECK (private.is_staff());

CREATE POLICY tags_admin_update
  ON public.tags FOR UPDATE
  USING (private.is_staff())
  WITH CHECK (private.is_staff());

CREATE POLICY tags_admin_delete
  ON public.tags FOR DELETE
  USING (private.is_staff());

-- ── Track Tags ─────────────────────────────────────────
CREATE POLICY track_tags_select_visible
  ON public.track_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks t
      WHERE t.id = track_tags.track_id
        AND (t.status = 'PUBLISHED' OR t.user_id = auth.uid())
    )
    OR private.is_staff()
  );

CREATE POLICY track_tags_insert_owner
  ON public.track_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tracks t
      WHERE t.id = track_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY track_tags_delete_owner
  ON public.track_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks t
      WHERE t.id = track_id AND t.user_id = auth.uid()
    )
    OR private.is_staff()
  );

-- ── Reports ────────────────────────────────────────────
CREATE POLICY reports_select_own_or_staff
  ON public.reports FOR SELECT
  USING (reporter_id = auth.uid() OR private.is_staff());

CREATE POLICY reports_insert_own
  ON public.reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY reports_update_staff
  ON public.reports FOR UPDATE
  USING (private.is_staff())
  WITH CHECK (private.is_staff());

CREATE POLICY reports_delete_staff
  ON public.reports FOR DELETE
  USING (private.is_staff());

-- ── Audit Logs ─────────────────────────────────────────
CREATE POLICY audit_logs_select_staff
  ON public.audit_logs FOR SELECT
  USING (private.is_staff());

CREATE POLICY audit_logs_insert_staff
  ON public.audit_logs FOR INSERT
  WITH CHECK (private.is_staff());

-- Grant table access to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
