import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { MoodFilter } from "@/components/MoodFilter";
import { DramaRow } from "@/components/DramaRow";
import {
  trendingDramas,
  discoverByCountry,
  newThisMonth,
  allTimeClassics,
  japaneseAnime,
  showHasTrope,
} from "@/lib/tmdb";
import { useMood } from "@/hooks/use-mood";
import { MOODS } from "@/data/moods";
import type { TMDBShow } from "@/lib/tmdb-types";

const useDramaList = (key: string, fn: () => Promise<{ results: TMDBShow[] }>) =>
  useQuery({
    queryKey: ["dramas", key],
    queryFn: () => fn().then((d) => d.results),
    staleTime: 5 * 60_000,
  });

const Home = () => {
  const { mood } = useMood();
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

  // Mood filter — soft filter using inferred tropes
  const applyMood = (list: TMDBShow[] | undefined): TMDBShow[] | undefined => {
    if (!list) return list;
    if (!moodObj.preferTropes?.length) return list;
    const filtered = list.filter((s) =>
      moodObj.preferTropes!.some((t) => showHasTrope(s, t)),
    );
    // If filter is too aggressive, fall back to full list (better UX than empty)
    return filtered.length >= 4 ? filtered : list;
  };

  const heroShows = trending.data ?? [];

  return (
    <div className="space-y-10 pb-10">
      <Hero shows={heroShows} loading={trending.isLoading} />

      <div className="-mt-2">
        <MoodFilter />
      </div>

      <DramaRow title="Trending K-Dramas" emoji="🔥" shows={applyMood(trending.data)} loading={trending.isLoading} />
      <DramaRow title="Top C-Dramas" emoji="🐉" shows={applyMood(cdrama.data)} loading={cdrama.isLoading} />
      <DramaRow title="Top J-Dramas" emoji="🌸" shows={applyMood(jdrama.data)} loading={jdrama.isLoading} />
      <DramaRow title="Japanese Anime" emoji="🎌" shows={applyMood(anime.data)} loading={anime.isLoading} />
      <DramaRow title="Thai & Taiwanese Dramas" emoji="🌏" shows={applyMood(thai.data)} loading={thai.isLoading} />
      <DramaRow title="All-Time Classics" emoji="⭐" shows={applyMood(classics.data)} loading={classics.isLoading} />
      <DramaRow title="New This Month" emoji="🆕" shows={applyMood(newest.data)} loading={newest.isLoading} />
    </div>
  );
};

export default Home;
