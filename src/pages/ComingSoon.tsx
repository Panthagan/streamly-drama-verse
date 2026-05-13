import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

interface Props {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: Props) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
      <Construction className="h-7 w-7 text-primary-foreground" />
    </div>
    <h1 className="mt-6 text-3xl font-extrabold tracking-tight">{title}</h1>
    <p className="mt-2 max-w-md text-sm text-muted-foreground">
      {description || "We're cooking this up. Noxora is actively shipping — check back soon."}
    </p>
    <Link to="/" className="mt-6 text-sm font-medium text-primary hover:text-primary-glow transition-smooth">
      ← Back to home
    </Link>
  </div>
);

export default ComingSoon;
