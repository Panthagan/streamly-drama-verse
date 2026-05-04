export interface Trope {
  id: string;
  label: string;
  emoji: string;
  description: string;
  gradient: string; // tailwind gradient classes
}

export const TROPES: Trope[] = [
  { id: "enemies-to-lovers", label: "Enemies to Lovers", emoji: "⚔️", description: "Sworn rivals who slowly burn into something they can't deny.", gradient: "from-red-600 via-rose-600 to-purple-700" },
  { id: "contract-marriage", label: "Contract Marriage", emoji: "📋", description: "A deal on paper, real feelings off it.", gradient: "from-orange-500 via-red-500 to-rose-600" },
  { id: "ceo-romance", label: "CEO Romance", emoji: "👑", description: "Cold boardrooms, warmer nights with the chairman.", gradient: "from-amber-400 via-orange-500 to-red-500" },
  { id: "time-travel", label: "Time Travel", emoji: "⏳", description: "Past lives, future regrets, second tries.", gradient: "from-purple-600 via-indigo-600 to-blue-700" },
  { id: "found-family", label: "Found Family", emoji: "👨‍👩‍👧", description: "The people you choose when blood isn't enough.", gradient: "from-emerald-500 via-teal-500 to-cyan-600" },
  { id: "revenge", label: "Revenge Plot", emoji: "⚡", description: "Slow, cold, and brutally satisfying.", gradient: "from-rose-900 via-red-950 to-black" },
  { id: "historical", label: "Historical", emoji: "🏯", description: "Palace politics, hanboks, and forbidden glances.", gradient: "from-amber-700 via-yellow-700 to-orange-900" },
  { id: "fake-dating", label: "Fake Dating", emoji: "💘", description: "Pretend it long enough and it stops being pretend.", gradient: "from-pink-500 via-rose-500 to-purple-600" },
  { id: "second-chance", label: "Second Chance", emoji: "🔄", description: "What if you got to do it all over?", gradient: "from-teal-500 via-emerald-500 to-green-600" },
  { id: "slow-burn", label: "Slow Burn", emoji: "🌙", description: "Lingering looks. Twenty episodes of restraint.", gradient: "from-slate-800 via-indigo-900 to-purple-900" },
  { id: "forbidden-love", label: "Forbidden Love", emoji: "🚫", description: "All the reasons not to. None of them enough.", gradient: "from-rose-600 via-red-700 to-rose-900" },
  { id: "doctor-romance", label: "Doctor Romance", emoji: "🏥", description: "Long shifts, quiet confessions on the rooftop.", gradient: "from-sky-500 via-blue-600 to-teal-700" },
  { id: "school-romance", label: "School Romance", emoji: "🏫", description: "Uniforms, study dates, first everything.", gradient: "from-fuchsia-500 via-purple-500 to-pink-500" },
  { id: "supernatural", label: "Supernatural / Fantasy", emoji: "👻", description: "Goblins, ghosts, gods who fall in love anyway.", gradient: "from-purple-900 via-violet-950 to-black" },
  { id: "thriller", label: "Thriller / Mystery", emoji: "🕵️", description: "Sleepless nights and unreliable witnesses.", gradient: "from-zinc-700 via-slate-800 to-black" },
  { id: "office-romance", label: "Office Romance", emoji: "💼", description: "Glances over conference tables, late-night emails.", gradient: "from-blue-700 via-indigo-700 to-blue-900" },
];

export const TROPE_BY_ID = Object.fromEntries(TROPES.map((t) => [t.id, t]));
