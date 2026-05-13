import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { discoverByCountry, COUNTRY_INFO } from "@/lib/tmdb";
import { DramaCard, DramaCardSkeleton } from "@/components/DramaCard";
import { Compass } from "lucide-react";

const COUNTRIES = ["KR", "CN", "JP", "TW", "TH"] as const;

const Discover = () => {
  const [country, setCountry] = useState<typeof COUNTRIES[number]>("KR");
  const { data, isLoading } = useQuery({
    queryKey: ["discover", country],
    queryFn: () => discoverByCountry(country, { minVotes: 40 }).then((d) => d.results),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="px-4 py-8 lg:px-8 lg:py-10 animate-fade-in">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Compass className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow">Discover</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Browse by country</h1>
        </div>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
        {COUNTRIES.map((c) => {
          const info = COUNTRY_INFO[c];
          const active = c === country;
          return (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                active
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="mr-1.5">{info.flag}</span>
              {info.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <DramaCardSkeleton key={i} />)
          : data?.map((s, i) => <DramaCard key={s.id} show={s} index={i} />)}
      </div>
    </div>
  );
};

export default Discover;
