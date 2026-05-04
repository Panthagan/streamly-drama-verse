import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Star, Clock, Tv2 } from "lucide-react";
import {
  TMDB_IMG,
  getCountryFromShow,
  COUNTRY_INFO,
  inferTropes,
  calcBingeHours,
  pacingLabel,
} from "@/lib/tmdb";
import type { TMDBShow } from "@/lib/tmdb-types";

interface Props {
  shows: TMDBShow[];
  loading?: boolean;
}

export const Hero = ({ shows, loading }: Props) => {
  const [idx, setIdx] = useState(0);
  const items = shows.slice(0, 5);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (loading || items.length === 0) {
    return (
      <div className="relative h-[60vh] min-h-[420px] w-full animate-pulse overflow-hidden bg-gradient-to-br from-card via-background to-card lg:h-[65vh]">
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] min-h-[460px] w-full overflow-hidden lg:h-[68vh]">
      {items.map((show, i) => {
        const backdrop = TMDB_IMG(show.backdrop_path, "original") || TMDB_IMG(show.poster_path, "w780");
        return (
          <div
            key={show.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === idx ? 1 : 0 }}
            aria-hidden={i !== idx}
          >
            {backdrop ? (
              <img src={backdrop} alt="" className="h-full w-full object-cover object-top" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/40 to-secondary/40" />
            )}
            <div className="absolute inset-0 bg-gradient-hero-overlay" />
            <div className="absolute inset-0 bg-gradient-side-overlay" />
          </div>
        );
      })}

      {/* foreground */}
      <div key={items[idx].id} className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 lg:px-12 lg:pb-16 animate-fade-in">
        <HeroContent show={items[idx]} />
      </div>

      {/* dots */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-1.5 bg-foreground/40 hover:bg-foreground/70"}`}
          />
        ))}
      </div>
    </div>
  );
};

const HeroContent = ({ show }: { show: TMDBShow }) => {
  const country = getCountryFromShow(show);
  const tropes = inferTropes(show, [], 2);
  const year = show.first_air_date?.slice(0, 4) || "—";
  // We don't have episode count from discover endpoint — estimate based on country.
  const estEps = country === "KR" ? 16 : country === "CN" ? 36 : country === "JP" ? 10 : 12;
  const binge = calcBingeHours(estEps, 60);

  return (
    <div className="max-w-2xl">
      {country && (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-glow">
          <span>{COUNTRY_INFO[country].flag}</span>
          <span>{COUNTRY_INFO[country].label} · Featured</span>
        </div>
      )}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
        {show.name}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-foreground/80">
        <span className="flex items-center gap-1 font-semibold text-yellow-400">
          <Star className="h-4 w-4 fill-current" strokeWidth={0} /> {show.vote_average.toFixed(1)}
        </span>
        <span>{year}</span>
        <span className="flex items-center gap-1"><Tv2 className="h-3.5 w-3.5" /> ~{estEps} eps</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{binge}h to binge</span>
        <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-xs">{pacingLabel(estEps)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tropes.map((t) => (
          <span key={t.id} className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary-glow ring-1 ring-primary/30">
            {t.emoji} {t.label}
          </span>
        ))}
      </div>

      <p className="mt-4 line-clamp-3 max-w-xl text-sm sm:text-base text-foreground/80">
        {show.overview || "An unmissable drama waiting to sweep you away."}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/drama/${show.id}`}
          className="flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
        >
          <Play className="h-4 w-4 fill-current" strokeWidth={0} />
          Watch Now
        </Link>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-smooth hover:border-primary/50 hover:bg-card">
          <Plus className="h-4 w-4" />
          Watchlist
        </button>
      </div>
    </div>
  );
};
