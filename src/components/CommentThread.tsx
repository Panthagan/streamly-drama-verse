import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, MessageCircle, Send } from "lucide-react";

/* -------------------- Types -------------------- */
export interface Reaction {
  emoji: string;
  users: string[]; // user names that reacted
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: number;
  spoiler: boolean;
  reactions: Reaction[];
  replies: Comment[];
}

const REACTION_SET = ["❤️", "😂", "😭", "🔥", "😱", "🤔"];

/* -------------------- Storage helpers -------------------- */
const storageKey = (threadId: string) => `streamly:comments:${threadId}`;

const loadThread = (threadId: string): Comment[] => {
  try {
    const raw = localStorage.getItem(storageKey(threadId));
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
};

const saveThread = (threadId: string, comments: Comment[]) => {
  try {
    localStorage.setItem(storageKey(threadId), JSON.stringify(comments));
  } catch {
    /* ignore quota */
  }
};

const guestName = (): string => {
  const k = "streamly:guest-name";
  let v = localStorage.getItem(k);
  if (!v) {
    v = `Drama Fan ${Math.floor(Math.random() * 9000) + 1000}`;
    localStorage.setItem(k, v);
  }
  return v;
};

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

/* -------------------- Tree mutations -------------------- */
const addReplyToTree = (list: Comment[], parentId: string, reply: Comment): Comment[] =>
  list.map((c) =>
    c.id === parentId
      ? { ...c, replies: [reply, ...c.replies] }
      : { ...c, replies: addReplyToTree(c.replies, parentId, reply) },
  );

const toggleReactionInTree = (list: Comment[], commentId: string, emoji: string, user: string): Comment[] =>
  list.map((c) => {
    if (c.id === commentId) {
      const existing = c.reactions.find((r) => r.emoji === emoji);
      let reactions: Reaction[];
      if (existing) {
        const has = existing.users.includes(user);
        const updated = { ...existing, users: has ? existing.users.filter((u) => u !== user) : [...existing.users, user] };
        reactions = updated.users.length === 0
          ? c.reactions.filter((r) => r.emoji !== emoji)
          : c.reactions.map((r) => (r.emoji === emoji ? updated : r));
      } else {
        reactions = [...c.reactions, { emoji, users: [user] }];
      }
      return { ...c, reactions };
    }
    return { ...c, replies: toggleReactionInTree(c.replies, commentId, emoji, user) };
  });

/* -------------------- Public component -------------------- */
interface ThreadProps {
  threadId: string;
  title?: string;
  /** When true, comments default to spoiler=on (e.g. episode threads). */
  spoilerByDefault?: boolean;
  emptyHint?: string;
}

export const CommentThread = ({ threadId, title, spoilerByDefault = false, emptyHint }: ThreadProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const me = useMemo(() => guestName(), []);

  useEffect(() => {
    setComments(loadThread(threadId));
  }, [threadId]);

  useEffect(() => {
    saveThread(threadId, comments);
  }, [threadId, comments]);

  const handleAdd = (body: string, spoiler: boolean, parentId?: string) => {
    const c: Comment = {
      id: newId(),
      author: me,
      body: body.trim(),
      createdAt: Date.now(),
      spoiler,
      reactions: [],
      replies: [],
    };
    if (!c.body) return;
    if (parentId) {
      setComments((prev) => addReplyToTree(prev, parentId, c));
    } else {
      setComments((prev) => [c, ...prev]);
    }
  };

  const handleReact = (commentId: string, emoji: string) => {
    setComments((prev) => toggleReactionInTree(prev, commentId, emoji, me));
  };

  const totalCount = useMemo(() => {
    let n = 0;
    const walk = (list: Comment[]) => list.forEach((c) => { n++; walk(c.replies); });
    walk(comments);
    return n;
  }, [comments]);

  return (
    <section className="rounded-2xl border border-border bg-card/40 p-4 sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <MessageCircle className="h-4 w-4 text-primary-glow" />
          {title ?? "Discussion"}
          <span className="text-xs font-medium text-muted-foreground">({totalCount})</span>
        </h3>
        <span className="text-[11px] text-muted-foreground">Posting as <span className="text-foreground/80">{me}</span></span>
      </header>

      <CommentComposer onSubmit={(body, spoiler) => handleAdd(body, spoiler)} spoilerDefault={spoilerByDefault} />

      <div className="mt-5 space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
            {emptyHint ?? "Be the first to share your reaction. No spoilers without the toggle. 💜"}
          </div>
        ) : (
          comments.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              depth={0}
              me={me}
              onReply={(body, spoiler) => handleAdd(body, spoiler, c.id)}
              onReact={(emoji) => handleReact(c.id, emoji)}
              onReplyToChild={(childId, body, spoiler) => handleAdd(body, spoiler, childId)}
              onReactChild={(childId, emoji) => handleReact(childId, emoji)}
              spoilerDefault={spoilerByDefault}
            />
          ))
        )}
      </div>
    </section>
  );
};

/* -------------------- Comment node (recursive) -------------------- */
interface NodeProps {
  comment: Comment;
  depth: number;
  me: string;
  onReply: (body: string, spoiler: boolean) => void;
  onReact: (emoji: string) => void;
  onReplyToChild: (childId: string, body: string, spoiler: boolean) => void;
  onReactChild: (childId: string, emoji: string) => void;
  spoilerDefault: boolean;
}

const CommentNode = ({
  comment, depth, me, onReply, onReact, onReplyToChild, onReactChild, spoilerDefault,
}: NodeProps) => {
  const [revealed, setRevealed] = useState(!comment.spoiler);
  const [showReply, setShowReply] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const initials = comment.author.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const indent = depth === 0 ? "" : "ml-4 sm:ml-8 border-l border-border/60 pl-4";

  return (
    <div className={`${indent} animate-fade-in`}>
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="font-semibold text-foreground">{comment.author}</span>
            <span className="text-muted-foreground">· {timeAgo(comment.createdAt)}</span>
            {comment.spoiler && (
              <span className="rounded-full bg-secondary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary ring-1 ring-secondary/40">
                Spoiler
              </span>
            )}
          </div>

          {/* Body with spoiler blur */}
          <div className="relative mt-1.5">
            <p
              className={`whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90 transition-all duration-300 ${
                comment.spoiler && !revealed ? "select-none blur-md" : "blur-0"
              }`}
            >
              {comment.body}
            </p>
            {comment.spoiler && !revealed && (
              <button
                onClick={() => setRevealed(true)}
                className="absolute inset-0 flex items-center justify-center rounded-md bg-background/30 backdrop-blur-[1px] text-xs font-semibold text-foreground hover:bg-background/40 transition-smooth"
                aria-label="Reveal spoiler"
              >
                <span className="flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 ring-1 ring-secondary/50">
                  <Eye className="h-3.5 w-3.5" /> Tap to reveal spoiler
                </span>
              </button>
            )}
            {comment.spoiler && revealed && (
              <button
                onClick={() => setRevealed(false)}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-smooth"
              >
                <EyeOff className="h-3 w-3" /> Hide
              </button>
            )}
          </div>

          {/* Reactions */}
          {comment.reactions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {comment.reactions.map((r) => {
                const mine = r.users.includes(me);
                return (
                  <button
                    key={r.emoji}
                    onClick={() => onReact(r.emoji)}
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-smooth ${
                      mine
                        ? "border-primary/50 bg-primary/15 text-primary-glow"
                        : "border-border bg-card/70 text-foreground/80 hover:border-primary/40"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span className="font-semibold">{r.users.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <button
              onClick={() => setShowReactions((v) => !v)}
              className="hover:text-foreground transition-smooth"
            >
              {showReactions ? "Close" : "React"}
            </button>
            {depth < 3 && (
              <button
                onClick={() => setShowReply((v) => !v)}
                className="hover:text-foreground transition-smooth"
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
            )}
          </div>

          {showReactions && (
            <div className="mt-2 flex flex-wrap gap-1 rounded-full border border-border bg-background/60 p-1 w-max">
              {REACTION_SET.map((e) => (
                <button
                  key={e}
                  onClick={() => { onReact(e); setShowReactions(false); }}
                  className="rounded-full px-2 py-0.5 text-base transition-transform hover:scale-125"
                  aria-label={`React with ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          {showReply && (
            <div className="mt-3">
              <CommentComposer
                compact
                spoilerDefault={spoilerDefault || comment.spoiler}
                onSubmit={(body, spoiler) => {
                  onReply(body, spoiler);
                  setShowReply(false);
                }}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((child) => (
                <CommentNode
                  key={child.id}
                  comment={child}
                  depth={depth + 1}
                  me={me}
                  onReply={(body, spoiler) => onReplyToChild(child.id, body, spoiler)}
                  onReact={(emoji) => onReactChild(child.id, emoji)}
                  onReplyToChild={onReplyToChild}
                  onReactChild={onReactChild}
                  spoilerDefault={spoilerDefault}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------- Composer -------------------- */
interface ComposerProps {
  onSubmit: (body: string, spoiler: boolean) => void;
  spoilerDefault?: boolean;
  compact?: boolean;
}

const CommentComposer = ({ onSubmit, spoilerDefault = false, compact = false }: ComposerProps) => {
  const [body, setBody] = useState("");
  const [spoiler, setSpoiler] = useState(spoilerDefault);

  const submit = () => {
    if (!body.trim()) return;
    onSubmit(body, spoiler);
    setBody("");
    setSpoiler(spoilerDefault);
  };

  return (
    <div className={`rounded-xl border border-border bg-background/40 p-3 ${compact ? "" : ""}`}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
        placeholder={compact ? "Write a reply..." : "Share your reaction. Use the spoiler toggle for plot twists."}
        rows={compact ? 2 : 3}
        className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={spoiler}
            onChange={(e) => setSpoiler(e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer accent-[hsl(var(--secondary))]"
          />
          <span className={spoiler ? "text-secondary" : ""}>Mark as spoiler</span>
        </label>
        <button
          onClick={submit}
          disabled={!body.trim()}
          className="flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition-transform enabled:hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-3 w-3" />
          Post
        </button>
      </div>
    </div>
  );
};
