-- Mars Sound AI: demo tracks, playlists, and play history for E2E testing
-- Idempotent: skips when demo track marker already exists

DO $$
DECLARE
  demo_marker UUID := 'a1000001-0000-4000-8000-000000000001';
  u_test UUID;
  u_qa UUID;
  u_qatest UUID;
  g_pop UUID;
  g_rock UUID;
  g_gospel UUID;
  g_electronic UUID;
  g_ambient UUID;
  g_classica UUID;
  pl_mars UUID := 'b2000001-0000-4000-8000-000000000001';
  pl_fav UUID := 'b2000001-0000-4000-8000-000000000002';
  pl_hits UUID := 'b2000001-0000-4000-8000-000000000003';
  audio_url TEXT := 'https://framerusercontent.com/assets/09hPgrhAGuCOXh9suukXzyi8k.mp3';
BEGIN
  IF EXISTS (SELECT 1 FROM public.tracks WHERE id = demo_marker) THEN
    RAISE NOTICE 'Demo tracks already seeded — skipping.';
    RETURN;
  END IF;

  SELECT id INTO u_test FROM public.users WHERE username = 'testuser_mars' LIMIT 1;
  SELECT id INTO u_qa FROM public.users WHERE username = 'qaqa' LIMIT 1;
  SELECT id INTO u_qatest FROM public.users WHERE username = 'qatest' LIMIT 1;

  IF u_test IS NULL OR u_qa IS NULL THEN
    RAISE EXCEPTION 'Seed requires users testuser_mars and qaqa. Create accounts first.';
  END IF;

  IF u_qatest IS NULL THEN
    u_qatest := u_test;
  END IF;

  SELECT id INTO g_pop FROM public.genres WHERE slug = 'pop';
  SELECT id INTO g_rock FROM public.genres WHERE slug = 'rock';
  SELECT id INTO g_gospel FROM public.genres WHERE slug = 'gospel';
  SELECT id INTO g_electronic FROM public.genres WHERE slug = 'electronic';
  SELECT id INTO g_ambient FROM public.genres WHERE slug = 'ambient';
  SELECT id INTO g_classica FROM public.genres WHERE slug = 'classica';

  -- Enrich creator avatars for home page
  UPDATE public.users SET avatar = 'https://images.unsplash.com/photo-1650765814813-ec91a21dec80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  WHERE id = u_test AND avatar IS NULL;
  UPDATE public.users SET avatar = 'https://images.unsplash.com/photo-1615748561835-cff146a0b3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  WHERE id = u_qatest AND avatar IS NULL;
  UPDATE public.users SET avatar = 'https://images.unsplash.com/photo-1767000374714-93fab2581f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  WHERE id = u_qa AND avatar IS NULL;

  INSERT INTO public.tracks (
    id, title, description, audio_url, image_url, duration, file_size, format,
    artist, album, genre_id, moods, ai_model, ai_prompt, play_count, like_count,
    status, user_id, published_at
  ) VALUES
    (
      demo_marker,
      'Bob brown',
      'Synth-pop gerado com IA — vibe retrô marciana.',
      audio_url,
      'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      347, 8_500_000, 'mp3',
      '@bobbrown', 'Bob brown', g_pop, ARRAY['happy', 'energetic'],
      'suno-v4', 'Upbeat synth-pop with retro Mars theme', 1280, 42,
      'PUBLISHED', u_test, NOW() - INTERVAL '14 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000002',
      'Marte de boa',
      'Rock espacial com guitarras distorcidas.',
      audio_url,
      'https://images.unsplash.com/photo-1647160494152-4c8eb24a844b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      396, 9_200_000, 'mp3',
      '@lucasmarteux', 'Marte ataca', g_rock, ARRAY['energetic', 'party'],
      'udio-v2', 'Space rock anthem with driving drums', 980, 31,
      'PUBLISHED', u_test, NOW() - INTERVAL '12 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000003',
      'Amo muito...',
      'Gospel contemplativo criado por IA.',
      audio_url,
      'https://images.unsplash.com/photo-1712530708772-49749a0bad58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      322, 7_800_000, 'mp3',
      '@thalesroberto', 'Marte de boa', g_gospel, ARRAY['romantic', 'chill'],
      'suno-v4', 'Emotional gospel ballad with choir pads', 756, 28,
      'PUBLISHED', u_qa, NOW() - INTERVAL '10 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000004',
      'Digital Dreams',
      'Eletrônica futurista para foco e produtividade.',
      audio_url,
      'https://images.unsplash.com/photo-1730537456020-cd3bfd7c491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      255, 6_100_000, 'mp3',
      '@dreammaker', 'Future Sounds', g_electronic, ARRAY['focus', 'chill'],
      'suno-v4', 'Futuristic electronic with arpeggiated synths', 1540, 67,
      'PUBLISHED', u_qatest, NOW() - INTERVAL '8 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000005',
      'Neon Pulse',
      'Synthwave com batidas pulsantes.',
      audio_url,
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      238, 5_900_000, 'mp3',
      '@neonbeats', 'Cyber Vibes', g_electronic, ARRAY['energetic', 'party'],
      'udio-v2', 'Neon synthwave with 80s drum machine', 1120, 55,
      'PUBLISHED', u_qatest, NOW() - INTERVAL '6 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000006',
      'Red Planet',
      'Ambient relaxante inspirado em paisagens marcianas.',
      audio_url,
      'https://images.unsplash.com/photo-1625786682948-2168238883d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      330, 8_000_000, 'mp3',
      '@martian', 'Space Journey', g_ambient, ARRAY['chill', 'meditation', 'sleep'],
      'suno-v4', 'Ambient soundscape with soft pads and textures', 890, 19,
      'PUBLISHED', u_qa, NOW() - INTERVAL '5 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000007',
      'AI Symphony',
      'Orquestração clássica gerada por modelo de IA.',
      audio_url,
      'https://images.unsplash.com/photo-1637734426495-c90f016fd57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      282, 6_800_000, 'mp3',
      '@synthmaster', 'Electric Waves', g_classica, ARRAY['focus', 'romantic'],
      'suno-v4', 'Classical orchestra with modern production', 670, 24,
      'PUBLISHED', u_test, NOW() - INTERVAL '3 days'
    ),
    (
      'a1000001-0000-4000-8000-000000000008',
      'Future Memories',
      'Retrowave nostálgico com vocais etéreos.',
      audio_url,
      'https://images.unsplash.com/photo-1622573502059-c20fd67aa5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      310, 7_500_000, 'mp3',
      '@retrowave', 'Time Travel', g_electronic, ARRAY['sad', 'chill'],
      'udio-v2', 'Nostalgic retrowave with ethereal vocals', 1340, 48,
      'PUBLISHED', u_qatest, NOW() - INTERVAL '1 day'
    );

  -- Playlists
  INSERT INTO public.playlists (id, name, description, cover_image, visibility, user_id)
  VALUES
    (
      pl_mars,
      'Mars Vibes',
      'Minha seleção de sons espaciais e eletrônicos.',
      'https://images.unsplash.com/photo-1730537456020-cd3bfd7c491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      'PUBLIC',
      u_qa
    ),
    (
      pl_fav,
      'AI Favorites',
      'Favoritas geradas com IA esta semana.',
      'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      'PUBLIC',
      u_qa
    ),
    (
      pl_hits,
      'Top Hits Mars',
      'Os maiores hits da comunidade Mars Sound.',
      'https://images.unsplash.com/photo-1568215425379-7a994872739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
      'PUBLIC',
      u_test
    );

  INSERT INTO public.playlist_tracks (playlist_id, track_id, position, added_by) VALUES
    (pl_mars, 'a1000001-0000-4000-8000-000000000004', 1, u_qa),
    (pl_mars, 'a1000001-0000-4000-8000-000000000005', 2, u_qa),
    (pl_mars, 'a1000001-0000-4000-8000-000000000006', 3, u_qa),
    (pl_fav, demo_marker, 1, u_qa),
    (pl_fav, 'a1000001-0000-4000-8000-000000000003', 2, u_qa),
    (pl_fav, 'a1000001-0000-4000-8000-000000000008', 3, u_qa),
    (pl_hits, demo_marker, 1, u_test),
    (pl_hits, 'a1000001-0000-4000-8000-000000000002', 2, u_test),
    (pl_hits, 'a1000001-0000-4000-8000-000000000004', 3, u_test),
    (pl_hits, 'a1000001-0000-4000-8000-000000000005', 4, u_test);

  -- Recent play history for QA user (PlaylistsPage "Tocadas recentemente")
  INSERT INTO public.play_history (user_id, track_id, source, played_at, completed) VALUES
    (u_qa, 'a1000001-0000-4000-8000-000000000008', 'player', NOW() - INTERVAL '2 hours', TRUE),
    (u_qa, 'a1000001-0000-4000-8000-000000000004', 'player', NOW() - INTERVAL '5 hours', TRUE),
    (u_qa, demo_marker, 'player', NOW() - INTERVAL '1 day', FALSE),
    (u_qa, 'a1000001-0000-4000-8000-000000000005', 'player', NOW() - INTERVAL '2 days', TRUE);

  -- Weekly play history for "Destaques da semana" RPC
  INSERT INTO public.play_history (user_id, track_id, source, played_at)
  SELECT u_test, 'a1000001-0000-4000-8000-000000000004', 'discover', NOW() - (n || ' hours')::INTERVAL
  FROM generate_series(1, 12) AS n;

  INSERT INTO public.play_history (user_id, track_id, source, played_at)
  SELECT u_qatest, 'a1000001-0000-4000-8000-000000000008', 'discover', NOW() - (n || ' hours')::INTERVAL
  FROM generate_series(1, 8) AS n;

  INSERT INTO public.play_history (user_id, track_id, source, played_at)
  SELECT u_qa, demo_marker, 'home', NOW() - (n || ' hours')::INTERVAL
  FROM generate_series(1, 5) AS n;

  -- Sample favorites for QA user
  INSERT INTO public.favorites (user_id, track_id) VALUES
    (u_qa, demo_marker),
    (u_qa, 'a1000001-0000-4000-8000-000000000003'),
    (u_qa, 'a1000001-0000-4000-8000-000000000008')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Demo seed completed: 8 tracks, 3 playlists, play history, favorites.';
END $$;
