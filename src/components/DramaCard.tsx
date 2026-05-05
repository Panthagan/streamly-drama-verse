import { Link, useNavigate } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { TMDB_IMG, getCountryFromShow, COUNTRY_INFO, inferTropes } from "@/lib/tmdb";
import { SafeImage } from "@/components/SafeImage";
import type { TMDBShow } from "@/lib/tmdb-types";

interface Props {
  show: TMDBShow;
  index?: number;
  size?: "default" | "sm";
}

export const DramaCard = ({ show, index = 0, size = "default" }: Props) => {
  const navigate = useNavigate();
  const country = getCountryFromShow(show);
  const tropes = inferTropes(show, [], 2);
  const year = show.first_air_date?.slice(0, 4) || "—";
  const poster = TMDB_IMG(show.poster_path, "w500");

  const widthClass = size === "sm" ? "w-32 sm:w-36" : "w-40 sm:w-44 md:w-48";

  return (
    <Link
      to={`/drama/${show.id}`}
      className={`group relative shrink-0 snap-start ${widthClass} animate-fade-in-up`}
      style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-card card-shadow ring-1 ring-border/50">
        <SafeImage
          src={poster}
          alt={show.name}
          loading="lazy"
          fallbackLabel={show.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {/* badges */}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1.5">
          {country && (
            <span className="rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur">
              {COUNTRY_INFO[country].flag}
            </span>
          )}
        </div>
        <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur">
          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" strokeWidth={0} />
          {show.vote_average.toFixed(1)}
        </div>

        {/* hover play */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <Play className="h-5 w-5 fill-white text-white" strokeWidth={0} />
          </span>
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-sm font-semibold leading-tight">{show.name}</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{year}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {tropes.map((t) => (
            <span
              key={t.id}
              role="link"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/tropes/${t.id}`);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/tropes/${t.id}`);
                }
              }}
              className="cursor-pointer rounded-full border border-border bg-card/80 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-primary-glow transition-smooth"
            >
              {t.emoji} {t.label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export const DramaCardSkeleton = ({ size = "default" }: { size?: "default" | "sm" }) => {
  const widthClass = size === "sm" ? "w-32 sm:w-36" : "w-40 sm:w-44 md:w-48";
  return (
    <div className={`shrink-0 ${widthClass}`}>
      <div className="aspect-[2/3] animate-pulse rounded-xl bg-card" />
      <div className="mt-2.5 h-3 w-3/4 animate-pulse rounded bg-card" />
      <div className="mt-1.5 h-2 w-1/3 animate-pulse rounded bg-card" />
    </div>
  );
};
