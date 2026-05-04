import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
    <Logo />
    <h1 className="mt-10 text-7xl font-extrabold tracking-tight text-gradient-primary">404</h1>
    <p className="mt-3 max-w-md text-muted-foreground">
      This drama isn't in our library yet. Maybe it's a future classic.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
    >
      Back to home
    </Link>
  </div>
);

export default NotFound;
