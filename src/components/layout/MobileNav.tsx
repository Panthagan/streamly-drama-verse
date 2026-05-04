import { NavLink } from "react-router-dom";
import { Home, Sparkles, MessageCircle, Search, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/tropes", label: "Tropes", icon: Sparkles },
  { to: "/community", label: "Community", icon: MessageCircle, soon: true },
  { to: "/search", label: "Search", icon: Search, soon: true },
  { to: "/profile", label: "Profile", icon: User, soon: true },
];

export const MobileNav = () => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
    <ul className="grid grid-cols-5">
      {items.map((it) => (
        <li key={it.to}>
          {it.soon ? (
            <div className="flex flex-col items-center gap-0.5 py-3 text-[10px] text-muted-foreground/60">
              <it.icon className="h-5 w-5" />
              <span>{it.label}</span>
            </div>
          ) : (
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-3 text-[10px] transition-smooth ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <it.icon className="h-5 w-5" />
              <span>{it.label}</span>
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  </nav>
);
