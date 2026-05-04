import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { DramaCard, DramaCardSkeleton } from "./DramaCard";
import type { TMDBShow } from "@/lib/tmdb-types";

interface Props {
  title: string;
  emoji?: string;
  shows?: TMDBShow[];
  loading?: boolean;
  emptyHint?: string;
}

export const DramaRow = ({ title, emoji, shows, loading, emptyHint }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollMore = () => {
    ref.current?.scrollBy({ left: ref.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <div className="mb-3 flex items-end justify-between px-4 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </h2>
        <button
          onClick={scrollMore}
          className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth"
        >
          See more <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative">
        <div
          ref={ref}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:px-8 scrollbar-hide scroll-smooth"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <DramaCardSkeleton key={i} />)
            : shows?.length
              ? shows.map((s, i) => <DramaCard key={s.id} show={s} index={i} />)
              : (
                <div className="text-sm text-muted-foreground py-8">{emptyHint || "Nothing here yet."}</div>
              )}
          <div className="shrink-0 w-2" />
        </div>
        {/* fade right */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-card-fade sm:block" />
      </div>
    </section>
  );
};
