import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Check, Play, Star, Clock, Tv2, Globe2 } from "lucide-react";
import {
  TMDB_IMG,
  showDetails,
  seasonDetails,
  COUNTRY_INFO,
  inferTropes,
  calcBingeHours,
  pacingLabel,
} from "@/lib/tmdb";
import { DramaRow } from "@/components/DramaRow";
import { SafeImage } from "@/components/SafeImage";
import { CommentThread } from "@/components/CommentThread";
import type { TMDBShowDetail } from "@/lib/tmdb-types";

const STREAMING = [
  { name: "Viki", url: "https://www.viki.com" },
  { name: "Netflix", url: "https://www.netflix.com" },
  { name: "Viu", url: "https://www.viu.com" },
];

const DramaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dramaId = Number(id);
  const [watchlisted, setWatchlisted] = useState(false);
  const [watched, setWatched] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(true);

  const detailQuery = useQuery({
    queryKey: ["drama", dramaId],
    queryFn: () => showDetails(dramaId),
    enabled: Number.isFinite(dramaId),
    staleTime: 10 * 60_000,
  });

  const data = detailQuery.data as
    | (TMDBShowDetail & {
        credits: { cast: { id: number; name: string; character: string; profile_path: string | null }[] };
        similar: { results: any[] };
      })
    | undefined;

  const seasonNum = data?.seasons?.find((s) => s.season_number > 0)?.season_number ?? 1;
  const epsQuery = useQuery({
    queryKey: ["season", dramaId, seasonNum],
    queryFn: () => seasonDetails(dramaId, seasonNum),
    enabled: !!data && Number.isFinite(seasonNum),
  });

  if (detailQuery.isLoading || !data) {
    return <DetailSkeleton />;
  }

  const country = data.origin_country?.[0];
  const countryInfo = country ? COUNTRY_INFO[country as keyof typeof COUNTRY_INFO] : null;
  const genreNames = data.genres.map((g) => g.name);
  const tropes = inferTropes({ name: data.name, original_name: data.original_name, overview: data.overview }, genreNames, 5);
  const runtime = data.episode_run_time?.[0] ?? 60;
  const binge = calcBingeHours(data.number_of_episodes, runtime);

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
        <SafeImage
          src={TMDB_IMG(data.backdrop_path, "original")}
          alt=""
          className="h-full w-full object-cover blur-sm scale-110 opacity-60"
          fallbackClassName="h-full w-full bg-gradient-to-br from-primary/30 to-secondary/30"
        />
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
        <Link to="/" className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 text-sm backdrop-blur hover:bg-background/80 transition-smooth">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      <div className="relative z-10 -mt-40 px-4 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]">
          {/* Poster */}
          <div className="mx-auto md:mx-0 w-44 md:w-full overflow-hidden rounded-2xl card-shadow ring-1 ring-border">
            <div className="aspect-[2/3] w-full">
              <SafeImage
                src={TMDB_IMG(data.poster_path, "w500")}
                alt={data.name}
                className="h-full w-full object-cover"
                fallbackLabel={data.name}
                fallbackClassName="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/30 via-card to-secondary/30 text-center text-sm font-semibold p-4"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            {countryInfo && (
              <div className="text-xs font-semibold uppercase tracking-wider text-primary-glow">
                {countryInfo.flag} {countryInfo.label}
                {data.networks?.[0] && <> · {data.networks[0].name}</>}
                {" · "}{data.first_air_date?.slice(0, 4)} · {data.number_of_episodes} eps · {data.status}
              </div>
            )}
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">{data.name}</h1>
            {data.original_name && data.original_name !== data.name && (
              <p className="mt-1 text-sm text-muted-foreground">{data.original_name}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1 font-semibold text-yellow-400">
                <Star className="h-4 w-4 fill-current" strokeWidth={0} /> {data.vote_average.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({data.vote_count.toLocaleString()} ratings)</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> ~{binge}h to binge</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Tv2 className="h-3.5 w-3.5" /> {runtime}min eps</span>
              <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-xs">{pacingLabel(data.number_of_episodes)}</span>
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {data.genres.map((g) => (
                <span key={g.id} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/80">{g.name}</span>
              ))}
            </div>

            {/* Tropes */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tropes.map((t) => (
                <Link key={t.id} to={`/tropes/${t.id}`} className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary-glow ring-1 ring-primary/30 hover:bg-primary/25 transition-smooth">
                  {t.emoji} {t.label}
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mt-5">
              <button onClick={() => setShowSynopsis((s) => !s)} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-smooth">
                {showSynopsis ? "Hide synopsis ▲" : "Show synopsis ▼"}
              </button>
              {showSynopsis && (
                <p className="mt-2 max-w-3xl text-sm sm:text-base leading-relaxed text-foreground/85 animate-fade-in">
                  {data.overview || "No synopsis available."}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
                <Play className="h-4 w-4 fill-current" strokeWidth={0} /> Watch Now
              </button>
              <button
                onClick={() => setWatchlisted((v) => !v)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-smooth ${
                  watchlisted ? "border-primary bg-primary/15 text-primary-glow" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {watchlisted ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {watchlisted ? "In Watchlist" : "Watchlist"}
              </button>
              <button
                onClick={() => setWatched((v) => !v)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-smooth ${
                  watched ? "border-secondary bg-secondary/15 text-secondary" : "border-border bg-card hover:border-secondary/40"
                }`}
              >
                <Check className="h-4 w-4" /> {watched ? "Watched" : "Mark watched"}
              </button>
            </div>

            {/* Where to watch */}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Where to watch</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {STREAMING.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary/40 transition-smooth">
                    <Globe2 className="h-3 w-3" /> {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cast */}
        {data.credits?.cast?.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 px-0 text-lg font-bold tracking-tight">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {data.credits.cast.slice(0, 12).map((c) => (
                <div key={c.id} className="w-28 shrink-0">
                  <div className="aspect-[2/3] overflow-hidden rounded-xl bg-card ring-1 ring-border">
                    <SafeImage
                      src={TMDB_IMG(c.profile_path, "w300")}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      fallbackClassName="flex h-full w-full items-center justify-center text-2xl bg-gradient-to-br from-primary/20 to-secondary/20"
                      fallbackLabel="🎭"
                    />
                  </div>
                  <div className="mt-2 text-xs font-semibold leading-tight">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Episodes */}
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-bold tracking-tight">Episodes</h2>
          {epsQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {epsQuery.data?.episodes?.slice(0, 12).map((ep) => (
                <EpisodeRow key={ep.id} ep={ep} dramaId={dramaId} seasonNum={seasonNum} />
              ))}
            </div>
          )}
        </section>

        {/* Drama-level discussion */}
        <section className="mt-12">
          <CommentThread
            threadId={`drama:${dramaId}`}
            title={`${data.name} — Overall Discussion`}
            emptyHint="Share your thoughts on the whole drama. No major spoilers without the toggle. 💜"
          />
        </section>

        {/* Similar */}
        {data.similar?.results?.length > 0 && (
          <div className="mt-12 -mx-4 lg:-mx-12">
            <DramaRow title="Similar Dramas" emoji="✨" shows={data.similar.results.slice(0, 12)} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ----- Episode row with collapsible discussion ----- */
const EpisodeRow = ({
  ep, dramaId, seasonNum,
}: {
  ep: { id: number; episode_number: number; season_number?: number; name: string; overview: string; air_date: string; still_path: string | null };
  dramaId: number;
  seasonNum: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card transition-smooth hover:border-primary/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
          <SafeImage
            src={TMDB_IMG(ep.still_path, "w300")}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full bg-gradient-to-br from-primary/30 to-secondary/30"
            fallbackLabel=""
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            EP {ep.episode_number} · {ep.air_date || "TBA"}
          </div>
          <div className="truncate font-semibold">{ep.name}</div>
          <div className="line-clamp-1 text-xs text-muted-foreground">{ep.overview || "No description."}</div>
        </div>
        <div className="shrink-0 self-center text-[11px] font-semibold text-primary-glow">
          {open ? "Hide ▲" : "Discuss ▼"}
        </div>
      </button>
      {open && (
        <div className="border-t border-border/60 p-3 sm:p-4 animate-fade-in">
          <CommentThread
            threadId={`ep:${dramaId}:${seasonNum}:${ep.episode_number}`}
            title={`EP ${ep.episode_number} Discussion`}
            spoilerByDefault
            emptyHint="First reaction to this episode? Spoilers are blurred by default."
          />
        </div>
      )}
    </div>
  );
};

const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[44vh] w-full bg-card" />
    <div className="px-4 py-6 lg:px-12">
      <div className="h-8 w-2/3 rounded bg-card" />
      <div className="mt-3 h-4 w-1/3 rounded bg-card" />
      <div className="mt-6 h-24 w-full max-w-3xl rounded bg-card" />
    </div>
  </div>
);

export default DramaDetail;
