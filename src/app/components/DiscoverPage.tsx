import { useState, useMemo, useEffect } from "react";
import { SearchInput } from "./ui/SearchInput";
import { CategoryChip } from "./ui/CategoryChip";
import { MusicCard } from "./ui/MusicCard";
import { Button } from "./ui/button";
import { useAppData } from "@/context/AppDataContext";
import { DISCOVER_CATEGORIES } from "@/data/mock";

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
  const { discoverTracks } = useAppData();
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const filteredTracks = useMemo(() => {
    let result = discoverTracks;

    if (activeCategory !== "Todos") {
      result = result.filter((track) => track.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, activeCategory, discoverTracks]);

  const visibleTracks = filteredTracks.slice(0, visibleCount);
  const hasSearchQuery = searchQuery.trim().length > 0;

  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-[37px] py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mb-2">Descobrir</h1>
          <p className="text-[#a19a9b] text-sm sm:text-base">Encontre sua próxima música criada com AI</p>
        </div>

        <div className="mb-6">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Buscar músicas ou artistas" />
        </div>

        {hasSearchQuery ? (
          <div className="space-y-4">
            <p className="text-[#a19a9b] text-sm mb-4">
              {filteredTracks.length} resultado{filteredTracks.length !== 1 ? "s" : ""} encontrado{filteredTracks.length !== 1 ? "s" : ""}
            </p>
            {filteredTracks.length > 0 ? (
              <div className="space-y-2">
                {visibleTracks.map((track) => (
                  <MusicCard key={track.id} track={track} variant="list" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-[#a19a9b] text-lg mb-4">Nenhum resultado encontrado</p>
                <p className="text-[#5b4f51] text-sm">Tente buscar por outro termo</p>
              </div>
            )}
            {visibleCount < filteredTracks.length && (
              <div className="flex justify-center pt-8">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + 24)}>
                  Carregar mais
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              <span className="text-[#a19a9b] text-sm font-semibold shrink-0">Categorias</span>
              <div className="flex items-center gap-2 flex-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {DISCOVER_CATEGORIES.map((category) => (
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {visibleTracks.map((track) => (
                <MusicCard key={track.id} track={track} variant="grid" />
              ))}
            </div>

            {visibleCount < filteredTracks.length && (
              <div className="flex justify-center pt-8">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + 24)}>
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
