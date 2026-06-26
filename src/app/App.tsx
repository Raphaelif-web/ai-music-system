import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MusicProvider } from "./context/MusicContext";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { MusicPlayer } from "./components/MusicPlayer";
import { MiniPlayer } from "./components/MiniPlayer";
import { FullScreenMobilePlayer } from "./components/FullScreenMobilePlayer";
import { HomePage } from "./components/HomePage";
import { DiscoverPage } from "./components/DiscoverPage";
import { PlaylistsPage } from "./components/PlaylistsPage";
import { PlaylistDetailPage } from "./components/PlaylistDetailPage";
import { FavoritesPage } from "./components/FavoritesPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { BottomNav } from "./components/BottomNav";
import { UploadMusicPage } from "./components/UploadMusicPage";
import { AuthPage } from "./components/AuthPage";
import type { Playlist } from "./components/PlaylistsPage";
import bgImage from "@/assets/figma/755a0ad35d80d322f261566363a27bca5637a26e.png";

const PAGE_LABELS: Record<string, string> = {
  descobrir: "Descobrir",
  playlist: "Playlist",
  favoritos: "Favoritos",
  perfil: "Perfil",
  configuracoes: "Configurações",
  "carregar-musica": "Carregar Música AI",
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

export default function App() {
  const [activeNav, setActiveNav] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [discoverQuery, setDiscoverQuery] = useState("");

  const handleSearch = (query: string) => {
    setDiscoverQuery(query);
    if (query.trim()) {
      setActiveNav("descobrir");
    }
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <AnimatePresence>
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AuthPage onAuthenticated={() => setIsAuthenticated(true)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <MusicProvider>
      <div
        className="h-screen overflow-hidden relative"
        style={{ backgroundColor: "var(--color-bg-base)" }}
      >
        {/* Background image */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <img 
            src={bgImage} 
            alt="" 
            className="w-full h-full object-cover opacity-10"
            style={{ mixBlendMode: "lighten" }}
          />
        </div>

        {/* ────────── HORIZONTAL LAYOUT: Sidebar + Main Content ────────── */}
        <div className="flex h-screen relative z-10">
          
          {/* ────────── Sidebar (Left - Fixed Width) ────────── */}
          <Sidebar
            activeItem={activeNav}
            onNavChange={(item) => {
              setActiveNav(item);
              setSidebarOpen(false);
            }}
            mobileOpen={sidebarOpen}
            onMobileClose={() => setSidebarOpen(false)}
          />

          {/* ────────── Main Content (Right - Fill Container) ────────── */}
          <div className="flex flex-col flex-1 h-screen overflow-hidden lg:ml-0">
            
            {/* Navbar - Top (Fill Width) */}
            <Navbar 
              onMenuToggle={() => setSidebarOpen(true)}
              onAvatarClick={() => setActiveNav("configuracoes")}
              onSearch={handleSearch}
              onUploadClick={() => setActiveNav("carregar-musica")}
            />

            {/* Body - Scrollable Content (Fill Container) */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-[132px] lg:pb-[90px] relative">
              <AnimatePresence mode="wait">
                {activeNav === "inicio" ? (
                  <motion.div
                    key="inicio"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <HomePage />
                  </motion.div>
                ) : activeNav === "descobrir" ? (
                  <motion.div
                    key="descobrir"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <DiscoverPage externalSearchQuery={discoverQuery} />
                  </motion.div>
                ) : activeNav === "playlist" ? (
                  <motion.div
                    key="playlist"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <PlaylistsPage
                      onPlaylistClick={(pl) => {
                        setSelectedPlaylist(pl);
                        setActiveNav("playlist-detail");
                      }}
                    />
                  </motion.div>
                ) : activeNav === "playlist-detail" ? (
                  <motion.div
                    key="playlist-detail"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <PlaylistDetailPage
                      playlist={selectedPlaylist}
                      onBack={() => setActiveNav("playlist")}
                    />
                  </motion.div>
                ) : activeNav === "favoritos" ? (
                  <motion.div
                    key="favoritos"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <FavoritesPage />
                  </motion.div>
                ) : activeNav === "perfil" ? (
                  <motion.div
                    key="perfil"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <ProfilePage
                      isPublic={false}
                      onEditProfile={() => setActiveNav("configuracoes")}
                    />
                  </motion.div>
                ) : activeNav === "perfil-publico" ? (
                  <motion.div
                    key="perfil-publico"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <ProfilePage isPublic={true} />
                  </motion.div>
                ) : activeNav === "configuracoes" ? (
                  <motion.div
                    key="configuracoes"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <SettingsPage onLogout={() => setIsAuthenticated(false)} />
                  </motion.div>
                ) : activeNav === "carregar-musica" ? (
                  <motion.div
                    key="carregar-musica"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <UploadMusicPage onCancel={() => setActiveNav("inicio")} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeNav}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <PlaceholderPage title={PAGE_LABELS[activeNav] ?? activeNav} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ────────── Bottom nav (mobile only - Layer above content) ────────── */}
        <BottomNav activeItem={activeNav} onNavChange={setActiveNav} />

        {/* ────────── Fixed music player (Absolute Position - Top Layer) ────────── */}
        <MusicPlayer />
        <MiniPlayer />
        <FullScreenMobilePlayer />
      </div>
    </MusicProvider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8"
      style={{ color: "var(--color-text-muted)" }}
    >
      <svg
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ opacity: 0.2 }}
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
      <p className="font-semibold" style={{ fontSize: "18px", color: "var(--color-text-primary)" }}>
        {title}
      </p>
      <p
        style={{
          fontSize: "13px",
          textAlign: "center",
          maxWidth: "300px",
          lineHeight: 1.7,
        }}
      >
        Esta seção está sendo desenvolvida. Continue explorando a plataforma!
      </p>
    </div>
  );
}