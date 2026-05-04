import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  Sparkles,
  MessageCircle,
  Bookmark,
  Newspaper,
  User,
  Settings,
  Moon,
} from "lucide-react";
import { Logo } from "../Logo";
import { useMood } from "@/hooks/use-mood";
import { MOODS } from "@/data/moods";

const mainItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass, comingSoon: true },
  { to: "/tropes", label: "Tropes", icon: Sparkles, badge: "NEW" },
  { to: "/community", label: "Community", icon: MessageCircle, comingSoon: true },
];

const soonItems = [
  { to: "/watchlist", label: "Watchlist", icon: Bookmark },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/profile", label: "My Profile", icon: User },
];

export const Sidebar = () => {
  const { mood } = useMood();
  const moodObj = MOODS.find((m) => m.id === mood) ?? MOODS[0];

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-6 pt-6 pb-4">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <ul className="space-y-1">
          {mainItems.map((item) => (
            <li key={item.to}>
              {item.comingSoon ? (
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/70 cursor-not-allowed">
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">soon</span>
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_hsl(var(--primary))]"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="my-6 flex items-center gap-3 px-3">
          <div className="h-px flex-1 bg-sidebar-border" />
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">coming soon</span>
          <div className="h-px flex-1 bg-sidebar-border" />
        </div>

        <ul className="space-y-1">
          {soonItems.map((item) => (
            <li key={item.to}>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/60 cursor-not-allowed">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground/70 cursor-not-allowed">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </div>
      </div>

      {/* Tonight's Mood widget */}
      <div className="mx-3 mb-4 rounded-2xl border border-sidebar-border bg-gradient-to-br from-card to-sidebar p-4 card-shadow">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Moon className="h-3.5 w-3.5" /> Tonight's mood
        </div>
        <div className="mt-2 text-base font-semibold">
          <span className="mr-1.5 text-xl">{moodObj.emoji}</span>
          {moodObj.label}
        </div>
        <NavLink to="/" className="mt-3 inline-block text-xs font-medium text-primary hover:text-primary-glow transition-smooth">
          Find your perfect drama →
        </NavLink>
        <div className="mt-1 text-[11px] text-muted-foreground">
          <NavLink to="/" className="hover:text-foreground transition-smooth">Change mood</NavLink>
        </div>
      </div>
    </aside>
  );
};
