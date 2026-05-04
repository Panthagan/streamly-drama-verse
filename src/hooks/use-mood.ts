import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE = "streamly:mood";

export const useMood = () => {
  const [mood, setMoodState] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return localStorage.getItem(STORAGE) || "all";
  });
  const setMood = (id: string) => {
    setMoodState(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE, id);
    window.dispatchEvent(new CustomEvent("streamly:mood", { detail: id }));
  };
  return { mood, setMood };
};

export const useNavigateToDrama = () => {
  const nav = useNavigate();
  return (id: number) => nav(`/drama/${id}`);
};
