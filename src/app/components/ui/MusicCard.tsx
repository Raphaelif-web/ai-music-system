import { useMusicPlayer } from "../../context/MusicContext";
import type { Track } from "@/types";
import { FavoriteButton } from "./FavoriteButton";

interface MusicCardProps {
  track: Track;
  variant?: "grid" | "list";
  showFavorite?: boolean;
  className?: string;
}

export function MusicCard({
  track,
  variant = "grid",
  showFavorite = true,
  className = "",
}: MusicCardProps) {
  const { playTrack, currentTrack, isPlaying, isTrackFavorite, toggleFavorite } =
    useMusicPlayer();
  const isFavorite = isTrackFavorite(track.id);
  const isCurrentTrack = currentTrack?.id === track.id;

  const handleClick = () => {
    playTrack(track);
  };

  const handleFavoriteToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleFavorite(track.id);
  };

  if (variant === "list") {
    return (
      <div
        onClick={handleClick}
        className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-white/5 border border-transparent hover:border-[#30292b] ${className}`}
      >
        {/* Thumbnail */}
        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-md border border-[#30292b]">
          <img
            src={track.image}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          {isCurrentTrack && isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-[#ff164c] animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="w-1 h-4 bg-[#ff164c] animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1 h-4 bg-[#ff164c] animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[#f8f8f8] font-semibold text-base truncate">
            {track.title}
          </p>
          <p className="text-[#a19a9b] text-sm truncate">{track.artist}</p>
        </div>

        {/* Favorite */}
        {showFavorite && (
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleFavoriteToggle}
          />
        )}
      </div>
    );
  }

  // Grid variant
  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col gap-3 cursor-pointer transition-all duration-150 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-[#30292b] group-hover:border-[#ff164c]/50 transition-colors duration-150">
        <img
          src={track.image}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Playing indicator overlay */}
        {isCurrentTrack && isPlaying && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-2 h-8 bg-[#ff164c] animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-8 bg-[#ff164c] animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-8 bg-[#ff164c] animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Favorite button overlay */}
        {showFavorite && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className="bg-black/70 rounded-full p-2 backdrop-blur-sm">
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={handleFavoriteToggle}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-[#f8f8f8] font-semibold text-sm truncate">
          {track.title}
        </p>
        <p className="text-[#a19a9b] text-xs truncate">{track.artist}</p>
      </div>
    </div>
  );
}
