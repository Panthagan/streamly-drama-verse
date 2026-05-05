import { useEffect, useState } from "react";

const MOOD_KEY = "streamly:mood";
const TROPE_KEY = "streamly:trope";
const EVENT = "streamly:filters";

interface FiltersState {
  mood: string; // "all" = no mood
  trope: string | null; // null = no trope
}

const read = (): FiltersState => {
  if (typeof window === "undefined") return { mood: "all", trope: null };
  return {
    mood: localStorage.getItem(MOOD_KEY) || "all",
    trope: localStorage.getItem(TROPE_KEY) || null,
  };
};

const write = (next: FiltersState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOOD_KEY, next.mood);
  if (next.trope) localStorage.setItem(TROPE_KEY, next.trope);
  else localStorage.removeItem(TROPE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
};

export const useFilters = () => {
  const [state, setState] = useState<FiltersState>(read);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<FiltersState>).detail;
      if (detail) setState(detail);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const setMood = (mood: string) => {
    const next = { ...state, mood };
    write(next);
    setState(next);
  };
  const setTrope = (trope: string | null) => {
    const next = { ...state, trope };
    write(next);
    setState(next);
  };
  const clearAll = () => {
    const next: FiltersState = { mood: "all", trope: null };
    write(next);
    setState(next);
  };

  const hasActive = state.mood !== "all" || state.trope !== null;

  return { ...state, setMood, setTrope, clearAll, hasActive };
};
