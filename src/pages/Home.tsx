import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { MoodFilter, TropeFilter } from "@/components/MoodFilter";
import { ActiveFilterBar } from "@/components/ActiveFilterBar";
import { DramaRow } from "@/components/DramaRow";
import { TonightPick } from "@/components/TonightPick";
import {
  trendingDramas,
  discoverByCountry,
  newThisMonth,
  allTimeClassics,
  japaneseAnime,
  showHasTrope,
} from "@/lib/tmdb";
import { useFilters } from "@/hooks/use-filters";
import { MOODS } from "@/data/moods";
import type { TMDBShow } from "@/lib/tmdb-types";

const useDramaList = (key: string, fn: () => Promise<{ results: TMDBShow[] }>) =>
  useQuery({
    queryKey: ["dramas", key],
    queryFn: () => fn().then((d) => d.results),
    staleTime: 5 * 60_000,
  });

const Home = () => {
  const { mood, trope } = useFilters();
  const moodObj = MOODS.find((m) => m.id === mood) ?? MOODS[0];

  const trending = useDramaList("trending-kr", () => trendingDramas("KR"));
  const cdrama = useDramaList("cn", () => discoverByCountry("CN", { minVotes: 80 }));
  const jdrama = useDramaList("jp", () => discoverByCountry("JP", { minVotes: 40 }));
  const thai = useDramaList("th-tw", async () => {
    const [th, tw] = await Promise.all([
      discoverByCountry("TH", { minVotes: 30 }),
      discoverByCountry("TW", { minVotes: 30 }),
    ]);
    return { results: [...th.results, ...tw.results].sort((a, b) => b.vote_average - a.vote_average) };
  });
  const classics = useDramaList("classics", allTimeClassics);
  const newest = useDramaList("new-month", newThisMonth);
  const anime = useDramaList("anime-jp", japaneseAnime);

  // Combined mood + trope filter
  const applyFilters = (list: TMDBShow[] | undefined): TMDBShow[] | undefined => {
    if (!list) return list;
    let out = list;

    if (trope) {
      out = out.filter((s) => showHasTrope(s, trope));
    }

    if (moodObj.preferTropes?.length) {
      const moodMatched = out.filter((s) =>
        moodObj.preferTropes!.some((t) => showHasTrope(s, t)),
      );
      // If a trope is also active, keep mood as a strict refine; otherwise fall back if too aggressive.
      if (trope) out = moodMatched;
      else out = moodMatched.length >= 4 ? moodMatched : out;
    }

    return out;
  };

  const heroShows = trending.data ?? [];

  return (
    <div className="space-y-10 pb-10">
      <Hero shows={heroShows} loading={trending.isLoading} />

      <div className="-mt-2 space-y-2">
        <MoodFilter />
        <TropeFilter />
        <ActiveFilterBar />
      </div>

      <DramaRow title="Trending K-Dramas" emoji="🔥" shows={applyFilters(trending.data)} loading={trending.isLoading} />
      <DramaRow title="Top C-Dramas" emoji="🐉" shows={applyFilters(cdrama.data)} loading={cdrama.isLoading} />
      <DramaRow title="Top J-Dramas" emoji="🌸" shows={applyFilters(jdrama.data)} loading={jdrama.isLoading} />
      <DramaRow title="Japanese Anime" emoji="🎌" shows={applyFilters(anime.data)} loading={anime.isLoading} />
      <DramaRow title="Thai & Taiwanese Dramas" emoji="🌏" shows={applyFilters(thai.data)} loading={thai.isLoading} />
      <DramaRow title="All-Time Classics" emoji="⭐" shows={applyFilters(classics.data)} loading={classics.isLoading} />
      <DramaRow title="New This Month" emoji="🆕" shows={applyFilters(newest.data)} loading={newest.isLoading} />
    </div>
  );
};

export default Home;
