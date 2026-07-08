-- Mars Sound AI: database functions, triggers, and auth profile bootstrap

-- Helper: admin/moderator check (private schema)
CREATE OR REPLACE FUNCTION private.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MODERATOR')
  );
$$;

REVOKE ALL ON FUNCTION private.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_staff() TO authenticated, service_role;

-- updated_at trigger function
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

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION private.update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION private.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION private.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION private.update_updated_at_column();

-- Play count increment (private + public RPC wrapper)
CREATE OR REPLACE FUNCTION private.increment_play_count(track_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.tracks
  SET play_count = play_count + 1
  WHERE id = track_id_param
    AND status = 'PUBLISHED';
END;
$$;

-- Play count increment via play_history trigger (no public SECURITY DEFINER RPC)
CREATE OR REPLACE FUNCTION private.increment_play_count_on_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM private.increment_play_count(NEW.track_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER play_history_increment_count
  AFTER INSERT ON public.play_history
  FOR EACH ROW
  EXECUTE FUNCTION private.increment_play_count_on_history();

REVOKE ALL ON FUNCTION private.increment_play_count(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.increment_play_count(UUID) TO service_role;

-- Like count trigger
CREATE OR REPLACE FUNCTION private.update_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tracks
    SET like_count = like_count + 1
    WHERE id = NEW.track_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tracks
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.track_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER track_like_count_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION private.update_like_count();

-- Follower count trigger
CREATE OR REPLACE FUNCTION private.update_follower_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users SET total_followers = total_followers + 1 WHERE id = NEW.following_id;
    UPDATE public.users SET total_following = total_following + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users SET total_followers = GREATEST(total_followers - 1, 0) WHERE id = OLD.following_id;
    UPDATE public.users SET total_following = GREATEST(total_following - 1, 0) WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER user_follow_count_trigger
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION private.update_follower_count();

-- User track count trigger
CREATE OR REPLACE FUNCTION private.update_user_track_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users SET total_tracks = total_tracks + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users SET total_tracks = GREATEST(total_tracks - 1, 0) WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER user_track_count_trigger
  AFTER INSERT OR DELETE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION private.update_user_track_count();

-- Playlist track count trigger
CREATE OR REPLACE FUNCTION private.update_playlist_track_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.playlists
    SET track_count = track_count + 1
    WHERE id = NEW.playlist_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.playlists
    SET track_count = GREATEST(track_count - 1, 0)
    WHERE id = OLD.playlist_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER playlist_track_count_trigger
  AFTER INSERT OR DELETE ON public.playlist_tracks
  FOR EACH ROW
  EXECUTE FUNCTION private.update_playlist_track_count();

-- Notification triggers
CREATE OR REPLACE FUNCTION private.create_follow_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, actor_id, entity_id, entity_type
  )
  SELECT
    NEW.following_id,
    'FOLLOW',
    'Novo seguidor',
    (SELECT name FROM public.users WHERE id = NEW.follower_id) || ' começou a seguir você',
    NEW.follower_id,
    NEW.follower_id,
    'user';

  RETURN NEW;
END;
$$;

CREATE TRIGGER follow_notification_trigger
  AFTER INSERT ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION private.create_follow_notification();

CREATE OR REPLACE FUNCTION private.create_like_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, actor_id, entity_id, entity_type
  )
  SELECT
    t.user_id,
    'LIKE',
    'Nova curtida',
    (SELECT name FROM public.users WHERE id = NEW.user_id) || ' curtiu sua música ' || t.title,
    NEW.user_id,
    NEW.track_id,
    'track'
  FROM public.tracks t
  WHERE t.id = NEW.track_id
    AND t.user_id <> NEW.user_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER like_notification_trigger
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION private.create_like_notification();

-- Full-text search RPC
CREATE OR REPLACE FUNCTION public.search_tracks(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  artist TEXT,
  relevance REAL
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.title,
    t.artist,
    ts_rank(
      to_tsvector('english', t.title || ' ' || t.artist || ' ' || COALESCE(t.album, '')),
      plainto_tsquery('english', search_query)
    ) AS relevance
  FROM public.tracks t
  WHERE t.status = 'PUBLISHED'
    AND to_tsvector('english', t.title || ' ' || t.artist || ' ' || COALESCE(t.album, ''))
      @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC
  LIMIT 50;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_tracks(TEXT) TO anon, authenticated, service_role;

-- Recommendations RPC (fixed genre slug join)
CREATE OR REPLACE FUNCTION public.get_recommendations(
  user_id_param UUID,
  limit_param INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  artist TEXT,
  image_url TEXT,
  play_count INT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.title,
    t.artist,
    t.image_url,
    t.play_count
  FROM public.tracks t
  WHERE t.status = 'PUBLISHED'
    AND t.genre_id IN (
      SELECT g.id
      FROM public.genres g
      WHERE g.slug = ANY (
        SELECT unnest(u.favorite_genres)
        FROM public.users u
        WHERE u.id = user_id_param
      )
    )
    AND t.user_id <> user_id_param
  ORDER BY t.play_count DESC, t.created_at DESC
  LIMIT limit_param;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_recommendations(UUID, INT) TO authenticated, service_role;

-- Top tracks this week RPC
CREATE OR REPLACE FUNCTION public.get_top_tracks_this_week(limit_param INT DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  artist TEXT,
  image_url TEXT,
  play_count BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.title,
    t.artist,
    t.image_url,
    COUNT(ph.id) AS play_count
  FROM public.tracks t
  LEFT JOIN public.play_history ph ON t.id = ph.track_id
    AND ph.played_at >= NOW() - INTERVAL '7 days'
  WHERE t.status = 'PUBLISHED'
  GROUP BY t.id, t.title, t.artist, t.image_url
  ORDER BY play_count DESC
  LIMIT limit_param;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_tracks_this_week(INT) TO anon, authenticated, service_role;

-- Auth profile bootstrap on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'username'), ''),
    split_part(NEW.email, '@', 1)
  );
  base_username := regexp_replace(lower(base_username), '[^a-z0-9_]', '_', 'g');

  IF base_username = '' THEN
    base_username := 'user';
  END IF;

  final_username := base_username;

  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = final_username) LOOP
    final_username := base_username || '_' || substr(md5(random()::text), 1, 4);
  END LOOP;

  INSERT INTO public.users (id, email, username, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data ->> 'name'), ''), final_username),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
