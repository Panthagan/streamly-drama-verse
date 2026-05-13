import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Logo } from "../Logo";
import { SearchOverlay } from "./SearchOverlay";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/50 bg-background/70 px-4 backdrop-blur-xl lg:px-8">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground transition-smooth lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-sidebar-border bg-sidebar">
            <Sidebar variant="inline" onNavigate={() => setNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground transition-smooth"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground transition-smooth"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary ring-2 ring-background" />
        </button>
        <button
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow"
        >
          NX
        </button>
      </header>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
