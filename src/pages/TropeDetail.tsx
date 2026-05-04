import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { TROPE_BY_ID } from "@/data/tropes";
import { discoverByCountry, showHasTrope } from "@/lib/tmdb";
import { DramaCard, DramaCardSkeleton } from "@/components/DramaCard";
import type { TMDBShow } from "@/lib/tmdb-types";

const TropeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trope = id ? TROPE_BY_ID[id] : undefined;

  const query = useQuery({
    queryKey: ["trope-shows", id],
    enabled: !!trope,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      // Pull a wide net across the major drama-producing countries, then filter
      const results = await Promise.all([
        discoverByCountry("KR", { minVotes: 50 }),
        discoverByCountry("KR", { minVotes: 50, page: 2 }),
        discoverByCountry("CN", { minVotes: 30 }),
        discoverByCountry("JP", { minVotes: 20 }),
        discoverByCountry("TW", { minVotes: 15 }),
        discoverByCountry("TH", { minVotes: 15 }),
      ]);
      const all: TMDBShow[] = results.flatMap((r) => r.results);
      const dedup = new Map<number, TMDBShow>();
      for (const s of all) dedup.set(s.id, s);
      const list = Array.from(dedup.values());
      return list.filter((s) => showHasTrope(s, id!));
    },
  });

  if (!trope) {
    return (
      <div className="px-4 py-16 text-center lg:px-12">
        <h1 className="text-2xl font-bold">Trope not found</h1>
        <Link to="/tropes" className="mt-4 inline-block text-sm text-primary hover:text-primary-glow">← Back to tropes</Link>
      </div>
    );
  }

  const shows = query.data ?? [];

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div className={`relative h-56 w-full overflow-hidden bg-gradient-to-br ${trope.gradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-8 lg:px-12">
          <Link to="/tropes" className="mb-3 inline-flex w-max items-center gap-2 rounded-full bg-background/40 px-3 py-1.5 text-xs font-medium backdrop-blur hover:bg-background/60 transition-smooth">
            <ArrowLeft className="h-3.5 w-3.5" /> All tropes
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-5xl drop-shadow-lg" aria-hidden>{trope.emoji}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow">{trope.label}</h1>
              <p className="mt-1 max-w-xl text-sm text-white/85">{trope.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 lg:px-12">
        <div className="mb-5 text-sm text-muted-foreground">
          {query.isLoading ? "Loading dramas..." : `${shows.length} ${shows.length === 1 ? "drama" : "dramas"} found`}
        </div>

        {query.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => <DramaCardSkeleton key={i} />)}
          </div>
        ) : shows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <div className="text-sm text-muted-foreground">No dramas matched this trope yet — our taste detector keeps learning.</div>
            <Link to="/tropes" className="mt-3 inline-block text-sm text-primary hover:text-primary-glow">Browse other tropes →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {shows.slice(0, 60).map((s, i) => (
              <DramaCard key={s.id} show={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TropeDetail;
