import type { Track } from "@/types";
import { MOCK_AUDIO_URL } from "./constants";

import imgTrack1 from "@/assets/figma/48a6e9ae994c060da347e19294ad8e9f9fa5358c.png";
import imgTrack2 from "@/assets/figma/51e24026833e73d23a99e5a06db5cc02e7cd5bf4.png";
import imgTrack3 from "@/assets/figma/b6fa0d201f9ec64c5f0a983eee403861c850233c.png";
import imgTrack4 from "@/assets/figma/29b52570151c1055b78e8e5043802cd321b71944.png";
import imgTrack5 from "@/assets/figma/718dc7fe8ba681a3ad6c3a7945ac9998226d79a9.png";
import imgTrack6 from "@/assets/figma/065a523c405e679bd35be6ccc6f70c9e126f4630.png";
import imgTrack7 from "@/assets/figma/f62715eb368a05e886636fc759986135921e464c.png";
import imgTrack8 from "@/assets/figma/7a1a7f8b9a7226c2a844698d749a32cccada90ef.png";

/** Canonical catalog — swap for API `tracks.list()` later. */
export const MOCK_TRACK_CATALOG: Track[] = [
  { id: "t-bob", title: "Bob brown", artist: "@bobbrown", album: "Bob brown", duration: "5:47", image: imgTrack1, audioUrl: MOCK_AUDIO_URL, genre: "Pop" },
  { id: "t-marte", title: "Marte de boa", artist: "@lucasmarteux", album: "Marte ataca", duration: "6:36", image: imgTrack2, audioUrl: MOCK_AUDIO_URL, genre: "Rock" },
  { id: "t-amo", title: "Amo muito...", artist: "@thalesroberto", album: "Marte de boa", duration: "5:22", image: imgTrack3, audioUrl: MOCK_AUDIO_URL, genre: "Gospel" },
  { id: "t-digital", title: "Digital Dreams", artist: "@dreammaker", album: "Future Sounds", duration: "4:15", image: imgTrack4, audioUrl: MOCK_AUDIO_URL, genre: "Eletrônica" },
  { id: "t-neon", title: "Neon Pulse", artist: "@neonbeats", album: "Cyber Vibes", duration: "3:58", image: imgTrack5, audioUrl: MOCK_AUDIO_URL, genre: "Synthwave" },
  { id: "t-red", title: "Red Planet", artist: "@martian", album: "Space Journey", duration: "5:30", image: imgTrack6, audioUrl: MOCK_AUDIO_URL, genre: "Ambient" },
  { id: "t-ai", title: "AI Symphony", artist: "@synthmaster", album: "Electric Waves", duration: "4:42", image: imgTrack7, audioUrl: MOCK_AUDIO_URL, genre: "Clássica" },
  { id: "t-future", title: "Future Memories", artist: "@retrowave", album: "Time Travel", duration: "5:10", image: imgTrack8, audioUrl: MOCK_AUDIO_URL, genre: "Retrô" },
];

export const DEFAULT_FAVORITE_TRACK_IDS = ["t-bob", "t-marte", "t-amo"] as const;

/** User-uploaded tracks seed — persisted via AppDataContext. */
export const MOCK_USER_UPLOADS: Track[] = [
  { id: "upload-bob", title: "Bob brown", artist: "@lucasmarteux", album: "Bob brown", duration: "5:47", image: imgTrack1, audioUrl: MOCK_AUDIO_URL, uploadedBy: "u-lucas", genre: "Pop" },
  { id: "upload-marte", title: "Marte de boa", artist: "@lucasmarteux", album: "Marte ataca", duration: "6:36", image: imgTrack2, audioUrl: MOCK_AUDIO_URL, uploadedBy: "u-lucas", genre: "Rock" },
  { id: "upload-amo", title: "Amo muito...", artist: "@lucasmarteux", album: "Marte de boa", duration: "5:22", image: imgTrack3, audioUrl: MOCK_AUDIO_URL, uploadedBy: "u-lucas", genre: "Gospel" },
];

export function getTrackById(id: string): Track | undefined {
  return MOCK_TRACK_CATALOG.find((t) => t.id === id);
}

export function getTracksByIds(ids: string[]): Track[] {
  return ids.map(getTrackById).filter((t): t is Track => Boolean(t));
}
