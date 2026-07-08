-- Mars Sound AI: core tables linked to Supabase Auth

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  cover_image TEXT,
  role public.user_role NOT NULL DEFAULT 'USER',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  favorite_genres VARCHAR(50)[] NOT NULL DEFAULT '{}',
  favorite_moods VARCHAR(50)[] NOT NULL DEFAULT '{}',
  total_tracks INTEGER NOT NULL DEFAULT 0,
  total_plays INTEGER NOT NULL DEFAULT 0,
  total_followers INTEGER NOT NULL DEFAULT 0,
  total_following INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE public.genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  waveform_url TEXT,
  duration INTEGER NOT NULL,
  file_size INTEGER NOT NULL,
  format TEXT NOT NULL DEFAULT 'mp3',
  bitrate INTEGER,
  sample_rate INTEGER,
  artist TEXT NOT NULL,
  album TEXT,
  genre_id UUID NOT NULL REFERENCES public.genres (id),
  moods VARCHAR(50)[] NOT NULL DEFAULT '{}',
  ai_model TEXT,
  ai_prompt TEXT,
  ai_settings JSONB,
  play_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  status public.track_status NOT NULL DEFAULT 'DRAFT',
  is_explicit BOOLEAN NOT NULL DEFAULT FALSE,
  is_downloadable BOOLEAN NOT NULL DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  visibility public.playlist_visibility NOT NULL DEFAULT 'PUBLIC',
  is_collaborative BOOLEAN NOT NULL DEFAULT FALSE,
  track_count INTEGER NOT NULL DEFAULT 0,
  total_duration INTEGER NOT NULL DEFAULT 0,
  follower_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists (id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks (id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID REFERENCES public.users (id) ON DELETE SET NULL,
  UNIQUE (playlist_id, track_id)
);

CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, track_id)
);

CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, track_id)
);

CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks (id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.play_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks (id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  source TEXT,
  playlist_id UUID REFERENCES public.playlists (id) ON DELETE SET NULL
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users (id) ON DELETE SET NULL,
  entity_id UUID,
  entity_type TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.track_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks (id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags (id) ON DELETE CASCADE,
  UNIQUE (track_id, tag_id)
);

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.users (id) ON DELETE SET NULL
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Base btree indexes from Prisma schema
CREATE INDEX users_username_idx ON public.users (username);
CREATE INDEX users_email_idx ON public.users (email);
CREATE INDEX users_created_at_idx ON public.users (created_at);

CREATE INDEX tracks_user_id_idx ON public.tracks (user_id);
CREATE INDEX tracks_genre_id_idx ON public.tracks (genre_id);
CREATE INDEX tracks_status_idx ON public.tracks (status);
CREATE INDEX tracks_published_at_idx ON public.tracks (published_at);
CREATE INDEX tracks_play_count_idx ON public.tracks (play_count);
CREATE INDEX tracks_created_at_idx ON public.tracks (created_at);

CREATE INDEX playlists_user_id_idx ON public.playlists (user_id);
CREATE INDEX playlists_visibility_idx ON public.playlists (visibility);
CREATE INDEX playlists_created_at_idx ON public.playlists (created_at);

CREATE INDEX playlist_tracks_playlist_id_idx ON public.playlist_tracks (playlist_id);
CREATE INDEX playlist_tracks_track_id_idx ON public.playlist_tracks (track_id);
CREATE INDEX playlist_tracks_position_idx ON public.playlist_tracks (position);

CREATE INDEX favorites_user_id_idx ON public.favorites (user_id);
CREATE INDEX favorites_track_id_idx ON public.favorites (track_id);
CREATE INDEX favorites_created_at_idx ON public.favorites (created_at);

CREATE INDEX likes_user_id_idx ON public.likes (user_id);
CREATE INDEX likes_track_id_idx ON public.likes (track_id);
CREATE INDEX likes_created_at_idx ON public.likes (created_at);

CREATE INDEX follows_follower_id_idx ON public.follows (follower_id);
CREATE INDEX follows_following_id_idx ON public.follows (following_id);
CREATE INDEX follows_created_at_idx ON public.follows (created_at);

CREATE INDEX comments_user_id_idx ON public.comments (user_id);
CREATE INDEX comments_track_id_idx ON public.comments (track_id);
CREATE INDEX comments_parent_id_idx ON public.comments (parent_id);
CREATE INDEX comments_created_at_idx ON public.comments (created_at);

CREATE INDEX play_history_user_id_idx ON public.play_history (user_id);
CREATE INDEX play_history_track_id_idx ON public.play_history (track_id);
CREATE INDEX play_history_played_at_idx ON public.play_history (played_at);

CREATE INDEX notifications_user_id_idx ON public.notifications (user_id);
CREATE INDEX notifications_is_read_idx ON public.notifications (is_read);
CREATE INDEX notifications_created_at_idx ON public.notifications (created_at);

CREATE INDEX genres_slug_idx ON public.genres (slug);
CREATE INDEX tags_slug_idx ON public.tags (slug);

CREATE INDEX track_tags_track_id_idx ON public.track_tags (track_id);
CREATE INDEX track_tags_tag_id_idx ON public.track_tags (tag_id);

CREATE INDEX reports_reporter_id_idx ON public.reports (reporter_id);
CREATE INDEX reports_entity_id_idx ON public.reports (entity_id);
CREATE INDEX reports_status_idx ON public.reports (status);
CREATE INDEX reports_created_at_idx ON public.reports (created_at);

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs (user_id);
CREATE INDEX audit_logs_action_idx ON public.audit_logs (action);
CREATE INDEX audit_logs_entity_idx ON public.audit_logs (entity);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at);
