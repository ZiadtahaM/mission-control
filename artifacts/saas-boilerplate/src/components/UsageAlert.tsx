import { useState } from "react";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface UsageAlertProps {
  used: number;
  limit: number;
}

export function UsageAlert({ used, limit }: UsageAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !limit) return null;

  const pct = Math.round((used / limit) * 100);
  if (pct < 80) return null;

  const isCritical = pct >= 95;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${
        isCritical
          ? "bg-destructive/8 border-destructive/25"
          : "bg-amber-500/8 border-amber-500/20"
      }`}
      role="alert"
      data-testid="usage-alert"
    >
      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${isCritical ? "text-destructive" : "text-amber-400"}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {isCritical ? "API limit almost reached" : "Approaching API limit"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {used.toLocaleString()} of {limit.toLocaleString()} calls used this month ({pct}%).
          {isCritical ? " Upgrade now to avoid service interruption." : " Consider upgrading before you hit the limit."}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/billing"
          className={`flex items-center gap-1 text-xs font-medium hover:underline ${isCritical ? "text-destructive" : "text-amber-400"}`}
        >
          Upgrade <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss alert"
          data-testid="button-dismiss-usage-alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
