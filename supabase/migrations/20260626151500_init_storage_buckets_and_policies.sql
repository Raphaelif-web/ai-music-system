-- Mars Sound AI: storage buckets and object policies

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('audio-tracks', 'audio-tracks', TRUE, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp4']),
  ('track-covers', 'track-covers', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('user-avatars', 'user-avatars', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('playlist-covers', 'playlist-covers', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('waveforms', 'waveforms', TRUE, 5242880, ARRAY['image/png', 'image/svg+xml', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- audio-tracks (no broad SELECT — public URLs work for known paths)
CREATE POLICY storage_audio_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio-tracks' AND auth.uid() IS NOT NULL);

CREATE POLICY storage_audio_update
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'audio-tracks' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'audio-tracks' AND owner = auth.uid());

CREATE POLICY storage_audio_delete
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio-tracks' AND owner = auth.uid());

-- track-covers
CREATE POLICY storage_track_covers_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'track-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY storage_track_covers_update
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'track-covers' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'track-covers' AND owner = auth.uid());

CREATE POLICY storage_track_covers_delete
  ON storage.objects FOR DELETE
  USING (bucket_id = 'track-covers' AND owner = auth.uid());

-- user-avatars
CREATE POLICY storage_user_avatars_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY storage_user_avatars_update
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'user-avatars' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'user-avatars' AND owner = auth.uid());

CREATE POLICY storage_user_avatars_delete
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user-avatars' AND owner = auth.uid());

-- playlist-covers
CREATE POLICY storage_playlist_covers_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'playlist-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY storage_playlist_covers_update
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'playlist-covers' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'playlist-covers' AND owner = auth.uid());

CREATE POLICY storage_playlist_covers_delete
  ON storage.objects FOR DELETE
  USING (bucket_id = 'playlist-covers' AND owner = auth.uid());

-- waveforms
CREATE POLICY storage_waveforms_insert
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'waveforms' AND auth.uid() IS NOT NULL);

CREATE POLICY storage_waveforms_update
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'waveforms' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'waveforms' AND owner = auth.uid());

CREATE POLICY storage_waveforms_delete
  ON storage.objects FOR DELETE
  USING (bucket_id = 'waveforms' AND owner = auth.uid());
