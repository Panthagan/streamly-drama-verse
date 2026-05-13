import tmdbLogo from "@/assets/tmdb-logo.svg";

export const Footer = () => (
  <footer className="mt-16 border-t border-border/40 px-6 py-8 lg:px-10">
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p className="leading-relaxed">
        © 2025 Noxora. Powered by TMDB API. <span className="text-muted-foreground/70">Where night watchers find their stories.</span>
      </p>
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 transition-opacity hover:opacity-80"
        aria-label="The Movie Database"
      >
        <img
          src={tmdbLogo}
          alt="The Movie Database (TMDB) logo"
          className="mt-0.5 h-4 w-auto shrink-0"
          loading="lazy"
        />
        <span className="max-w-md leading-relaxed">
          Poster images courtesy of The Movie Database (TMDB). This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </a>
    </div>
  </footer>
);
