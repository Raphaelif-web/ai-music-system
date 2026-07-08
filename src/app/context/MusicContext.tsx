import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from "react";
import type { Track } from "@/types";
import { useAppData } from "@/context/AppDataContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import * as supabaseApi from "@/services/supabaseService";

export type { Track } from "@/types";

export type RepeatMode = "off" | "all" | "one";

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  isFullscreenOpen: boolean;
  queue: Track[];
  currentIndex: number;
  shuffleEnabled: boolean;
  repeatMode: RepeatMode;
  favoriteIds: string[];
  favoriteTracks: Track[];
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isTrackFavorite: (trackId: string) => boolean;
  toggleFavorite: (trackId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
  openFullscreen: () => void;
  closeFullscreen: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const {
    favoriteIds,
    toggleFavorite: toggleFavoriteGlobal,
    isTrackFavorite,
    getFavoriteTracks,
    user,
    isAuthenticated,
  } = useAppData();

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const audioRef = useRef<HTMLAudioElement>(null);

  const favoriteTracks = getFavoriteTracks();

  const buildQueue = useCallback(
    (tracks: Track[], startTrack: Track) => {
      const base = tracks.length > 0 ? tracks : [startTrack];
      if (!shuffleEnabled) return base;
      const shuffled = shuffleArray(base.filter((t) => t.id !== startTrack.id));
      return [startTrack, ...shuffled];
    },
    [shuffleEnabled]
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const advanceTrack = useCallback(() => {
    if (repeatMode === "one" && currentTrack && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setProgress(0);
      return;
    }

    if (currentIndex < queue.length - 1) {
      const next = queue[currentIndex + 1];
      if (next && audioRef.current) {
        setCurrentTrack(next);
        setCurrentIndex(currentIndex + 1);
        audioRef.current.src = next.audioUrl;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        setProgress(0);
      }
    } else if (repeatMode === "all" && queue.length > 0 && audioRef.current) {
      const first = queue[0];
      setCurrentTrack(first);
      setCurrentIndex(0);
      audioRef.current.src = first.audioUrl;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [repeatMode, currentTrack, currentIndex, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    const handleEnded = () => advanceTrack();

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [advanceTrack]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (!audioRef.current) return;

    const effectiveQueue = buildQueue(newQueue ?? [track], track);
    const index = effectiveQueue.findIndex((t) => t.id === track.id);

    setCurrentTrack(track);
    setQueue(effectiveQueue);
    setCurrentIndex(index >= 0 ? index : 0);
    audioRef.current.src = track.audioUrl;
    audioRef.current.onerror = () => setIsPlaying(false);
    audioRef.current.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setProgress(0);

    if (isSupabaseConfigured && isAuthenticated && user.id) {
      void supabaseApi.recordPlayHistory({
        userId: user.id,
        trackId: track.id,
        source: "player",
      });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSetProgress = (newProgress: number) => {
    if (audioRef.current?.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  const toggleShuffle = () => setShuffleEnabled((s) => !s);

  const toggleRepeat = () => {
    setRepeatMode((mode) => {
      if (mode === "off") return "all";
      if (mode === "all") return "one";
      return "off";
    });
  };

  const playNext = () => advanceTrack();

  const playPrevious = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    if (currentIndex > 0 && audioRef.current) {
      const prev = queue[currentIndex - 1];
      setCurrentTrack(prev);
      setCurrentIndex(currentIndex - 1);
      audioRef.current.src = prev.audioUrl;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setProgress(0);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        isMuted,
        isFullscreenOpen,
        queue,
        currentIndex,
        shuffleEnabled,
        repeatMode,
        favoriteIds,
        favoriteTracks,
        playTrack,
        togglePlay,
        setProgress: handleSetProgress,
        setVolume,
        toggleMute: () => setIsMuted((m) => !m),
        isTrackFavorite,
        toggleFavorite: toggleFavoriteGlobal,
        toggleShuffle,
        toggleRepeat,
        playNext,
        playPrevious,
        openFullscreen: () => setIsFullscreenOpen(true),
        closeFullscreen: () => setIsFullscreenOpen(false),
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </MusicContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusicPlayer must be used within a MusicProvider");
  return context;
}
