import type { Playlist, PlaylistFormData, Track, User } from "@/types";
import type { DiscoverTrack } from "@/data/mock/discover";
import {
  mapDbPlaylist,
  mapDbTrack,
  mapDbTrackToDiscover,
  mapDbUser,
  type DbPlaylist,
  type DbTrack,
  type DbUser,
} from "@/lib/dbMappers";
import { getSupabase } from "@/lib/supabase";

const TRACK_SELECT = `
  id, title, artist, audio_url, image_url, duration, album, moods,
  play_count, like_count, user_id, status,
  genres ( name, slug )
`;

const GENRE_ALIASES: Record<string, string> = {
  eletrônica: "electronic",
  eletronica: "electronic",
  electronic: "electronic",
  pop: "pop",
  rock: "rock",
  gospel: "gospel",
  samba: "samba",
  clássica: "classica",
  classica: "classica",
  clássico: "classica",
  jazz: "jazz",
  blues: "blues",
  country: "country",
  reggae: "reggae",
  "hip-hop": "hip-hop",
  hiphop: "hip-hop",
  metal: "metal",
  opera: "opera",
  ambient: "ambient",
  "lo-fi": "ambient",
  cinematic: "ambient",
  "r&b": "jazz",
  funk: "hip-hop",
  sertanejo: "country",
  mpb: "samba",
  soul: "blues",
  trap: "hip-hop",
  drill: "hip-hop",
  phonk: "electronic",
  synthwave: "electronic",
  retrô: "electronic",
  emo: "rock",
  pagode: "samba",
};

let genreCache: { id: string; name: string; slug: string }[] | null = null;

async function getGenres() {
  if (genreCache) return genreCache;
  const supabase = getSupabase();
  const { data, error } = await supabase.from("genres").select("id, name, slug");
  if (error) throw error;
  genreCache = data ?? [];
  return genreCache;
}

async function resolveGenreId(category?: string): Promise<string> {
  const genres = await getGenres();
  if (!category?.trim()) {
    return genres.find((g) => g.slug === "electronic")?.id ?? genres[0].id;
  }
  const normalized = category.trim().toLowerCase();
  const slug = GENRE_ALIASES[normalized] ?? normalized.replace(/\s+/g, "-");
  const bySlug = genres.find((g) => g.slug === slug);
  if (bySlug) return bySlug.id;
  const byName = genres.find((g) => g.name.toLowerCase() === normalized);
  if (byName) return byName.id;
  return genres.find((g) => g.slug === "electronic")?.id ?? genres[0].id;
}

function storagePublicUrl(bucket: string, path: string) {
  const supabase = getSupabase();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadFile(bucket: string, path: string, file: File, contentType: string) {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType,
  });
  if (error) throw error;
  return storagePublicUrl(bucket, path);
}

export async function fetchUserProfile(userId: string): Promise<User | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDbUser(data as DbUser) : null;
}

export async function fetchPublishedTracks(): Promise<Track[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_SELECT)
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbTrack[]).map(mapDbTrack);
}

export async function fetchDiscoverTracks(): Promise<DiscoverTrack[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_SELECT)
    .eq("status", "PUBLISHED")
    .order("play_count", { ascending: false });
  if (error) throw error;
  return (data as DbTrack[]).map(mapDbTrackToDiscover);
}

export async function fetchUserTracks(userId: string): Promise<Track[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbTrack[]).map(mapDbTrack);
}

export async function fetchUserPlaylists(userId: string): Promise<Playlist[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbPlaylist[]).map(mapDbPlaylist);
}

export async function fetchPlaylistTrackMap(
  playlistIds: string[]
): Promise<Record<string, string[]>> {
  if (playlistIds.length === 0) return {};
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("playlist_tracks")
    .select("playlist_id, track_id, position")
    .in("playlist_id", playlistIds)
    .order("position", { ascending: true });
  if (error) throw error;

  const map: Record<string, string[]> = {};
  for (const row of data ?? []) {
    if (!map[row.playlist_id]) map[row.playlist_id] = [];
    map[row.playlist_id].push(row.track_id);
  }
  return map;
}

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favorites")
    .select("track_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => row.track_id);
}

export async function createPlaylistInDb(
  userId: string,
  data: PlaylistFormData
): Promise<Playlist> {
  const supabase = getSupabase();
  const { data: row, error } = await supabase
    .from("playlists")
    .insert({
      name: data.name.trim(),
      description: data.description || null,
      cover_image: data.coverImage || null,
      visibility: data.isPublic ? "PUBLIC" : "PRIVATE",
      user_id: userId,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapDbPlaylist(row as DbPlaylist);
}

export async function updatePlaylistInDb(
  id: string,
  data: PlaylistFormData
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("playlists")
    .update({
      name: data.name.trim(),
      description: data.description || null,
      cover_image: data.coverImage || null,
      visibility: data.isPublic ? "PUBLIC" : "PRIVATE",
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePlaylistInDb(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) throw error;
}

export async function updateUserProfileInDb(
  userId: string,
  data: Partial<User>
): Promise<User> {
  const supabase = getSupabase();
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.username !== undefined) payload.username = data.username;
  if (data.bio !== undefined) payload.bio = data.bio;
  if (data.avatar !== undefined) payload.avatar = data.avatar;
  if (data.isPublic !== undefined) payload.is_public = data.isPublic;
  if (data.favoriteGenres !== undefined) payload.favorite_genres = data.favoriteGenres;
  if (data.favoriteMoods !== undefined) payload.favorite_moods = data.favoriteMoods;

  const { data: row, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return mapDbUser(row as DbUser);
}

export async function toggleFavoriteInDb(
  userId: string,
  trackId: string,
  isFavorite: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (isFavorite) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("track_id", trackId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("favorites").insert({
      user_id: userId,
      track_id: trackId,
    });
    if (error) throw error;
  }
}

export interface UploadTrackInput {
  title: string;
  audioFile: File;
  coverFile?: File | null;
  category?: string;
  tags?: string[];
  aiGenerator?: string;
  prompt?: string;
  artist: string;
  userId: string;
}

export async function uploadTrackToDb(input: UploadTrackInput): Promise<Track> {
  const supabase = getSupabase();
  const genreId = await resolveGenreId(input.category);
  const trackId = crypto.randomUUID();
  const ext = input.audioFile.name.split(".").pop()?.toLowerCase() ?? "mp3";
  const format = ext === "wav" ? "wav" : "mp3";

  const audioPath = `${input.userId}/${trackId}/audio.${ext}`;
  const audioUrl = await uploadFile(
    "audio-tracks",
    audioPath,
    input.audioFile,
    input.audioFile.type || `audio/${format}`
  );

  let imageUrl =
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop";
  if (input.coverFile) {
    const coverExt = input.coverFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const coverPath = `${input.userId}/${trackId}/cover.${coverExt}`;
    imageUrl = await uploadFile(
      "track-covers",
      coverPath,
      input.coverFile,
      input.coverFile.type || "image/jpeg"
    );
  }

  const { data, error } = await supabase
    .from("tracks")
    .insert({
      id: trackId,
      title: input.title.trim(),
      artist: input.artist.replace(/^@/, ""),
      audio_url: audioUrl,
      image_url: imageUrl,
      duration: 180,
      file_size: input.audioFile.size,
      format,
      album: input.aiGenerator || null,
      genre_id: genreId,
      moods: input.tags ?? [],
      ai_model: input.aiGenerator || null,
      ai_prompt: input.prompt || null,
      user_id: input.userId,
      status: "PUBLISHED",
      published_at: new Date().toISOString(),
    })
    .select(TRACK_SELECT)
    .single();
  if (error) throw error;
  return mapDbTrack(data as DbTrack);
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
}

export async function signUp(name: string, email: string, password: string) {
  const supabase = getSupabase();
  const username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name: name.trim(), username },
    },
  });
}

export async function signOut() {
  const supabase = getSupabase();
  return supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
  const supabase = getSupabase();
  const redirectTo = `${window.location.origin}`;
  return supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
}

export async function updateAuthPassword(password: string) {
  const supabase = getSupabase();
  return supabase.auth.updateUser({ password });
}

export async function updateAuthEmail(email: string) {
  const supabase = getSupabase();
  return supabase.auth.updateUser({ email: email.trim() });
}

export async function deleteUserAccount(userId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) throw error;
  await signOut();
}

export async function loadUserDataBundle(userId: string) {
  const [profileResult, playlistsResult, userTracksResult, publishedResult, favoritesResult] =
    await Promise.allSettled([
      fetchUserProfile(userId),
      fetchUserPlaylists(userId),
      fetchUserTracks(userId),
      fetchPublishedTracks(),
      fetchFavoriteIds(userId),
    ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const playlists = playlistsResult.status === "fulfilled" ? playlistsResult.value : [];
  const userTracks = userTracksResult.status === "fulfilled" ? userTracksResult.value : [];
  const publishedTracks = publishedResult.status === "fulfilled" ? publishedResult.value : [];
  const favoriteIds = favoritesResult.status === "fulfilled" ? favoritesResult.value : [];

  if (playlistsResult.status === "rejected") {
    console.error("Failed to load playlists:", playlistsResult.reason);
  }
  if (publishedResult.status === "rejected") {
    console.error("Failed to load published tracks:", publishedResult.reason);
  }

  const playlistIds = playlists.map((p) => p.id);
  let playlistTrackIds: Record<string, string[]> = {};
  try {
    playlistTrackIds = await fetchPlaylistTrackMap(playlistIds);
  } catch (err) {
    console.error("Failed to load playlist tracks:", err);
  }

  const trackMap = new Map<string, Track>();
  [...publishedTracks, ...userTracks].forEach((t) => trackMap.set(t.id, t));

  const discoverTracks = publishedTracks.map((t) => ({
    ...t,
    category: t.genre ?? "Eletrônica",
    genre: t.genre,
  })) as DiscoverTrack[];

  return {
    profile,
    playlists,
    playlistTrackIds,
    tracks: Array.from(trackMap.values()),
    discoverTracks,
    favoriteIds,
    userTracks,
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function recordPlayHistory(params: {
  userId: string;
  trackId: string;
  source?: string;
  playlistId?: string;
}) {
  if (!UUID_RE.test(params.trackId)) return;

  const supabase = getSupabase();
  const { error } = await supabase.from("play_history").insert({
    user_id: params.userId,
    track_id: params.trackId,
    source: params.source ?? "player",
    playlist_id: params.playlistId ?? null,
    completed: false,
  });

  if (error) {
    console.error("Failed to record play history:", error);
  }
}

export async function fetchRecentPlayHistory(userId: string, limit = 8): Promise<Track[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("play_history")
    .select("track_id")
    .eq("user_id", userId)
    .order("played_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const ids = [...new Set((data ?? []).map((row) => row.track_id))];
  return fetchTracksByIds(ids);
}

export interface HomeCreator {
  id: string;
  name: string;
  handle: string;
  bgImage: string;
}

export interface HomePageData {
  creators: HomeCreator[];
  trending: Track[];
  recent: Track[];
  weeklyHighlights: Track[];
}

const CREATOR_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1650765814813-ec91a21dec80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

async function fetchTracksByIds(ids: string[]): Promise<Track[]> {
  if (ids.length === 0) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_SELECT)
    .in("id", ids)
    .eq("status", "PUBLISHED");
  if (error) throw error;
  const byId = new Map((data as DbTrack[]).map((row) => [row.id, mapDbTrack(row)]));
  return ids.map((id) => byId.get(id)).filter((t): t is Track => Boolean(t));
}

export async function fetchTopCreators(limit = 8): Promise<HomeCreator[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, username, avatar, total_followers")
    .eq("is_public", true)
    .order("total_followers", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    handle: `@${u.username}`,
    bgImage: u.avatar ?? CREATOR_FALLBACK_IMAGE,
  }));
}

export async function fetchTrendingTracks(limit = 14): Promise<Track[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_SELECT)
    .eq("status", "PUBLISHED")
    .order("play_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as DbTrack[]).map(mapDbTrack);
}

export async function fetchRecentTracks(limit = 14): Promise<Track[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tracks")
    .select(TRACK_SELECT)
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as DbTrack[]).map(mapDbTrack);
}

export async function fetchWeeklyHighlightTracks(limit = 4): Promise<Track[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("get_top_tracks_this_week", {
    limit_param: limit,
  });
  if (error) throw error;
  const ids = (data ?? []).map((row: { id: string }) => row.id);
  return fetchTracksByIds(ids);
}

export async function fetchHomePageData(): Promise<HomePageData> {
  const [creators, trending, recent, weeklyHighlights] = await Promise.all([
    fetchTopCreators(),
    fetchTrendingTracks(),
    fetchRecentTracks(),
    fetchWeeklyHighlightTracks(),
  ]);
  return { creators, trending, recent, weeklyHighlights };
}
