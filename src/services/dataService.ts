/**
 * Data access layer — delegates to Supabase when configured, otherwise mock data.
 */
import type { Playlist, Track, User } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  MOCK_AUDIO_URL,
  MOCK_CURRENT_USER,
  MOCK_PLAYLISTS,
  MOCK_TRACK_CATALOG,
  DEFAULT_FAVORITE_TRACK_IDS,
  getPlaylistTracks,
  getTrackById,
  getTracksByIds,
} from "@/data/mock";
import * as supabaseApi from "@/services/supabaseService";

export const dataService = {
  isRemote: isSupabaseConfigured,

  getAudioPlaceholderUrl: () => MOCK_AUDIO_URL,

  getCurrentUser: (): User => MOCK_CURRENT_USER,

  listTracks: (): Track[] => MOCK_TRACK_CATALOG,

  getTrack: (id: string) => getTrackById(id),

  listPlaylists: (): Playlist[] => MOCK_PLAYLISTS,

  getPlaylistTracks: (playlistId: string) => getPlaylistTracks(playlistId),

  getDefaultFavoriteIds: () => [...DEFAULT_FAVORITE_TRACK_IDS],

  getFavoriteTracks: (ids: string[]) => getTracksByIds(ids),

  fetchPublishedTracks: () =>
    isSupabaseConfigured ? supabaseApi.fetchPublishedTracks() : Promise.resolve(MOCK_TRACK_CATALOG),

  fetchDiscoverTracks: () =>
    isSupabaseConfigured ? supabaseApi.fetchDiscoverTracks() : Promise.resolve([]),
};
