import { useFilters } from "./use-filters";
import { useNavigate } from "react-router-dom";

// Backward-compatible shim around the combined filters store.
export const useMood = () => {
  const { mood, setMood } = useFilters();
  return { mood, setMood };
};

export const useNavigateToDrama = () => {
  const nav = useNavigate();
  return (id: number) => nav(`/drama/${id}`);
};
