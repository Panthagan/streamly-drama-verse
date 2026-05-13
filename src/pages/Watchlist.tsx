import { useQuery } from "@tanstack/react-query";
import { trendingDramas } from "@/lib/tmdb";
import { DramaCard, DramaCardSkeleton } from "@/components/DramaCard";
import { Bookmark } from "lucide-react";

const Watchlist = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["watchlist-seed"],
    queryFn: () => trendingDramas("KR").then((d) => d.results.slice(0, 4)),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="px-4 py-8 lg:px-8 lg:py-10 animate-fade-in">
      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Bookmark className="h-5 w-5 fill-white text-white" strokeWidth={0} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow">My watchlist</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved for later</h1>
        </div>
      </header>

      <div className="flex flex-wrap gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <DramaCardSkeleton key={i} />)
          : data?.map((s, i) => <DramaCard key={s.id} show={s} index={i} />)}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        These are example saves to show how your watchlist will look — sign in (coming soon) to save your own.
      </p>
    </div>
  );
};

export default Watchlist;
