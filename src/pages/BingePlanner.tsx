import { useQuery } from "@tanstack/react-query";
import { trendingDramas, TMDB_IMG } from "@/lib/tmdb";
import { SafeImage } from "@/components/SafeImage";
import { CalendarClock, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const PROGRESS = [
  { eps: 16, watched: 11, hoursLeft: 5 },
  { eps: 12, watched: 4, hoursLeft: 8 },
  { eps: 20, watched: 18, hoursLeft: 2 },
];

const BingePlanner = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["binge-seed"],
    queryFn: () => trendingDramas("KR").then((d) => d.results.slice(0, 3)),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="px-4 py-8 lg:px-8 lg:py-10 animate-fade-in">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <CalendarClock className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow">Binge planner</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">In progress</h1>
        </div>
      </header>

      <ul className="space-y-4">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="h-28 animate-pulse rounded-2xl bg-card" />
        ))}
        {data?.map((s, i) => {
          const p = PROGRESS[i] ?? PROGRESS[0];
          const pct = Math.round((p.watched / p.eps) * 100);
          return (
            <li key={s.id} className="rounded-2xl border border-border bg-card p-4 card-shadow animate-fade-in-up">
              <Link to={`/drama/${s.id}`} className="flex items-center gap-4">
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
                  <SafeImage src={TMDB_IMG(s.poster_path, "w200")} alt={s.name} fallbackLabel={s.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold">{s.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Ep {p.watched} of {p.eps} · <Clock className="inline h-3 w-3" /> ~{p.hoursLeft}h left
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
                    <div className="h-full rounded-full bg-gradient-primary shadow-glow" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11px] font-medium text-primary-glow">{pct}% complete</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-muted-foreground">
        Example progress shown — your real progress will sync once accounts are live.
      </p>
    </div>
  );
};

export default BingePlanner;
