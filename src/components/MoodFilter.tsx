import { MOODS } from "@/data/moods";
import { TROPES } from "@/data/tropes";
import { useFilters } from "@/hooks/use-filters";

export const MoodFilter = () => {
  const { mood, setMood } = useFilters();
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:px-8 scrollbar-hide">
        {MOODS.map((m) => {
          const active = mood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`group shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                active
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="mr-1.5">{m.emoji}</span>
              {m.label}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-card-fade sm:block" />
    </div>
  );
};

export const TropeFilter = () => {
  const { trope, setTrope } = useFilters();
  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-4 lg:px-8 scrollbar-hide">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground pr-1">
          Trope
        </span>
        <button
          onClick={() => setTrope(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${
            trope === null
              ? "border-secondary bg-secondary/15 text-secondary"
              : "border-border bg-card text-muted-foreground hover:border-secondary/40 hover:text-foreground"
          }`}
        >
          Any
        </button>
        {TROPES.map((t) => {
          const active = trope === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTrope(active ? null : t.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${
                active
                  ? "border-secondary bg-gradient-rose text-secondary-foreground shadow-rose-glow"
                  : "border-border bg-card text-muted-foreground hover:border-secondary/40 hover:text-foreground"
              }`}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-card-fade sm:block" />
    </div>
  );
};
