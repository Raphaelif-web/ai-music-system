-- Fix infinite recursion between playlists and playlist_tracks RLS policies

CREATE OR REPLACE FUNCTION private.playlist_visible_to_viewer(p_playlist_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.playlists p
    WHERE p.id = p_playlist_id
      AND (
        p.visibility = 'PUBLIC'
        OR p.user_id = auth.uid()
        OR p.visibility = 'UNLISTED'
      )
  );
$$;

REVOKE ALL ON FUNCTION private.playlist_visible_to_viewer(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.playlist_visible_to_viewer(UUID) TO authenticated, anon;

DROP POLICY IF EXISTS playlists_select_visible ON public.playlists;

CREATE POLICY playlists_select_visible
  ON public.playlists FOR SELECT
  USING (
    visibility = 'PUBLIC'
    OR user_id = auth.uid()
    OR visibility = 'UNLISTED'
    OR private.is_staff()
  );

DROP POLICY IF EXISTS playlist_tracks_select_visible ON public.playlist_tracks;

CREATE POLICY playlist_tracks_select_visible
  ON public.playlist_tracks FOR SELECT
  USING (
    private.playlist_visible_to_viewer(playlist_id)
    OR private.is_staff()
  );
