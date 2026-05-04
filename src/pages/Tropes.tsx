import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { TROPES } from "@/data/tropes";

const Tropes = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TROPES;
    return TROPES.filter((t) => t.label.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="px-4 py-8 lg:px-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Browse by Trope</h1>
        <p className="mt-2 text-muted-foreground">Find dramas by the patterns you love.</p>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tropes..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t, i) => (
          <Link
            key={t.id}
            to={`/tropes/${t.id}`}
            className="group relative aspect-[5/3] overflow-hidden rounded-2xl ring-1 ring-border card-shadow transition-all duration-300 hover:scale-[1.02] hover:ring-primary/40 animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-95 transition-opacity group-hover:opacity-100`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <span className="text-3xl drop-shadow-lg" aria-hidden>{t.emoji}</span>
              <div>
                <div className="text-base font-bold leading-tight text-white drop-shadow-sm">{t.label}</div>
                <div className="mt-0.5 text-xs text-white/85">Browse dramas →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
          No tropes match "{q}". Try another keyword.
        </div>
      )}
    </div>
  );
};

export default Tropes;
