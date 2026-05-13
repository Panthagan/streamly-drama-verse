import { useNavigate } from "react-router-dom";
import { Moon, Sparkles } from "lucide-react";
import { MOODS } from "@/data/moods";
import { useFilters } from "@/hooks/use-filters";

const ONBOARDED_KEY = "noxora:onboarded";

export const markOnboarded = () => {
  try { localStorage.setItem(ONBOARDED_KEY, "1"); } catch {}
};

export const isOnboarded = () => {
  try { return localStorage.getItem(ONBOARDED_KEY) === "1"; } catch { return false; }
};

const MoodCheckIn = () => {
  const navigate = useNavigate();
  const { setMood } = useFilters();

  const pick = (id: string) => {
    setMood(id);
    markOnboarded();
    navigate("/home");
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden px-4 py-12 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="mx-auto max-w-4xl text-center animate-fade-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
          <Moon className="h-6 w-6 fill-white text-white" strokeWidth={0} />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow">
          <Sparkles className="mr-1 inline h-3 w-3" /> Mood check-in
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          How do you feel tonight?
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          Pick a vibe and Noxora will steer your night toward stories that match.
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {MOODS.filter((m) => m.id !== "all").map((m, i) => (
            <button
              key={m.id}
              onClick={() => pick(m.id)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="group animate-fade-in-up rounded-2xl border border-border bg-card p-5 text-left transition-smooth hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
            >
              <div className="text-3xl">{m.emoji}</div>
              <div className="mt-2 text-sm font-semibold">{m.label}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Tonight's pick →</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => { markOnboarded(); navigate("/home"); }}
          className="mt-10 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default MoodCheckIn;
