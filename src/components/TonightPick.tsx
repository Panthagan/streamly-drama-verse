import { Link } from "react-router-dom";
import { Sparkles, Play, Star } from "lucide-react";
import { TMDB_IMG, inferTropes, getCountryFromShow, COUNTRY_INFO } from "@/lib/tmdb";
import { SafeImage } from "@/components/SafeImage";
import { MOODS } from "@/data/moods";
import type { TMDBShow } from "@/lib/tmdb-types";

interface Props {
  show?: TMDBShow;
  moodId: string;
}

export const TonightPick = ({ show, moodId }: Props) => {
  const mood = MOODS.find((m) => m.id === moodId) ?? MOODS[0];

  return (
    <section className="px-4 lg:px-8">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary-glow" />
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          Tonight's pick for you
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            {mood.emoji} {mood.label}
          </span>
        </h2>
      </div>

      {!show ? (
        <div className="h-44 animate-pulse rounded-2xl bg-card" />
      ) : (
        <Link
          to={`/drama/${show.id}`}
          className="group relative block overflow-hidden rounded-2xl border border-border bg-card card-shadow ring-1 ring-primary/10 hover:border-primary/40 transition-smooth"
        >
          <div className="absolute inset-0 -z-0">
            <SafeImage
              src={TMDB_IMG(show.backdrop_path, "w780") || TMDB_IMG(show.poster_path, "w500")}
              alt=""
              className="h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-background/50 ring-1 ring-border">
              <SafeImage
                src={TMDB_IMG(show.poster_path, "w300")}
                alt={show.name}
                fallbackLabel={show.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-glow">
                Curated for your mood
              </p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{show.name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-yellow-400">
                  <Star className="h-3 w-3 fill-current" strokeWidth={0} /> {show.vote_average.toFixed(1)}
                </span>
                {(() => {
                  const c = getCountryFromShow(show);
                  return c ? <span>{COUNTRY_INFO[c].flag} {COUNTRY_INFO[c].label}</span> : null;
                })()}
                <span>{show.first_air_date?.slice(0, 4) || "—"}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{show.overview}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {inferTropes(show, [], 2).map((t) => (
                  <span key={t.id} className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary-glow ring-1 ring-primary/30">
                    {t.emoji} {t.label}
                  </span>
                ))}
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow">
                  <Play className="h-3 w-3 fill-current" strokeWidth={0} /> Start tonight
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}
    </section>
  );
};
