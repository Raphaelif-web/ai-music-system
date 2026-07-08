import { useMusicPlayer } from "../context/MusicContext";
import { TrackRow, TrackTableHeader } from "./ui/TrackRow";

export function FavoritesPage() {
  const { playTrack, currentTrack, isPlaying, favoriteTracks } = useMusicPlayer();

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-[37px] py-6 lg:py-[38px] space-y-6">
        
        {/* ── Header ── */}
        <div className="flex flex-col gap-2">
          <h1
            className="font-bold text-[24px] leading-[1.5]"
            style={{ color: "#ebe9e9" }}
          >
            Favoritos
          </h1>
          <p className="font-semibold text-[16px] leading-[1.5]" style={{ color: "#bfbbbc" }}>
            Músicas marcadas como favoritas
          </p>
        </div>

        {/* ── Hero Card with Heart ── */}
        <div
          className="relative overflow-hidden p-6 lg:p-8 flex items-center justify-center"
          style={{
            border: "1px solid #30292b",
            background: "linear-gradient(135deg, rgba(255,22,76,0.15) 0%, rgba(21,15,16,0.8) 100%)",
            minHeight: "200px",
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff164c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative flex flex-col items-center gap-4">
            <svg width="80" height="73" viewBox="0 0 24 21.096" fill="none">
              <path
                d="M17.5048 0C16.3788 0.0175 15.2773 0.3319 14.3116 0.9113C13.3459 1.4907 12.5502 2.3147 12.0048 3.3C11.4595 2.3147 10.6638 1.4907 9.6981 0.9113C8.7324 0.3319 7.6309 0.0175 6.5048 0C4.7098 0.078 3.0186 0.8633 1.8006 2.1842C0.5827 3.5052 -0.063 5.2545 0.0048 7.05C0.0048 11.597 4.7908 16.563 8.8048 19.93C9.7011 20.6831 10.8342 21.096 12.0048 21.096C13.1755 21.096 14.3086 20.6831 15.2048 19.93C19.2188 16.563 24.0048 11.597 24.0048 7.05C24.0726 5.2545 23.427 3.5052 22.2091 2.1842C20.9911 0.8633 19.2999 0.078 17.5048 0Z"
                fill="#ff164c"
              />
            </svg>
            
            <div className="text-center">
              <p className="font-semibold text-[12px] leading-[1.5] uppercase tracking-wide mb-1" style={{ color: "#bababa" }}>
                Playlist pública
              </p>
              <h2 className="font-bold text-[32px] lg:text-[40px] leading-[1.2]" style={{ color: "#ebe9e9" }}>
                Músicas favoritas
              </h2>
              <p className="text-[14px] leading-[1.5] mt-2" style={{ color: "#bababa" }}>
                {favoriteTracks.length} {favoriteTracks.length === 1 ? "música" : "músicas"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tracks Table ── */}
        <section>
          {favoriteTracks.length === 0 ? (
            <p className="text-center py-12 text-[#a19a9b]" style={{ fontSize: "14px" }}>
              Nenhuma música favorita ainda. Toque no coração para salvar suas favoritas.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <TrackTableHeader />
              <tbody>
                {favoriteTracks.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    isPlaying={currentTrack?.id === track.id && isPlaying}
                    onClick={() => playTrack(track, favoriteTracks)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
