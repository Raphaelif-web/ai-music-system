import { useState } from "react";
import { useMusicPlayer, Track } from "../context/MusicContext";
import { TrackRow, TrackTableHeader } from "./ui/TrackRow";
import { CreatePlaylistModal } from "./CreatePlaylistModal";

// Playlist card images from Figma
import imgPlaylist1 from "@/assets/figma/a5fb4564c109688e9da55ace27c2a57ec585d299.png";
import imgPlaylist2 from "@/assets/figma/7972b3bd4358bcce33ff27707690626714be9283.png";
import imgPlaylist3 from "@/assets/figma/f256cdc56e3a87dafde6b39922b2b63d32b719af.png";

// Recently played track images from Figma
import imgTrack1 from "@/assets/figma/48a6e9ae994c060da347e19294ad8e9f9fa5358c.png";
import imgTrack2 from "@/assets/figma/51e24026833e73d23a99e5a06db5cc02e7cd5bf4.png";
import imgTrack3 from "@/assets/figma/b6fa0d201f9ec64c5f0a983eee403861c850233c.png";
import imgTrack4 from "@/assets/figma/29b52570151c1055b78e8e5043802cd321b71944.png";
import imgTrack5 from "@/assets/figma/718dc7fe8ba681a3ad6c3a7945ac9998226d79a9.png";
import imgTrack6 from "@/assets/figma/065a523c405e679bd35be6ccc6f70c9e126f4630.png";
import imgTrack7 from "@/assets/figma/f62715eb368a05e886636fc759986135921e464c.png";
import imgTrack8 from "@/assets/figma/7a1a7f8b9a7226c2a844698d749a32cccada90ef.png";

const AUDIO_URL = "https://framerusercontent.com/assets/09hPgrhAGuCOXh9suukXzyi8k.mp3";

export interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  duration: string;
  image: string;
}

export const playlists: Playlist[] = [
  { id: "p1", title: "Músicas retrô", trackCount: 7, duration: "27 min", image: imgPlaylist1 },
  { id: "p2", title: "Bob brown", trackCount: 7, duration: "27 min", image: imgPlaylist2 },
  { id: "p3", title: "Bob brown", trackCount: 7, duration: "27 min", image: imgPlaylist3 },
];

export const recentlyPlayed: Track[] = [
  { id: "rp1", title: "Bob brown", artist: "@bobbrown", album: "Bob brown", duration: "5:47", image: imgTrack1, audioUrl: AUDIO_URL },
  { id: "rp2", title: "Marte de boa", artist: "@lucasmarteux", album: "Marte ataca", duration: "6:36", image: imgTrack2, audioUrl: AUDIO_URL },
  { id: "rp3", title: "Amo muito...", artist: "@thalesroberto", album: "Marte de boa", duration: "5:22", image: imgTrack3, audioUrl: AUDIO_URL },
  { id: "rp4", title: "Digital Dreams", artist: "@dreammaker", album: "Future Sounds", duration: "4:15", image: imgTrack4, audioUrl: AUDIO_URL },
  { id: "rp5", title: "Neon Pulse", artist: "@neonbeats", album: "Cyber Vibes", duration: "3:58", image: imgTrack5, audioUrl: AUDIO_URL },
  { id: "rp6", title: "Red Planet", artist: "@martian", album: "Space Journey", duration: "5:30", image: imgTrack6, audioUrl: AUDIO_URL },
  { id: "rp7", title: "AI Symphony", artist: "@synthmaster", album: "Electric Waves", duration: "4:42", image: imgTrack7, audioUrl: AUDIO_URL },
  { id: "rp8", title: "Future Memories", artist: "@retrowave", album: "Time Travel", duration: "5:10", image: imgTrack8, audioUrl: AUDIO_URL },
];

// ── Playlist Card ──
interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col cursor-pointer transition-all duration-200"
      style={{
        border: `1px solid ${hovered ? "#ff164c" : "#30292b"}`,
        boxShadow: hovered ? "0 0 16px rgba(255,22,76,0.25)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Image section */}
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black" />
      </div>

      {/* Text info */}
      <div className="px-[18px] py-[12px]">
        <p
          className="font-semibold text-[16px] leading-[1.5] truncate"
          style={{ color: "#bababa" }}
        >
          {playlist.title}
        </p>
        <p className="text-[12px] leading-[1.25]" style={{ color: "#bababa" }}>
          {playlist.trackCount} músicas · {playlist.duration}
        </p>
      </div>
    </article>
  );
}

// ── Page ──
interface PlaylistsPageProps {
  onPlaylistClick: (playlist: Playlist) => void;
}

export function PlaylistsPage({ onPlaylistClick }: PlaylistsPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-[37px] py-6 lg:py-[38px] space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold text-[24px] leading-[1.5] mb-2"
              style={{ color: "#ebe9e9" }}
            >
              Playlists
            </h1>
            <p className="font-semibold text-[16px] leading-[1.5]" style={{ color: "#bfbbbc" }}>
              Sua coleção pessoal de músicas criadas com AI
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-[12px] px-[16px] py-[8px] shrink-0 transition-colors duration-150 hover:bg-[#ff164c]/10"
            style={{ border: "1px solid #ff164c" }}
          >
            {/* Plus icon */}
            <svg width="16" height="16" viewBox="0 0 8 8" fill="none">
              <path
                d="M7.33333 3.33333H4.66667V0.666667C4.66667 0.489856 4.59643 0.320287 4.4714 0.195262C4.34638 0.070238 4.17681 0 4 0C3.82319 0 3.65362 0.070238 3.5286 0.195262C3.40357 0.320287 3.33333 0.489856 3.33333 0.666667V3.33333H0.666667C0.489856 3.33333 0.320287 3.40357 0.195262 3.5286C0.070238 3.65362 0 3.82319 0 4C0 4.17681 0.070238 4.34638 0.195262 4.4714C0.320287 4.59643 0.489856 4.66667 0.666667 4.66667H3.33333V7.33333C3.33333 7.51014 3.40357 7.67971 3.5286 7.80474C3.65362 7.92976 3.82319 8 4 8C4.17681 8 4.34638 7.92976 4.4714 7.80474C4.59643 7.67971 4.66667 7.51014 4.66667 7.33333V4.66667H7.33333C7.51014 4.66667 7.67971 4.59643 7.80474 4.4714C7.92976 4.34638 8 4.17681 8 4C8 3.82319 7.92976 3.65362 7.80474 3.5286C7.67971 3.40357 7.51014 3.33333 7.33333 3.33333Z"
                fill="#f8f8f8"
              />
            </svg>
            <span
              className="font-semibold text-[16px] leading-[1.5] whitespace-nowrap"
              style={{ color: "#f8f8f8" }}
            >
              Nova playlist
            </span>
          </button>
        </div>

        {/* ── Playlist Grid ── */}
        <section>
          {/* Desktop: Grid layout */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => onPlaylistClick(playlist)}
              />
            ))}
          </div>

          {/* Mobile: Carousel layout */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4">
            <div className="flex gap-4 px-4">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="flex-none w-[160px]">
                  <PlaylistCard
                    playlist={playlist}
                    onClick={() => onPlaylistClick(playlist)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recently Played ── */}
        <section>
          <h2
            className="font-semibold text-[24px] leading-[1.5] mb-4"
            style={{ color: "#ebe9e9" }}
          >
            Tocadas recentemente
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <TrackTableHeader showAlbum={false} showDuration={false} />
              <tbody>
                {recentlyPlayed.map((track, index) => {
                  const isCurrentTrack = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrentTrack && isPlaying;

                  return (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      isPlaying={isTrackPlaying}
                      onClick={() => playTrack(track)}
                      showAlbum={false}
                      showDuration={false}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Create Playlist Modal ── */}
      <CreatePlaylistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(data) => {
          console.log("Create playlist:", data);
          setModalOpen(false);
        }}
      />
    </div>
  );
}