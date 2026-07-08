/**
 * Domain types aligned with DATABASE_SCHEMA.md (Prisma / Supabase).
 * Frontend uses these shapes; mock layer implements them until API exists.
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
  duration?: number | string;
  album?: string;
  genre?: string;
  moods?: string[];
  tags?: string[];
  uploadedBy?: string;
  plays?: number;
  likes?: number;
  createdAt?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  trackCount: number;
  duration: string;
  image: string;
  isPublic?: boolean;
  createdBy?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  isPublic: boolean;
  favoriteGenres: string[];
  favoriteMoods: string[];
  totalTracks: number;
  totalPlays: number;
  followers: number;
  following: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  bgImage: string;
  overlayImage?: string;
}

export interface PlaylistFormData {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage?: string;
}

export type AuthView =
  | "login"
  | "register"
  | "forgot-request"
  | "forgot-success"
  | "forgot-reset";

export type NavItemId =
  | "inicio"
  | "descobrir"
  | "playlist"
  | "playlist-detail"
  | "favoritos"
  | "perfil"
  | "perfil-publico"
  | "configuracoes"
  | "carregar-musica";
