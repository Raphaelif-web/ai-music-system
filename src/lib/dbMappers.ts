import type { Playlist, Track, User } from "@/types";
import type { DiscoverTrack } from "@/data/mock/discover";

export interface DbUser {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  is_public: boolean;
  favorite_genres: string[];
  favorite_moods: string[];
  total_tracks: number;
  total_plays: number;
  total_followers: number;
  total_following: number;
}

export interface DbTrack {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  image_url: string;
  duration: number;
  album: string | null;
  moods: string[];
  play_count: number;
  like_count: number;
  user_id: string;
  status: string;
  genres?: { name: string; slug: string } | null;
}

export interface DbPlaylist {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  track_count: number;
  total_duration: number;
  user_id: string;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function mapDbUser(row: DbUser): User {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    bio: row.bio ?? undefined,
    avatar: row.avatar ?? undefined,
    isPublic: row.is_public,
    favoriteGenres: row.favorite_genres ?? [],
    favoriteMoods: row.favorite_moods ?? [],
    totalTracks: row.total_tracks,
    totalPlays: row.total_plays,
    followers: row.total_followers,
    following: row.total_following,
  };
}

export function mapDbTrack(row: DbTrack): Track {
  const genreName = row.genres?.name;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist.startsWith("@") ? row.artist : `@${row.artist}`,
    image: row.image_url,
    audioUrl: row.audio_url,
    duration: formatDuration(row.duration),
    album: row.album ?? undefined,
    genre: genreName,
    moods: row.moods,
    uploadedBy: row.user_id,
    plays: row.play_count,
    likes: row.like_count,
  };
}

export function mapDbTrackToDiscover(row: DbTrack): DiscoverTrack {
  const track = mapDbTrack(row);
  return {
    ...track,
    category: row.genres?.name ?? "Eletrônica",
    genre: row.genres?.name ?? track.genre,
  };
}

export function mapDbPlaylist(row: DbPlaylist): Playlist {
  const minutes = Math.max(Math.round(row.total_duration / 60), row.track_count > 0 ? 1 : 0);
  return {
    id: row.id,
    title: row.name,
    description: row.description ?? undefined,
    trackCount: row.track_count,
    duration: `${minutes} min`,
    image: row.cover_image ?? "",
    isPublic: row.visibility === "PUBLIC",
    createdBy: row.user_id,
  };
}
