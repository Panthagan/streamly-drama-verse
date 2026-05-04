import { MOODS } from "@/data/moods";
import { useMood } from "@/hooks/use-mood";

export const MoodFilter = () => {
  const { mood, setMood } = useMood();
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
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow animate-glow-pulse"
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
