import { useState, useMemo, useEffect } from "react";
import { SearchInput } from "./ui/SearchInput";
import { CategoryChip } from "./ui/CategoryChip";
import { MusicCard } from "./ui/MusicCard";
import { Track } from "../context/MusicContext";
import { Button } from "./ui/button";

// Importando imagens do Figma
import imgSynthwave from "@/assets/figma/97e074a98bd267b7e793590cf7916ed3199aac5e.png";
import imgAISerenade from "@/assets/figma/2b9669d4caae7e0131df172e452df996b054e84b.png";
import imgWhispers from "@/assets/figma/a5fb4564c109688e9da55ace27c2a57ec585d299.png";
import imgDigital from "@/assets/figma/88af55817e06e5beb26b97b8b37558d42203bf97.png";
import imgNeon from "@/assets/figma/ce2dd23a0f452a4c221c69234eca8c8131a0c05f.png";
import imgHarmony from "@/assets/figma/29b52570151c1055b78e8e5043802cd321b71944.png";
import imgElectric from "@/assets/figma/7a1a7f8b9a7226c2a844698d749a32cccada90ef.png";
import imgSynthwave2 from "@/assets/figma/f62715eb368a05e886636fc759986135921e464c.png";
import imgAISerenade2 from "@/assets/figma/51e24026833e73d23a99e5a06db5cc02e7cd5bf4.png";
import imgWhispers2 from "@/assets/figma/718dc7fe8ba681a3ad6c3a7945ac9998226d79a9.png";
import imgDigital2 from "@/assets/figma/d1080ae086a5197e54916eaed69aefa821db4ca8.png";
import imgNeon2 from "@/assets/figma/065a523c405e679bd35be6ccc6f70c9e126f4630.png";
import imgHarmony2 from "@/assets/figma/c3f9d43223fb6fdb376bb5b0aef8de0386c02dcc.png";
import imgElectric2 from "@/assets/figma/b6fa0d201f9ec64c5f0a983eee403861c850233c.png";
import imgExtra1 from "@/assets/figma/48a6e9ae994c060da347e19294ad8e9f9fa5358c.png";
import imgExtra2 from "@/assets/figma/58706e9400e2c6ab2574b5c5631507b7456c209e.png";
import imgExtra3 from "@/assets/figma/e281a7b5e725da91a450f9b1f019eff8fc39c941.png";
import imgExtra4 from "@/assets/figma/7972b3bd4358bcce33ff27707690626714be9283.png";
import imgExtra5 from "@/assets/figma/f256cdc56e3a87dafde6b39922b2b63d32b719af.png";

const AUDIO_URL = "https://framerusercontent.com/assets/09hPgrhAGuCOXh9suukXzyi8k.mp3";

// Database de músicas com categorias
const allTracks: (Track & { category: string })[] = [
  { id: "d1", title: "Synthwave Dreams", artist: "@SynthMasterAI", image: imgSynthwave, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d2", title: "AI Serenade", artist: "@MelodyMaker", image: imgAISerenade, audioUrl: AUDIO_URL, category: "Rock" },
  { id: "d3", title: "Whispers of the Future", artist: "@FutureSound", image: imgWhispers, audioUrl: AUDIO_URL, category: "Gospel" },
  { id: "d4", title: "Digital Echo", artist: "@EchoAI", image: imgDigital, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d5", title: "Neon Nights", artist: "@NeonCreator", image: imgNeon, audioUrl: AUDIO_URL, category: "Samba" },
  { id: "d6", title: "Harmony of Ones and Zeros", artist: "@CodeComposer", image: imgHarmony, audioUrl: AUDIO_URL, category: "Pagode" },
  { id: "d7", title: "Electric Emotions", artist: "@EmotionEngine", image: imgElectric, audioUrl: AUDIO_URL, category: "MPB" },
  { id: "d8", title: "Cosmic Journey", artist: "@SynthMasterAI", image: imgSynthwave2, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d9", title: "Neon Dreams", artist: "@MelodyMaker", image: imgAISerenade2, audioUrl: AUDIO_URL, category: "Rock" },
  { id: "d10", title: "Future Whispers", artist: "@FutureSound", image: imgWhispers2, audioUrl: AUDIO_URL, category: "Gospel" },
  { id: "d11", title: "Digital Horizon", artist: "@EchoAI", image: imgDigital2, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d12", title: "Night Glow", artist: "@NeonCreator", image: imgNeon2, audioUrl: AUDIO_URL, category: "Samba" },
  { id: "d13", title: "Binary Symphony", artist: "@CodeComposer", image: imgHarmony2, audioUrl: AUDIO_URL, category: "Clássico" },
  { id: "d14", title: "Voltage Vibes", artist: "@EmotionEngine", image: imgElectric2, audioUrl: AUDIO_URL, category: "Emo" },
  { id: "d15", title: "Stellar Sounds", artist: "@SynthMasterAI", image: imgExtra1, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d16", title: "AI Ballad", artist: "@MelodyMaker", image: imgExtra2, audioUrl: AUDIO_URL, category: "Rock" },
  { id: "d17", title: "Quantum Beat", artist: "@FutureSound", image: imgExtra3, audioUrl: AUDIO_URL, category: "Gospel" },
  { id: "d18", title: "Cyber Pulse", artist: "@EchoAI", image: imgExtra4, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d19", title: "Neon Paradise", artist: "@NeonCreator", image: imgExtra5, audioUrl: AUDIO_URL, category: "Samba" },
  { id: "d20", title: "Code Symphony", artist: "@CodeComposer", image: imgSynthwave, audioUrl: AUDIO_URL, category: "Clássico" },
  { id: "d21", title: "Electric Dream", artist: "@EmotionEngine", image: imgAISerenade, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d22", title: "Cosmic Melody", artist: "@SynthMasterAI", image: imgWhispers, audioUrl: AUDIO_URL, category: "Rock" },
  { id: "d23", title: "Future Echo", artist: "@MelodyMaker", image: imgDigital, audioUrl: AUDIO_URL, category: "Gospel" },
  { id: "d24", title: "Digital Paradise", artist: "@FutureSound", image: imgNeon, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d25", title: "Night Symphony", artist: "@EchoAI", image: imgHarmony, audioUrl: AUDIO_URL, category: "Samba" },
  { id: "d26", title: "Binary Dreams", artist: "@NeonCreator", image: imgElectric, audioUrl: AUDIO_URL, category: "Pagode" },
  { id: "d27", title: "Voltage Nights", artist: "@CodeComposer", image: imgSynthwave2, audioUrl: AUDIO_URL, category: "MPB" },
  { id: "d28", title: "Stellar Journey", artist: "@EmotionEngine", image: imgAISerenade2, audioUrl: AUDIO_URL, category: "Clássico" },
  { id: "d29", title: "AI Dreams", artist: "@SynthMasterAI", image: imgWhispers2, audioUrl: AUDIO_URL, category: "Emo" },
  { id: "d30", title: "Quantum Symphony", artist: "@MelodyMaker", image: imgDigital2, audioUrl: AUDIO_URL, category: "Eletrônica" },
  { id: "d31", title: "Cyber Dreams", artist: "@FutureSound", image: imgNeon2, audioUrl: AUDIO_URL, category: "Rock" },
  { id: "d32", title: "Neon Journey", artist: "@EchoAI", image: imgHarmony2, audioUrl: AUDIO_URL, category: "Gospel" },
];

const categories = ["Todos", "Rock", "Gospel", "Eletrônica", "Samba", "Pagode", "MPB", "Clássico", "Emo"];

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 10v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

interface DiscoverPageProps {
  externalSearchQuery?: string;
}

export function DiscoverPage({ externalSearchQuery = "" }: DiscoverPageProps) {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Sync external search query (from Navbar debounced search)
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  // Filtrar músicas baseado na busca e categoria
  const filteredTracks = useMemo(() => {
    let result = allTracks;

    // Filtrar por categoria
    if (activeCategory !== "Todos") {
      result = result.filter((track) => track.category === activeCategory);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-[37px] py-6 lg:py-8">
        {/* Title and subtitle */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mb-2">Descobrir</h1>
          <p className="text-[#a19a9b] text-sm sm:text-base">
            Encontre sua próxima música criada com AI
          </p>
        </div>

        {/* Search input dentro do conteúdo */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar músicas ou artistas"
          />
        </div>

        {hasSearchQuery ? (
          // VARIANT: Search Results (List view)
          <div className="space-y-4">
            <p className="text-[#a19a9b] text-sm mb-4">
              {filteredTracks.length} resultado{filteredTracks.length !== 1 ? "s" : ""} encontrado{filteredTracks.length !== 1 ? "s" : ""}
            </p>
            {filteredTracks.length > 0 ? (
              <div className="space-y-2">
                {filteredTracks.map((track) => (
                  <MusicCard key={track.id} track={track} variant="list" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-[#a19a9b] text-lg mb-4">
                  Nenhum resultado encontrado
                </p>
                <p className="text-[#5b4f51] text-sm">
                  Tente buscar por outro termo
                </p>
              </div>
            )}

            {filteredTracks.length > 0 && (
              <div className="flex justify-center pt-8">
                <Button variant="outline">Carregar mais</Button>
              </div>
            )}
          </div>
        ) : (
          // VARIANT: Default (Grid view with categories)
          <>
            {/* Categories */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              <span className="text-[#a19a9b] text-sm font-semibold shrink-0">
                Categorias
              </span>
              <div className="flex items-center gap-2 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {categories.map((category) => (
                  <CategoryChip
                    key={category}
                    label={category}
                    active={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  />
                ))}
              </div>
              <button className="flex items-center gap-2 text-[#a19a9b] hover:text-white transition-colors duration-150 shrink-0">
                <ChevronDownIcon />
              </button>
            </div>

            {/* Music Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {filteredTracks.map((track) => (
                <MusicCard key={track.id} track={track} variant="grid" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}