import { NavLink } from "react-router-dom";
import { Home, Sparkles, MessageCircle, Bookmark, Compass } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/tropes", label: "Tropes", icon: Sparkles },
  { to: "/community", label: "Community", icon: MessageCircle },
  { to: "/watchlist", label: "Saved", icon: Bookmark },
];

export const MobileNav = () => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
    <ul className="grid grid-cols-5">
      {items.map((it) => (
        <li key={it.to}>
          <NavLink
            to={it.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-3 text-[10px] transition-smooth ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <it.icon className="h-5 w-5" />
            <span>{it.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
