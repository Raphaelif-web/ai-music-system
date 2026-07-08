import { useState, useMemo } from "react";
import { useMusicPlayer } from "../context/MusicContext";
import { useAppData } from "@/context/AppDataContext";
import { TrackRow, TrackTableHeader } from "./ui/TrackRow";
import type { Playlist } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Edit, Trash2 } from "lucide-react";
import { CreatePlaylistModal } from "./CreatePlaylistModal";
import imgTrack1 from "@/assets/figma/48a6e9ae994c060da347e19294ad8e9f9fa5358c.png";

interface PlaylistDetailPageProps {
  playlist?: Playlist | null;
  onBack?: () => void;
  onDeleted?: () => void;
}

export function PlaylistDetailPage({ playlist, onBack, onDeleted }: PlaylistDetailPageProps) {
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();
  const { getPlaylistTracks, updatePlaylist, deletePlaylist } = useAppData();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const playlistTracks = useMemo(
    () => (playlist?.id ? getPlaylistTracks(playlist.id) : []),
    [playlist?.id, getPlaylistTracks]
  );

  const coverImage = playlist?.image ?? imgTrack1;
  const title = playlist?.title ?? "Playlist";
  const trackCount = playlistTracks.length;
  const duration = playlist?.duration ?? `${Math.max(trackCount * 5, 5)} min`;
  const isPublic = playlist?.isPublic ?? true;

  const handleDelete = () => {
    if (!playlist?.id) return;
    if (window.confirm("Excluir esta playlist permanentemente?")) {
      deletePlaylist(playlist.id);
      onDeleted?.();
    }
  };

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-[37px] py-6 lg:py-[38px] space-y-6">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 transition-colors duration-150 hover:opacity-70" style={{ color: "#a19a9b" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-[14px]">Voltar</span>
          </button>
        )}

        <div className="relative overflow-hidden" style={{ border: "1px solid #30292b" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 transition-colors duration-150 hover:bg-white/10 rounded">
                <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                  <circle cx="2" cy="2" r="2" fill="#a19a9b" />
                  <circle cx="2" cy="8" r="2" fill="#a19a9b" />
                  <circle cx="2" cy="14" r="2" fill="#a19a9b" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ background: "#24191b", border: "1px solid #30292b", color: "#f8f8f8" }}>
              <DropdownMenuItem style={{ cursor: "pointer" }} onSelect={() => setEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar playlist</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: "#30292b" }} />
              <DropdownMenuItem variant="destructive" style={{ cursor: "pointer" }} onSelect={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir playlist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-6 p-6 lg:p-8 items-end">
            <div className="relative shrink-0" style={{ width: "160px", height: "160px" }}>
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none" style={{ border: "1px solid #30292b" }} />
            </div>
            <div className="flex flex-col justify-end gap-2 min-w-0 flex-1">
              <p className="font-semibold text-[12px] leading-[1.5] uppercase tracking-wide" style={{ color: "#bababa" }}>
                {isPublic ? "Playlist pública" : "Playlist privada"}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-bold leading-[1.2]" style={{ color: "#ebe9e9", fontSize: "clamp(24px, 4vw, 40px)" }}>
                  {title}
                </h1>
              </div>
              <p className="text-[14px] leading-[1.5]" style={{ color: "#bababa" }}>
                {trackCount} músicas · {duration}
              </p>
            </div>
          </div>
        </div>

        <section>
          {playlistTracks.length === 0 ? (
            <p className="text-center py-12" style={{ color: "#a19a9b" }}>
              Esta playlist ainda não tem músicas. Adicione faixas quando a integração com o backend estiver ativa.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <TrackTableHeader />
                <tbody>
                  {playlistTracks.map((track, index) => {
                    const isCurrentTrack = currentTrack?.id === track.id;
                    const isTrackPlaying = isCurrentTrack && isPlaying;
                    return (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={index}
                        isPlaying={isTrackPlaying}
                        onClick={() => playTrack(track, playlistTracks)}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <CreatePlaylistModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        mode="edit"
        initialData={{
          name: title,
          description: playlist?.description ?? "",
          isPublic: isPublic,
          coverImage: typeof coverImage === "string" ? coverImage : undefined,
        }}
        onCreate={(data) => {
          if (playlist?.id) updatePlaylist(playlist.id, data);
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}
