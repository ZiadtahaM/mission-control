import { useState, useEffect } from "react";
import { X, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Step {
  id: string;
  label: string;
  description: string;
  href: string;
  linkLabel: string;
}

const STEPS: Step[] = [
  { id: "dashboard",  label: "Explore your dashboard",   description: "Get familiar with your metrics and KPIs",                        href: "/dashboard", linkLabel: "Go to dashboard" },
  { id: "api-key",    label: "Copy your API key",         description: "Find it on the dashboard or in Settings → API Key",              href: "/settings",  linkLabel: "Open settings" },
  { id: "billing",    label: "Choose a plan",             description: "Unlock higher API limits and priority support",                   href: "/billing",   linkLabel: "View plans" },
  { id: "security",   label: "Enable two-factor auth",    description: "Protect your account with TOTP — takes 60 seconds",              href: "/profile",   linkLabel: "Go to profile" },
  { id: "teammate",   label: "Invite a teammate",         description: "Admins can manage users from the Users page",                    href: "/users",     linkLabel: "Manage users" },
];

const STORAGE_KEY = "nx_onboarding_v1";

function load(): { dismissed: boolean; done: Record<string, boolean> } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") ?? { dismissed: false, done: {} };
  } catch {
    return { dismissed: false, done: {} };
  }
}

export function OnboardingChecklist() {
  const [state, setState] = useState(load);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggle = (id: string) =>
    setState(s => ({ ...s, done: { ...s.done, [id]: !s.done[id] } }));

  const completedCount = STEPS.filter(s => state.done[s.id]).length;
  const allDone = completedCount === STEPS.length;

  if (state.dismissed || allDone) return null;

  const pct = Math.round((completedCount / STEPS.length) * 100);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden" data-testid="onboarding-checklist">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Get started with Nexus Control</span>
              <span className="text-xs text-muted-foreground tabular-nums">{completedCount}/{STEPS.length}</span>
            </div>
            {/* Progress bar */}
            <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden w-48">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setState(s => ({ ...s, dismissed: true }))}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Dismiss"
            data-testid="button-dismiss-onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Steps */}
      {!collapsed && (
        <div className="divide-y divide-border/50">
          {STEPS.map(step => {
            const done = !!state.done[step.id];
            return (
              <div
                key={step.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                data-testid={`onboarding-step-${step.id}`}
              >
                <button
                  onClick={() => toggle(step.id)}
                  className={`mt-0.5 flex-shrink-0 transition-colors ${done ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done
                    ? <CheckCircle2 className="w-4 h-4" />
                    : <Circle className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {step.label}
                  </div>
                  {!done && (
                    <div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>
                  )}
                </div>
                {!done && (
                  <Link href={step.href} className="flex-shrink-0 text-xs text-primary hover:underline">
                    {step.linkLabel} →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
