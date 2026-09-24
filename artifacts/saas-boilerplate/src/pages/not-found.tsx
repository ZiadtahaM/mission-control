import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
}
