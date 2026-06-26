import { useState } from "react";
import { MusicCarousel } from "./MusicCarousel";
import { useMusicPlayer, Track } from "../context/MusicContext";
import svgPaths from "../../imports/svg-67owiawy17";

// ── Unsplash creator images ──
const IMG_CREATOR_0 = "https://images.unsplash.com/photo-1650765814813-ec91a21dec80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_1 = "https://images.unsplash.com/photo-1615748561835-cff146a0b3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_2 = "https://images.unsplash.com/photo-1767000374714-93fab2581f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_3 = "https://images.unsplash.com/photo-1764014353336-99ee638c6d5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_4 = "https://images.unsplash.com/photo-1647220419119-316822d9d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_5 = "https://images.unsplash.com/photo-1615748562188-07be820cff5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_6 = "https://images.unsplash.com/photo-1761163924901-2ed45af2c8c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CREATOR_7 = "https://images.unsplash.com/photo-1624929303661-22c5bce0169b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

// ── Unsplash music card images ──
const IMG_STUDIO = "https://images.unsplash.com/photo-1712530708772-49749a0bad58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_VINYL = "https://images.unsplash.com/photo-1530909833732-38175c89170b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_NEON_STAGE = "https://images.unsplash.com/photo-1730537456020-cd3bfd7c491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_DJ = "https://images.unsplash.com/photo-1647160494152-4c8eb24a844b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_FESTIVAL = "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_SYNTH = "https://images.unsplash.com/photo-1642784323419-89d08b21c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_HEADPHONES = "https://images.unsplash.com/photo-1625786682948-2168238883d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_MIC = "https://images.unsplash.com/photo-1678356434281-0ef01a3ac02d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_GUITAR = "https://images.unsplash.com/photo-1710528184482-44188dcbff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_PIANO = "https://images.unsplash.com/photo-1637734426495-c90f016fd57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CASSETTE = "https://images.unsplash.com/photo-1622573502059-c20fd67aa5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_MIXER = "https://images.unsplash.com/photo-1665982921839-018bf2e08fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_CONCERT = "https://images.unsplash.com/photo-1568215425379-7a994872739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_GEAR = "https://images.unsplash.com/photo-1494430700620-683982a84a30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_WAVES = "https://images.unsplash.com/photo-1723250262102-19ab713c05b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const IMG_RADIO = "https://images.unsplash.com/photo-1772812474654-a94307e5df20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

// ── Data ──────────────────────────────────────────────────

interface Creator {
  id: string;
  name: string;
  handle: string;
  bgImage: string;
  overlayImage?: string;
}

const creators: Creator[] = [
  { id: "c0", name: "Bob brown",    handle: "@bobbrown",    bgImage: IMG_CREATOR_0 },
  { id: "c1", name: "Robert Green", handle: "@robertgreen", bgImage: IMG_CREATOR_1 },
  { id: "c2", name: "Mark Smith",   handle: "@marksmith",   bgImage: IMG_CREATOR_2 },
  { id: "c3", name: "Sara White",   handle: "@sarawhite",   bgImage: IMG_CREATOR_3 },
  { id: "c4", name: "Bruna Black",  handle: "@brunablack",  bgImage: IMG_CREATOR_4 },
  { id: "c5", name: "Lisa Blue",    handle: "@lisablue",    bgImage: IMG_CREATOR_5 },
  { id: "c6", name: "Joana Grey",   handle: "@joanagrey",   bgImage: IMG_CREATOR_6 },
  { id: "c7", name: "Nina Yellow",  handle: "@ninayellow",  bgImage: IMG_CREATOR_7 },
];

// Free music URLs - Using the provided Framer URL for all tracks
const AUDIO_URL = "https://framerusercontent.com/assets/09hPgrhAGuCOXh9suukXzyi8k.mp3";

const tracksEmAlta: Track[] = [
  { id: "t1",  title: "Synthwave Dreams",          artist: "@SynthMasterAI",  image: IMG_SYNTH, audioUrl: AUDIO_URL },
  { id: "t2",  title: "AI Serenade",               artist: "@MelodyMaker",    image: IMG_DJ, audioUrl: AUDIO_URL },
  { id: "t3",  title: "Whispers of the Future",    artist: "@FutureSound",    image: IMG_WAVES, audioUrl: AUDIO_URL },
  { id: "t4",  title: "Digital Echo",              artist: "@EchoAI",         image: IMG_CONCERT, audioUrl: AUDIO_URL },
  { id: "t5",  title: "Neon Nights",               artist: "@NeonCreator",    image: IMG_NEON_STAGE, audioUrl: AUDIO_URL },
  { id: "t6",  title: "Harmony of Ones and Zeros", artist: "@CodeComposer",   image: IMG_PIANO, audioUrl: AUDIO_URL },
  { id: "t7",  title: "Electric Emotions",         artist: "@EmotionEngine",  image: IMG_VINYL, audioUrl: AUDIO_URL },
  { id: "t8",  title: "AI Lullaby",                artist: "@LullabyBot",     image: IMG_STUDIO, audioUrl: AUDIO_URL },
  { id: "t9",  title: "Gear Heaven",               artist: "@GearMaster",     image: IMG_GEAR, audioUrl: AUDIO_URL },
  { id: "t10", title: "Production Vibes",          artist: "@ProducerPro",    image: IMG_MIXER, audioUrl: AUDIO_URL },
  { id: "t11", title: "Mixer Magic",               artist: "@MixerWizard",    image: IMG_HEADPHONES, audioUrl: AUDIO_URL },
  { id: "t12", title: "Neon Dreams",               artist: "@NeonLights",     image: IMG_GUITAR, audioUrl: AUDIO_URL },
  { id: "t13", title: "Concert Energy",            artist: "@LivePerformer",  image: IMG_FESTIVAL, audioUrl: AUDIO_URL },
  { id: "t14", title: "Synth Paradise",            artist: "@SynthLover",     image: IMG_CASSETTE, audioUrl: AUDIO_URL },
];

const tracksRecentes: Track[] = [
  { id: "r1", title: "Vinyl Soul",                 artist: "@RetroVibes",     image: IMG_VINYL, audioUrl: AUDIO_URL },
  { id: "r2", title: "Live Crowd Energy",          artist: "@MelodyMaker",    image: IMG_FESTIVAL, audioUrl: AUDIO_URL },
  { id: "r3", title: "Guitar Dreams",              artist: "@StringMaster",   image: IMG_GUITAR, audioUrl: AUDIO_URL },
  { id: "r4", title: "Studio Sessions",            artist: "@ProducerElite",  image: IMG_STUDIO, audioUrl: AUDIO_URL },
  { id: "r5", title: "Retro Waves",                artist: "@VintageSound",   image: IMG_WAVES, audioUrl: AUDIO_URL },
  { id: "r6", title: "DJ Flow",                    artist: "@TurnTableKing",  image: IMG_DJ, audioUrl: AUDIO_URL },
  { id: "r7", title: "Microphone Check",           artist: "@VocalPro",       image: IMG_MIC, audioUrl: AUDIO_URL },
  { id: "r8", title: "Piano Melodies",             artist: "@KeyboardMaster", image: IMG_PIANO, audioUrl: AUDIO_URL },
  { id: "r9", title: "Cassette Memories",          artist: "@AnalogLover",    image: IMG_CASSETTE, audioUrl: AUDIO_URL },
  { id: "r10", title: "Digital Revolution",        artist: "@TechnoMind",     image: IMG_RADIO, audioUrl: AUDIO_URL },
  { id: "r11", title: "Headphone Bliss",           artist: "@AudioFile",      image: IMG_HEADPHONES, audioUrl: AUDIO_URL },
  { id: "r12", title: "Neon Stage",                artist: "@LiveWire",       image: IMG_NEON_STAGE, audioUrl: AUDIO_URL },
  { id: "r13", title: "Equipment Dreams",          artist: "@GearHead",       image: IMG_GEAR, audioUrl: AUDIO_URL },
  { id: "r14", title: "Neon Pulse",                artist: "@CyberSound",     image: IMG_CONCERT, audioUrl: AUDIO_URL },
];

const tracksDestaques: Track[] = [
  { id: "d1", title: "Future Whispers 2",       artist: "@bobbrown",       image: IMG_NEON_STAGE, audioUrl: AUDIO_URL },
  { id: "d2", title: "Vintage Nights",          artist: "@robertgreen",    image: IMG_STUDIO, audioUrl: AUDIO_URL },
  { id: "d3", title: "AI Echo Dreams",          artist: "@marksmith",      image: IMG_FESTIVAL, audioUrl: AUDIO_URL },
  { id: "d4", title: "Electric Vibes",          artist: "@sarawhite",      image: IMG_CASSETTE, audioUrl: AUDIO_URL },
];

// ── Sub-components ────────────────────────────────────────

function PlayingBars() {
  return (
    <div className="flex items-end gap-px h-[13px]">
      <span
        className="w-[3px] rounded-sm"
        style={{ height: "13px", backgroundColor: "rgba(21,15,16,0.85)", animation: "barBounce 0.8s ease-in-out infinite alternate" }}
      />
      <span
        className="w-[3px] rounded-sm"
        style={{ height: "7px", backgroundColor: "rgba(21,15,16,0.85)", animation: "barBounce 0.6s ease-in-out infinite alternate 0.2s" }}
      />
      <span
        className="w-[3px] rounded-sm"
        style={{ height: "10px", backgroundColor: "rgba(21,15,16,0.85)", animation: "barBounce 0.9s ease-in-out infinite alternate 0.1s" }}
      />
    </div>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <article
      className="relative flex-none w-[140px] sm:w-[160px] lg:w-[175px] h-[220px] sm:h-[250px] lg:h-[279px] overflow-hidden cursor-pointer group"
      style={{ border: "1px solid var(--color-border-subtle)" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={creator.bgImage}
          alt={creator.name}
          className="absolute w-[130%] h-[130%] object-cover -left-[10%] -top-[20%]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {creator.overlayImage && (
          <img
            src={creator.overlayImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black" />
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: "rgba(255,22,76,0.08)" }}
      />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
        <p
          className="font-semibold truncate"
          style={{ color: "var(--color-text-primary)", fontSize: "14px", lineHeight: 1.5 }}
        >
          {creator.name}
        </p>
        <p
          className="truncate"
          style={{ color: "var(--color-text-secondary)", fontSize: "12px", lineHeight: 1.25 }}
        >
          {creator.handle}
        </p>
      </div>
    </article>
  );
}

function MusicCard({ track, size = "normal" }: { track: Track; size?: "normal" | "large" }) {
  const [hovered, setHovered] = useState(false);
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isActive = isCurrentTrack && isPlaying;

  const handleClick = () => {
    if (track.audioUrl) {
      playTrack(
        {
          id: track.id,
          title: track.title,
          artist: track.artist,
          image: track.image,
          audioUrl: track.audioUrl,
        },
        // Pass the relevant track list as the queue
        size === "large" ? tracksDestaques : tracksEmAlta
      );
    }
  };

  const cardWidth = size === "large"
    ? "min-w-[260px] sm:min-w-[300px] lg:min-w-[340px]"
    : "w-[140px] sm:w-[160px] lg:w-[175px] flex-none";

  const imgHeight = size === "large"
    ? "h-[150px] sm:h-[160px] lg:h-[175px]"
    : "h-[140px] sm:h-[155px] lg:h-[175px]";

  return (
    <article
      className={`relative flex flex-col cursor-pointer group ${cardWidth}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={size === "large" ? { flex: "1 1 0" } : {}}
    >
      {/* Image area */}
      <div
        className={`relative shrink-0 w-full ${imgHeight} overflow-hidden`}
        style={{
          border: isActive
            ? "2px solid var(--color-brand)"
            : "1px solid var(--color-border-subtle)",
        }}
      >
        <img
          src={track.image}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.objectFit = 'contain';
            target.style.backgroundColor = 'rgba(255,22,76,0.1)';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-black/80" />

        {/* Active indicator / hover play */}
        <div className="absolute bottom-3 left-3">
          {isActive && !hovered ? (
            <div
              className="flex items-end gap-px p-1"
              style={{ backgroundColor: "var(--color-brand)", padding: "4px" }}
            >
              <PlayingBars />
            </div>
          ) : hovered ? (
            <div
              className="w-8 h-8 rounded flex items-center justify-center transition-all duration-150"
              style={{ backgroundColor: "var(--color-brand)" }}
            >
              <svg width="10" height="12" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div
        className="px-3 py-2.5"
        style={{
          color: isActive ? "var(--color-text-active)" : "var(--color-text-secondary)",
        }}
      >
        <p
          className="font-semibold truncate"
          style={{ fontSize: "14px", lineHeight: 1.5 }}
        >
          {track.title}
        </p>
        <p style={{ fontSize: "12px", lineHeight: 1.25 }}>{track.artist}</p>
      </div>
    </article>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-4 lg:mb-5">
      <h2
        className="font-bold"
        style={{ color: "var(--color-text-primary)", fontSize: "20px", lineHeight: 1.5 }}
      >
        {title}
      </h2>
      <button
        className="text-sm transition-colors duration-150 cursor-pointer"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-brand)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)")}
      >
        Ver tudo
      </button>
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────

export function HomePage() {
  const [activeSection, setActiveSection] = useState<"all" | "ai" | "human">("all");

  return (
    <div className="flex-1 w-full overflow-y-auto scrollbar-hide">
      <div className="w-full px-4 sm:px-6 lg:px-[37px] py-6 lg:py-[38px] space-y-8 lg:space-y-[38px]">
        {/* Top criadores section */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-[24px] font-semibold text-white mb-4 lg:mb-[16px]">
            Top criadores
          </h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:mx-0">
            <div className="flex gap-4 lg:gap-[16px] px-4 sm:px-6 lg:px-0">
              {creators.map((c) => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Em alta agora section */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-[24px] font-semibold text-white mb-4 lg:mb-[16px]">
            Em alta agora
          </h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:mx-0">
            <div className="flex gap-4 lg:gap-[16px] px-4 sm:px-6 lg:px-0">
              {tracksEmAlta.map((t) => (
                <MusicCard key={t.id} track={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Lançamentos recentes section */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-[24px] font-semibold text-white mb-4 lg:mb-[16px]">
            Lançamentos recentes
          </h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:mx-0">
            <div className="flex gap-4 lg:gap-[16px] px-4 sm:px-6 lg:px-0">
              {tracksRecentes.map((t) => (
                <MusicCard key={t.id} track={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Destaques da semana section */}
        <section>
          <h2 className="text-lg sm:text-xl lg:text-[24px] font-semibold text-white mb-4 lg:mb-[16px]">
            Destaques da semana
          </h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 lg:mx-0">
            <div className="flex gap-4 lg:gap-[16px] px-4 sm:px-6 lg:px-0">
              {tracksDestaques.map((t) => (
                <MusicCard key={t.id} track={t} size="large" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}