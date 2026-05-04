export interface Mood {
  id: string;
  emoji: string;
  label: string;
  // soft hint about what to surface
  preferTropes?: string[];
  preferGenres?: string[];
}

export const MOODS: Mood[] = [
  { id: "all", emoji: "✨", label: "All" },
  { id: "butterflies", emoji: "🦋", label: "Butterflies", preferTropes: ["fake-dating", "office-romance", "school-romance"] },
  { id: "cry", emoji: "😭", label: "Cry it out", preferTropes: ["forbidden-love", "second-chance"] },
  { id: "revenge", emoji: "🔥", label: "Revenge energy", preferTropes: ["revenge", "enemies-to-lovers"] },
  { id: "feelgood", emoji: "😄", label: "Feel good", preferTropes: ["found-family", "school-romance"] },
  { id: "epic", emoji: "⚔️", label: "Epic saga", preferTropes: ["historical"] },
  { id: "slow", emoji: "🌙", label: "Slow burn", preferTropes: ["slow-burn", "ceo-romance"] },
  { id: "dark", emoji: "💀", label: "Dark & Gritty", preferTropes: ["thriller", "supernatural"] },
  { id: "comfort", emoji: "💕", label: "Comfort watch", preferTropes: ["found-family", "doctor-romance"] },
];
