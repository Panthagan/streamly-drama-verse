import { X } from "lucide-react";
import { MOODS } from "@/data/moods";
import { TROPE_BY_ID } from "@/data/tropes";
import { useFilters } from "@/hooks/use-filters";

export const ActiveFilterBar = () => {
  const { mood, trope, setMood, setTrope, clearAll, hasActive } = useFilters();
  if (!hasActive) return null;

  const moodObj = MOODS.find((m) => m.id === mood);
  const tropeObj = trope ? TROPE_BY_ID[trope] : null;

  return (
    <div className="px-4 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/60 p-3 animate-fade-in">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filtering by
        </span>
        {moodObj && moodObj.id !== "all" && (
          <button
            onClick={() => setMood("all")}
            className="group flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-glow transition-smooth hover:bg-primary/25"
          >
            <span>{moodObj.emoji}</span>
            <span>{moodObj.label}</span>
            <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
          </button>
        )}
        {tropeObj && (
          <button
            onClick={() => setTrope(null)}
            className="group flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary transition-smooth hover:bg-secondary/25"
          >
            <span>{tropeObj.emoji}</span>
            <span>{tropeObj.label}</span>
            <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
          </button>
        )}
        <button
          onClick={clearAll}
          className="ml-auto rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-semibold text-muted-foreground transition-smooth hover:border-foreground/40 hover:text-foreground"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};
