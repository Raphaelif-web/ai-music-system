import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
  duration?: number | string;
  album?: string;
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  isFavorite: boolean;
  isFullscreenOpen: boolean;
  queue: Track[];
  currentIndex: number;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFavorite: () => void;
  playNext: () => void;
  playPrevious: () => void;
  openFullscreen: () => void;
  closeFullscreen: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Auto-play next track
      setCurrentIndex((prev) => {
        if (prev < queue.length - 1) {
          const next = queue[prev + 1];
          if (next && audioRef.current) {
            setCurrentTrack(next);
            audioRef.current.src = next.audioUrl;
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
            return prev + 1;
          }
        }
        return prev;
      });
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [queue]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (audioRef.current) {
      setCurrentTrack(track);
      audioRef.current.src = track.audioUrl;
      
      // Update queue
      if (newQueue) {
        setQueue(newQueue);
        setCurrentIndex(newQueue.findIndex((t) => t.id === track.id));
      } else {
        // Single track queue
        setQueue([track]);
        setCurrentIndex(0);
      }
      
      audioRef.current.onerror = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSetProgress = (newProgress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const playNext = () => {
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
    }
  };

  const playPrevious = () => {
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    if (currentIndex > 0) {
      const prev = queue[currentIndex - 1];
      if (prev && audioRef.current) {
        setCurrentTrack(prev);
        setCurrentIndex(currentIndex - 1);
        audioRef.current.src = prev.audioUrl;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        setProgress(0);
      }
    }
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        isMuted,
        isFavorite,
        isFullscreenOpen,
        queue,
        currentIndex,
        playTrack,
        togglePlay,
        setProgress: handleSetProgress,
        setVolume,
        toggleMute,
        toggleFavorite,
        playNext,
        playPrevious,
        openFullscreen,
        closeFullscreen,
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
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicProvider");
  }
  return context;
}