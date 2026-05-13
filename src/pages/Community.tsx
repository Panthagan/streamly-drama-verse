import { useState } from "react";
import { Eye, EyeOff, Heart, MessageCircle, Send } from "lucide-react";

interface Post {
  id: string;
  user: string;
  avatar: string;
  drama: string;
  episode?: string;
  body: string;
  spoiler: boolean;
  reactions: number;
  replies: number;
  ago: string;
}

const SEED: Post[] = [
  { id: "p1", user: "midnight_owl", avatar: "🦉", drama: "Queen of Tears", episode: "Ep 14", body: "That hospital scene WRECKED me. I was not prepared for the flashback timing — pure devastation.", spoiler: true, reactions: 248, replies: 42, ago: "2h" },
  { id: "p2", user: "drama_drifter", avatar: "🌙", drama: "Goblin", body: "Rewatching this for the 4th time. The buckwheat flower scene still hits different every single year.", spoiler: false, reactions: 187, replies: 31, ago: "5h" },
  { id: "p3", user: "ramyeon_nights", avatar: "🍜", drama: "Lovely Runner", episode: "Ep 8", body: "OK the time loop logic finally clicked for me this episode. Whoever wrote this is a genius.", spoiler: true, reactions: 312, replies: 67, ago: "8h" },
  { id: "p4", user: "soft_serif", avatar: "🌸", drama: "When Life Gives You Tangerines", body: "This show is healing parts of me I didn't know were broken. IU and Park Bo-gum are unreal.", spoiler: false, reactions: 421, replies: 88, ago: "12h" },
  { id: "p5", user: "binge_baroness", avatar: "👑", drama: "My Demon", episode: "Ep 16", body: "The finale tied everything up but I'm still emotionally hungover. Send help (and another episode).", spoiler: true, reactions: 156, replies: 24, ago: "1d" },
  { id: "p6", user: "tea_and_tropes", avatar: "🍵", drama: "Crash Landing on You", body: "Hot take: this is still the gold standard for the enemies-to-lovers + forbidden romance combo.", spoiler: false, reactions: 503, replies: 119, ago: "1d" },
];

const Community = () => {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [draftSpoiler, setDraftSpoiler] = useState(false);

  const submit = () => {
    if (!draft.trim()) return;
    const post: Post = {
      id: `p${Date.now()}`,
      user: "you",
      avatar: "✨",
      drama: "Your post",
      body: draft.trim(),
      spoiler: draftSpoiler,
      reactions: 0,
      replies: 0,
      ago: "now",
    };
    setPosts([post, ...posts]);
    setDraft("");
    setDraftSpoiler(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-10 animate-fade-in">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow">Community</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Reactions from night watchers</h1>
        <p className="mt-2 text-sm text-muted-foreground">Drop a hot take. Toggle the spoiler shield if you're about to spill.</p>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4 card-shadow">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What did you just watch?"
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background/50 p-3 text-sm placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setDraftSpoiler((s) => !s)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${
              draftSpoiler ? "border-secondary bg-secondary/15 text-secondary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {draftSpoiler ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {draftSpoiler ? "Spoiler on" : "Mark as spoiler"}
          </button>
          <button
            onClick={submit}
            disabled={!draft.trim()}
            className="flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
          >
            <Send className="h-3.5 w-3.5" /> Post
          </button>
        </div>
      </div>

      <ul className="mt-6 space-y-4">
        {posts.map((p) => {
          const blurred = p.spoiler && !revealed[p.id];
          return (
            <li key={p.id} className="rounded-2xl border border-border bg-card p-4 card-shadow animate-fade-in-up">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-base shadow-glow">{p.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    @{p.user}
                    <span className="text-[11px] font-normal text-muted-foreground">· {p.ago}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {p.drama}{p.episode ? ` · ${p.episode}` : ""}
                  </div>
                </div>
                {p.spoiler && (
                  <span className="rounded-full border border-secondary/40 bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                    Spoiler
                  </span>
                )}
              </div>

              <div className="relative mt-3">
                <p className={`text-sm leading-relaxed transition-all ${blurred ? "blur-md select-none" : ""}`}>
                  {p.body}
                </p>
                {blurred && (
                  <button
                    onClick={() => setRevealed((r) => ({ ...r, [p.id]: true }))}
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/40 text-xs font-semibold text-foreground backdrop-blur-sm hover:bg-background/30"
                  >
                    <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Tap to reveal spoiler
                  </button>
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <button className="flex items-center gap-1 transition-smooth hover:text-secondary">
                  <Heart className="h-3.5 w-3.5" /> {p.reactions}
                </button>
                <button className="flex items-center gap-1 transition-smooth hover:text-primary">
                  <MessageCircle className="h-3.5 w-3.5" /> {p.replies}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Community;
