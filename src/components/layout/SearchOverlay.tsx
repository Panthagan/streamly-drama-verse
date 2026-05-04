import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchShows, TMDB_IMG, getCountryFromShow, COUNTRY_INFO } from "@/lib/tmdb";

export const SearchOverlay = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchShows(q),
    enabled: q.trim().length > 1,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) setQ("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-4 pt-24">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 card-shadow">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dramas, titles, casts..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => onOpenChange(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-smooth">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-2xl">
          {isFetching && <div className="px-2 py-6 text-sm text-muted-foreground">Searching...</div>}
          {!isFetching && q.length > 1 && data?.results.length === 0 && (
            <div className="px-2 py-6 text-sm text-muted-foreground">No results for "{q}"</div>
          )}
          <ul className="space-y-2">
            {data?.results.slice(0, 10).map((s) => {
              const country = getCountryFromShow(s);
              return (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/drama/${s.id}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-card/60 p-2 text-left hover:border-border hover:bg-card transition-smooth"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {s.poster_path ? (
                        <img src={TMDB_IMG(s.poster_path, "w200") ?? ""} alt={s.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/30 to-secondary/30" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {country && `${COUNTRY_INFO[country].flag} `}
                        {s.first_air_date?.slice(0, 4) || "—"} · ⭐ {s.vote_average.toFixed(1)}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
