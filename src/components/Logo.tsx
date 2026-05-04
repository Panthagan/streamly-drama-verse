import { Play } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`}>
    <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
      <Play className="h-4 w-4 fill-white text-white" strokeWidth={0} />
    </span>
    <span className="text-xl font-extrabold tracking-tight lowercase">
      streamly
    </span>
  </Link>
);
