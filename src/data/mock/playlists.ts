import type { Playlist, Track } from "@/types";
import { getTracksByIds } from "./tracks";

import imgPlaylist1 from "@/assets/figma/a5fb4564c109688e9da55ace27c2a57ec585d299.png";
import imgPlaylist2 from "@/assets/figma/7972b3bd4358bcce33ff27707690626714be9283.png";
import imgPlaylist3 from "@/assets/figma/f256cdc56e3a87dafde6b39922b2b63d32b719af.png";

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: "p1", title: "Músicas retrô", trackCount: 4, duration: "21 min", image: imgPlaylist1, isPublic: true },
  { id: "p2", title: "Bob brown", trackCount: 3, duration: "18 min", image: imgPlaylist2, isPublic: false },
  { id: "p3", title: "Vibes espaciais", trackCount: 3, duration: "15 min", image: imgPlaylist3, isPublic: true },
];

/** Playlist → track IDs (mirrors future PlaylistTrack join table). */
export const MOCK_PLAYLIST_TRACK_IDS: Record<string, string[]> = {
  p1: ["t-bob", "t-marte", "t-future", "t-red"],
  p2: ["t-bob", "t-marte", "t-amo"],
  p3: ["t-neon", "t-ai", "t-digital"],
};

export function getPlaylistTracks(playlistId: string): Track[] {
  return getTracksByIds(MOCK_PLAYLIST_TRACK_IDS[playlistId] ?? []);
}
