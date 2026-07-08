import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Playlist, PlaylistFormData, Track, User } from "@/types";
import type { DiscoverTrack } from "@/data/mock/discover";
import {
  DEFAULT_FAVORITE_TRACK_IDS,
  MOCK_CURRENT_USER,
  MOCK_DISCOVER_TRACKS,
  MOCK_PLAYLIST_TRACK_IDS,
  MOCK_PLAYLISTS,
  MOCK_TRACK_CATALOG,
  MOCK_USER_UPLOADS,
} from "@/data/mock";
import { loadJSON, removeStorageKey, saveJSON } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabase } from "@/lib/supabase";
import * as supabaseApi from "@/services/supabaseService";

const STORAGE_KEYS = {
  auth: "mars-auth",
  user: "mars-user",
  playlists: "mars-playlists",
  playlistTracks: "mars-playlist-tracks",
  customTracks: "mars-custom-tracks",
  favorites: "mars-favorites",
} as const;

interface AuthSession {
  isAuthenticated: boolean;
  email: string;
}

export interface UploadTrackPayload {
  title: string;
  audioFile: File;
  coverFile?: File | null;
  category?: string;
  tags?: string[];
  aiGenerator?: string;
  prompt?: string;
}

interface AppDataContextValue {
  isInitializing: boolean;
  isAuthenticated: boolean;
  user: User;
  playlists: Playlist[];
  tracks: Track[];
  discoverTracks: DiscoverTrack[];
  favoriteIds: string[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateAccount: (data: { email?: string; password?: string; confirmPassword?: string }) => Promise<boolean>;
  createPlaylist: (data: PlaylistFormData) => Promise<Playlist>;
  updatePlaylist: (id: string, data: PlaylistFormData) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  getPlaylistTracks: (playlistId: string) => Track[];
  uploadTrack: (payload: UploadTrackPayload) => Promise<Track>;
  getUserTracks: () => Track[];
  toggleFavorite: (trackId: string) => Promise<void>;
  isTrackFavorite: (trackId: string) => boolean;
  getFavoriteTracks: () => Track[];
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function calcPlaylistDuration(trackCount: number) {
  return `${Math.max(trackCount * 5, 5)} min`;
}

const EMPTY_USER: User = {
  id: "",
  name: "",
  username: "",
  email: "",
  isPublic: true,
  favoriteGenres: [],
  favoriteMoods: [],
  totalTracks: 0,
  totalPlays: 0,
  followers: 0,
  following: 0,
};

const INIT_TIMEOUT_MS = 12_000;

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(isSupabaseConfigured);
  const [auth, setAuth] = useState<AuthSession>(() =>
    isSupabaseConfigured
      ? { isAuthenticated: false, email: "" }
      : loadJSON(STORAGE_KEYS.auth, { isAuthenticated: false, email: "" })
  );
  const [user, setUser] = useState<User>(() =>
    isSupabaseConfigured ? EMPTY_USER : loadJSON(STORAGE_KEYS.user, MOCK_CURRENT_USER)
  );
  const [playlists, setPlaylists] = useState<Playlist[]>(() =>
    isSupabaseConfigured ? [] : loadJSON(STORAGE_KEYS.playlists, MOCK_PLAYLISTS)
  );
  const [playlistTrackIds, setPlaylistTrackIds] = useState<Record<string, string[]>>(() =>
    isSupabaseConfigured ? {} : loadJSON(STORAGE_KEYS.playlistTracks, MOCK_PLAYLIST_TRACK_IDS)
  );
  const [customTracks, setCustomTracks] = useState<Track[]>(() =>
    isSupabaseConfigured ? [] : loadJSON(STORAGE_KEYS.customTracks, MOCK_USER_UPLOADS)
  );
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    isSupabaseConfigured ? [] : loadJSON(STORAGE_KEYS.favorites, [...DEFAULT_FAVORITE_TRACK_IDS])
  );
  const [discoverTracks, setDiscoverTracks] = useState<DiscoverTrack[]>(() =>
    isSupabaseConfigured ? [] : MOCK_DISCOVER_TRACKS
  );

  const tracks = useMemo(
    () => (isSupabaseConfigured ? customTracks : [...MOCK_TRACK_CATALOG, ...customTracks]),
    [customTracks]
  );

  const allTracksById = useMemo(() => {
    const map = new Map<string, Track>();
    [...tracks, ...discoverTracks].forEach((t) => map.set(t.id, t));
    return map;
  }, [tracks, discoverTracks]);

  const persist = useCallback(
    (key: keyof typeof STORAGE_KEYS, value: unknown) => saveJSON(STORAGE_KEYS[key], value),
    []
  );

  const applyUserBundle = useCallback((bundle: Awaited<ReturnType<typeof supabaseApi.loadUserDataBundle>>) => {
    if (bundle.profile) setUser(bundle.profile);
    setPlaylists(bundle.playlists);
    setPlaylistTrackIds(bundle.playlistTrackIds);
    setCustomTracks(bundle.tracks);
    setDiscoverTracks(bundle.discoverTracks);
    setFavoriteIds(bundle.favoriteIds);
  }, []);

  const hydrateFromSupabase = useCallback(
    async (userId: string, email: string) => {
      setAuth({ isAuthenticated: true, email });

      try {
        const bundle = await supabaseApi.loadUserDataBundle(userId);
        applyUserBundle(bundle);
      } catch (err) {
        console.error("Failed to load user data:", err);
        toast.error("Alguns dados não carregaram. Você pode continuar usando o app.");
        try {
          const profile = await supabaseApi.fetchUserProfile(userId);
          if (profile) setUser(profile);
        } catch {
          /* profile fallback failed */
        }
      }
    },
    [applyUserBundle]
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = getSupabase();
    let mounted = true;
    let initFinished = false;

    const finishInit = () => {
      if (!initFinished && mounted) {
        initFinished = true;
        setIsInitializing(false);
      }
    };

    const initTimeout = window.setTimeout(() => {
      if (!initFinished && mounted) {
        toast.error("Conexão lenta. Continuando em segundo plano...");
        finishInit();
      }
    }, INIT_TIMEOUT_MS);

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        if (session?.user) {
          void hydrateFromSupabase(session.user.id, session.user.email ?? "");
        }
      } catch (err) {
        console.error("Failed to restore Supabase session:", err);
        toast.error("Não foi possível conectar ao servidor.");
      } finally {
        window.clearTimeout(initTimeout);
        finishInit();
      }
    };

    void init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT") {
        setAuth({ isAuthenticated: false, email: "" });
        setUser(EMPTY_USER);
        setPlaylists([]);
        setPlaylistTrackIds({});
        setCustomTracks([]);
        setDiscoverTracks([]);
        setFavoriteIds([]);
        return;
      }
      if (session?.user && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED")) {
        await hydrateFromSupabase(session.user.id, session.user.email ?? "");
      }
    });

    return () => {
      mounted = false;
      window.clearTimeout(initTimeout);
      subscription.unsubscribe();
    };
  }, [hydrateFromSupabase]);

  const getPlaylistTracks = useCallback(
    (playlistId: string): Track[] => {
      const ids = playlistTrackIds[playlistId] ?? [];
      return ids.map((id) => allTracksById.get(id)).filter((t): t is Track => Boolean(t));
    },
    [playlistTrackIds, allTracksById]
  );

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha e-mail e senha.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("E-mail inválido.");
      return false;
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseApi.signIn(email, password);
      if (error) {
        toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
        return false;
      }
      const { data: { session } } = await getSupabase().auth.getSession();
      if (session?.user) {
        void hydrateFromSupabase(session.user.id, session.user.email ?? "");
      }
      toast.success("Login realizado com sucesso!");
      return true;
    }

    const session = { isAuthenticated: true, email: email.trim() };
    setAuth(session);
    persist("auth", session);
    toast.success("Login realizado com sucesso!");
    return true;
  }, [hydrateFromSupabase, persist]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Preencha todos os campos.");
      return false;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseApi.signUp(name, email, password);
      if (error) {
        toast.error(error.message);
        return false;
      }
      if (data.session) {
        void hydrateFromSupabase(data.session.user.id, data.session.user.email ?? "");
        toast.success("Conta criada com sucesso!");
        return true;
      }
      toast.success("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
      return true;
    }

    const updatedUser: User = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      username: email.split("@")[0],
    };
    setUser(updatedUser);
    persist("user", updatedUser);
    const session = { isAuthenticated: true, email: email.trim() };
    setAuth(session);
    persist("auth", session);
    toast.success("Conta criada com sucesso!");
    return true;
  }, [hydrateFromSupabase, user, persist]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabaseApi.signOut();
    } else {
      const session = { isAuthenticated: false, email: "" };
      setAuth(session);
      persist("auth", session);
    }
    toast.info("Você saiu da conta.");
  }, [persist]);

  const deleteAccount = useCallback(async () => {
    if (isSupabaseConfigured && user.id) {
      try {
        await supabaseApi.deleteUserAccount(user.id);
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível excluir a conta.");
        return;
      }
    } else {
      removeStorageKey(STORAGE_KEYS.auth);
      removeStorageKey(STORAGE_KEYS.user);
      removeStorageKey(STORAGE_KEYS.playlists);
      removeStorageKey(STORAGE_KEYS.playlistTracks);
      removeStorageKey(STORAGE_KEYS.customTracks);
      removeStorageKey(STORAGE_KEYS.favorites);
      setAuth({ isAuthenticated: false, email: "" });
      setUser(MOCK_CURRENT_USER);
      setPlaylists(MOCK_PLAYLISTS);
      setPlaylistTrackIds(MOCK_PLAYLIST_TRACK_IDS);
      setCustomTracks(MOCK_USER_UPLOADS);
      setFavoriteIds([...DEFAULT_FAVORITE_TRACK_IDS]);
    }
    toast.success("Conta excluída.");
  }, [user.id]);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return false;
    }
    if (isSupabaseConfigured) {
      const { error } = await supabaseApi.resetPasswordForEmail(email);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Link de recuperação enviado para seu e-mail.");
      return true;
    }
    toast.success("Link de recuperação enviado (mock).");
    return true;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (isSupabaseConfigured) {
      const { error } = await supabaseApi.updateAuthPassword(password);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Senha atualizada com sucesso!");
      return true;
    }
    toast.success("Senha atualizada (mock).");
    return true;
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (isSupabaseConfigured && user.id) {
        try {
          const updated = await supabaseApi.updateUserProfileInDb(user.id, data);
          setUser(updated);
          toast.success("Perfil atualizado!");
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível atualizar o perfil.");
        }
        return;
      }
      const updated = { ...user, ...data };
      setUser(updated);
      persist("user", updated);
      toast.success("Perfil atualizado!");
    },
    [user, persist]
  );

  const updateAccount = useCallback(
    async (data: { email?: string; password?: string; confirmPassword?: string }) => {
      if (data.password && data.password !== data.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return false;
      }
      if (data.password && data.password.length < 6) {
        toast.error("A nova senha deve ter pelo menos 6 caracteres.");
        return false;
      }

      if (isSupabaseConfigured && user.id) {
        try {
          if (data.email && data.email !== user.email) {
            const { error } = await supabaseApi.updateAuthEmail(data.email);
            if (error) throw error;
          }
          if (data.password) {
            const { error } = await supabaseApi.updateAuthPassword(data.password);
            if (error) throw error;
          }
          const updated = await supabaseApi.updateUserProfileInDb(user.id, {
            email: data.email?.trim() || user.email,
          });
          setUser(updated);
          toast.success("Conta atualizada!");
          return true;
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível atualizar a conta.");
          return false;
        }
      }

      const updated = { ...user, email: data.email?.trim() || user.email };
      setUser(updated);
      persist("user", updated);
      toast.success("Conta atualizada!");
      return true;
    },
    [user, persist]
  );

  const createPlaylist = useCallback(
    async (data: PlaylistFormData): Promise<Playlist> => {
      if (isSupabaseConfigured && user.id) {
        try {
          const playlist = await supabaseApi.createPlaylistInDb(user.id, data);
          setPlaylists((prev) => [...prev, playlist]);
          setPlaylistTrackIds((prev) => ({ ...prev, [playlist.id]: [] }));
          toast.success("Playlist criada!");
          return playlist;
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível criar a playlist.");
          throw err;
        }
      }

      const id = generateId("pl");
      const playlist: Playlist = {
        id,
        title: data.name.trim(),
        description: data.description,
        trackCount: 0,
        duration: "0 min",
        image: data.coverImage || MOCK_PLAYLISTS[0].image,
        isPublic: data.isPublic,
        createdBy: user.id,
      };
      const next = [...playlists, playlist];
      const nextTracks = { ...playlistTrackIds, [id]: [] };
      setPlaylists(next);
      setPlaylistTrackIds(nextTracks);
      persist("playlists", next);
      persist("playlistTracks", nextTracks);
      toast.success("Playlist criada!");
      return playlist;
    },
    [playlists, playlistTrackIds, user.id, persist]
  );

  const updatePlaylist = useCallback(
    async (id: string, data: PlaylistFormData) => {
      if (isSupabaseConfigured) {
        try {
          await supabaseApi.updatePlaylistInDb(id, data);
          setPlaylists((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    title: data.name.trim(),
                    description: data.description,
                    isPublic: data.isPublic,
                    image: data.coverImage || p.image,
                  }
                : p
            )
          );
          toast.success("Playlist atualizada!");
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível atualizar a playlist.");
        }
        return;
      }

      const next = playlists.map((p) =>
        p.id === id
          ? {
              ...p,
              title: data.name.trim(),
              description: data.description,
              isPublic: data.isPublic,
              image: data.coverImage || p.image,
            }
          : p
      );
      setPlaylists(next);
      persist("playlists", next);
      toast.success("Playlist atualizada!");
    },
    [playlists, persist]
  );

  const deletePlaylist = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured) {
        try {
          await supabaseApi.deletePlaylistInDb(id);
          setPlaylists((prev) => prev.filter((p) => p.id !== id));
          setPlaylistTrackIds((prev) => {
            const { [id]: _, ...rest } = prev;
            return rest;
          });
          toast.success("Playlist excluída.");
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível excluir a playlist.");
        }
        return;
      }

      const next = playlists.filter((p) => p.id !== id);
      const { [id]: _, ...restTracks } = playlistTrackIds;
      setPlaylists(next);
      setPlaylistTrackIds(restTracks);
      persist("playlists", next);
      persist("playlistTracks", restTracks);
      toast.success("Playlist excluída.");
    },
    [playlists, playlistTrackIds, persist]
  );

  const uploadTrack = useCallback(
    async (payload: UploadTrackPayload): Promise<Track> => {
      if (isSupabaseConfigured && user.id) {
        try {
          const track = await supabaseApi.uploadTrackToDb({
            ...payload,
            artist: `@${user.username}`,
            userId: user.id,
          });
          setCustomTracks((prev) => [track, ...prev]);
          setDiscoverTracks((prev) => [
            { ...track, category: track.genre ?? "Eletrônica", genre: track.genre },
            ...prev,
          ]);
          toast.success("Música publicada com sucesso!");
          return track;
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível publicar a música.");
          throw err;
        }
      }

      const newTrack: Track = {
        id: generateId("upload"),
        title: payload.title,
        artist: `@${user.username}`,
        image: payload.coverFile ? URL.createObjectURL(payload.coverFile) : "",
        audioUrl: URL.createObjectURL(payload.audioFile),
        genre: payload.category,
        tags: payload.tags,
        album: payload.aiGenerator,
        uploadedBy: user.id,
      };
      const next = [...customTracks, newTrack];
      setCustomTracks(next);
      persist("customTracks", next);
      toast.success("Música publicada com sucesso!");
      return newTrack;
    },
    [customTracks, user.id, user.username, persist]
  );

  const getUserTracks = useCallback(
    () => customTracks.filter((t) => t.uploadedBy === user.id),
    [customTracks, user.id]
  );

  const toggleFavorite = useCallback(
    async (trackId: string) => {
      const isFavorite = favoriteIds.includes(trackId);

      if (isSupabaseConfigured && user.id) {
        try {
          await supabaseApi.toggleFavoriteInDb(user.id, trackId, isFavorite);
        } catch (err) {
          console.error(err);
          toast.error("Não foi possível atualizar favoritos.");
          return;
        }
      }

      setFavoriteIds((prev) => {
        const next = isFavorite ? prev.filter((id) => id !== trackId) : [...prev, trackId];
        if (!isSupabaseConfigured) persist("favorites", next);
        return next;
      });
    },
    [favoriteIds, user.id, persist]
  );

  const isTrackFavorite = useCallback(
    (trackId: string) => favoriteIds.includes(trackId),
    [favoriteIds]
  );

  const getFavoriteTracks = useCallback(() => {
    return favoriteIds
      .map((id) => allTracksById.get(id))
      .filter((t): t is Track => Boolean(t));
  }, [favoriteIds, allTracksById]);

  return (
    <AppDataContext.Provider
      value={{
        isInitializing,
        isAuthenticated: auth.isAuthenticated,
        user,
        playlists,
        tracks,
        discoverTracks,
        favoriteIds,
        login,
        register,
        logout,
        deleteAccount,
        requestPasswordReset,
        updatePassword,
        updateProfile,
        updateAccount,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        getPlaylistTracks,
        uploadTrack,
        getUserTracks,
        toggleFavorite,
        isTrackFavorite,
        getFavoriteTracks,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
