import type {
  TMDBPagedResult,
  TMDBShow,
  TMDBShowDetail,
  TMDBEpisode,
  TMDBCastMember,
} from "./tmdb-types";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = "https://api.themoviedb.org/3";

export const TMDB_IMG = (path: string | null | undefined, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function tmdb<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
  if (!API_KEY) throw new Error("Missing VITE_TMDB_API_KEY");
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// Country → ISO mapping for original_language filter (drama focus)
export const COUNTRY_INFO: Record<string, { flag: string; label: string; lang: string }> = {
  KR: { flag: "🇰🇷", label: "Korea", lang: "ko" },
  CN: { flag: "🇨🇳", label: "China", lang: "zh" },
  JP: { flag: "🇯🇵", label: "Japan", lang: "ja" },
  TH: { flag: "🇹🇭", label: "Thailand", lang: "th" },
  TW: { flag: "🇹🇼", label: "Taiwan", lang: "zh" },
  HK: { flag: "🇭🇰", label: "Hong Kong", lang: "zh" },
};

export const getCountryFromShow = (s: TMDBShow): keyof typeof COUNTRY_INFO | null => {
  const c = s.origin_country?.[0];
  if (c && COUNTRY_INFO[c as keyof typeof COUNTRY_INFO]) return c as keyof typeof COUNTRY_INFO;
  // fallback by language
  const langMap: Record<string, keyof typeof COUNTRY_INFO> = { ko: "KR", zh: "CN", ja: "JP", th: "TH" };
  if (s.original_language && langMap[s.original_language]) return langMap[s.original_language];
  return null;
};

// Discover dramas by origin country
export const discoverByCountry = (country: string, opts: { sort?: string; minVotes?: number; minRating?: number; year?: number; page?: number } = {}) =>
  tmdb<TMDBPagedResult<TMDBShow>>("/discover/tv", {
    with_origin_country: country,
    sort_by: opts.sort ?? "popularity.desc",
    "vote_count.gte": opts.minVotes ?? 50,
    "vote_average.gte": opts.minRating,
    first_air_date_year: opts.year,
    include_adult: false,
    page: opts.page ?? 1,
  });

// Trending (Asian dramas — filter client-side)
export const trendingDramas = (country = "KR") =>
  discoverByCountry(country, { sort: "popularity.desc", minVotes: 100 });

export const newThisMonth = () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
  const to = now.toISOString().slice(0, 10);
  return tmdb<TMDBPagedResult<TMDBShow>>("/discover/tv", {
    with_origin_country: "KR|CN|JP|TW|TH",
    "first_air_date.gte": from,
    "first_air_date.lte": to,
    sort_by: "popularity.desc",
    page: 1,
  });
};

// Japanese anime — TMDB animation genre (16) with JP origin
export const japaneseAnime = () =>
  tmdb<TMDBPagedResult<TMDBShow>>("/discover/tv", {
    with_origin_country: "JP",
    with_genres: "16",
    "vote_count.gte": 100,
    sort_by: "popularity.desc",
    page: 1,
  });

export const allTimeClassics = () =>
  tmdb<TMDBPagedResult<TMDBShow>>("/discover/tv", {
    with_origin_country: "KR|CN|JP|TW|TH",
    "vote_average.gte": 8.5,
    "vote_count.gte": 200,
    sort_by: "vote_average.desc",
  });

export const searchShows = (q: string) =>
  tmdb<TMDBPagedResult<TMDBShow>>("/search/tv", { query: q, include_adult: false });

export const showDetails = (id: number) =>
  tmdb<TMDBShowDetail>(`/tv/${id}`, { append_to_response: "credits,similar,videos" }) as Promise<
    TMDBShowDetail & {
      credits: { cast: TMDBCastMember[] };
      similar: TMDBPagedResult<TMDBShow>;
    }
  >;

export const seasonDetails = (id: number, seasonNumber: number) =>
  tmdb<{ episodes: TMDBEpisode[]; name: string }>(`/tv/${id}/season/${seasonNumber}`);

// ----- Drama-flavored helpers (UI metadata) -----

export const calcBingeHours = (episodes: number, runtime: number) => {
  const total = (episodes || 12) * (runtime || 60);
  return Math.max(1, Math.round(total / 60));
};

export const pacingLabel = (episodes: number) => {
  if (episodes <= 12) return "Tight & focused";
  if (episodes <= 20) return "Slow burn";
  if (episodes <= 40) return "Long arc";
  return "Epic saga";
};

// Derive trope tags from genres + name heuristics (client-only flavour)
const TROPE_KEYWORDS: { id: string; label: string; emoji: string; match: (text: string, genres: string[]) => boolean }[] = [
  { id: "enemies-to-lovers", label: "Enemies to Lovers", emoji: "⚔️", match: (t) => /revenge|enemy|rival|hate/i.test(t) },
  { id: "ceo-romance", label: "CEO Romance", emoji: "👑", match: (t) => /ceo|chairman|heiress|chaebol|tycoon/i.test(t) },
  { id: "contract-marriage", label: "Contract Marriage", emoji: "📋", match: (t) => /contract|marriage|wife|fake/i.test(t) },
  { id: "time-travel", label: "Time Travel", emoji: "⏳", match: (t, g) => /time|past|future/i.test(t) || g.includes("Sci-Fi & Fantasy") },
  { id: "found-family", label: "Found Family", emoji: "👨‍👩‍👧", match: (t) => /family|orphan|together/i.test(t) },
  { id: "revenge", label: "Revenge Plot", emoji: "⚡", match: (t) => /revenge|vengeance|payback/i.test(t) },
  { id: "historical", label: "Historical", emoji: "🏯", match: (t, g) => /palace|kingdom|dynasty|joseon|emperor|empress|prince/i.test(t) || g.includes("War & Politics") },
  { id: "fake-dating", label: "Fake Dating", emoji: "💘", match: (t) => /fake|pretend|pretending/i.test(t) },
  { id: "second-chance", label: "Second Chance", emoji: "🔄", match: (t) => /again|second|return|reborn|reset/i.test(t) },
  { id: "slow-burn", label: "Slow Burn", emoji: "🌙", match: () => false },
  { id: "forbidden-love", label: "Forbidden Love", emoji: "🚫", match: (t) => /forbidden|secret love|affair/i.test(t) },
  { id: "doctor-romance", label: "Doctor Romance", emoji: "🏥", match: (t) => /doctor|hospital|surgeon|medic/i.test(t) },
  { id: "school-romance", label: "School Romance", emoji: "🏫", match: (t) => /school|class|student|academy|campus/i.test(t) },
  { id: "supernatural", label: "Supernatural", emoji: "👻", match: (t, g) => /ghost|demon|spirit|vampire|magic|witch/i.test(t) || g.includes("Sci-Fi & Fantasy") },
  { id: "thriller", label: "Thriller / Mystery", emoji: "🕵️", match: (t, g) => /murder|mystery|crime|detective|case/i.test(t) || g.includes("Mystery") || g.includes("Crime") },
  { id: "office-romance", label: "Office Romance", emoji: "💼", match: (t) => /office|company|workplace|colleague|secretary/i.test(t) },
];

export const inferTropes = (
  show: { name: string; original_name?: string; overview?: string },
  genres: string[] = [],
  limit = 2,
) => {
  const text = `${show.name} ${show.original_name ?? ""} ${show.overview ?? ""}`;
  const found = TROPE_KEYWORDS.filter((t) => t.match(text, genres));
  if (found.length === 0) {
    if (genres.includes("Drama") && genres.includes("Romance")) return [TROPE_KEYWORDS.find((t) => t.id === "slow-burn")!];
    if (genres.includes("Comedy")) return [{ id: "comfort", label: "Comfort Watch", emoji: "💕", match: () => true }];
    return [{ id: "drama", label: "Drama", emoji: "🎭", match: () => true }];
  }
  return found.slice(0, limit);
};

export const showHasTrope = (show: TMDBShow, tropeId: string, genres: string[] = []) =>
  inferTropes(show, genres, 5).some((t) => t.id === tropeId);
