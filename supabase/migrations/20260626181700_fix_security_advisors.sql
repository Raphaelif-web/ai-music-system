-- Security fixes from Supabase advisors

-- Fix mutable search_path on trigger helper
CREATE OR REPLACE FUNCTION private.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger-only function should not be callable via RPC
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Play count RPC: authenticated users only (not anon)
REVOKE ALL ON FUNCTION public.increment_play_count(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_play_count(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.increment_play_count(UUID) TO authenticated, service_role;

-- Public buckets: remove broad SELECT policies to prevent bucket listing
-- Direct public URLs still work for known object paths
DROP POLICY IF EXISTS storage_audio_select ON storage.objects;
DROP POLICY IF EXISTS storage_track_covers_select ON storage.objects;
DROP POLICY IF EXISTS storage_user_avatars_select ON storage.objects;
DROP POLICY IF EXISTS storage_playlist_covers_select ON storage.objects;
DROP POLICY IF EXISTS storage_waveforms_select ON storage.objects;
