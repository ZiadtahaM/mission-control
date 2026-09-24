import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, CreditCard, User, Settings,
  LogOut, Moon, Sun, Zap, ShieldCheck, Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

const NAV_MAIN = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/billing",   icon: CreditCard,       label: "Billing" },
];

const NAV_ACCOUNT = [
  { href: "/profile",   icon: User,     label: "Profile" },
  { href: "/settings",  icon: Settings, label: "Settings" },
];

const NAV_ADMIN = [
  { href: "/users", icon: Users,  label: "Users" },
];

const PLAN_COLOR: Record<string, string> = {
  FREE:       "text-muted-foreground/60",
  PRO:        "text-primary",
  ENTERPRISE: "text-amber-400",
};

interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
}

function NavItem({ href, icon: Icon, label, active }: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-foreground font-medium"
          : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
      )}
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-primary" : "opacity-50")} />
      {label}
    </Link>
  );
}

function NavGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-px">
      {label && (
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/30">
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function Sidebar({ dark, onToggleDark }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const isActive = (href: string) =>
    location === href || location.startsWith(href + "/");

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <Globe className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <span className="text-sidebar-foreground font-semibold text-sm tracking-tight">Nexus</span>
          <span className="ml-1.5 text-[10px] font-medium text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-sm">Control</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        <NavGroup>
          {NAV_MAIN.map(item => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </NavGroup>

        {isAdmin && (
          <NavGroup label="Admin">
            {NAV_ADMIN.map(item => (
              <NavItem key={item.href} {...item} active={isActive(item.href)} />
            ))}
          </NavGroup>
        )}

        <NavGroup label="Account">
          {NAV_ACCOUNT.map(item => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </NavGroup>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-2 py-3 space-y-px">
        {/* ⌘K trigger hint */}
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
          className="flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-md text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/40 w-full transition-colors"
          data-testid="button-command-palette"
        >
          <span>Quick search</span>
          <kbd className="font-mono text-[10px] bg-sidebar-accent/50 border border-sidebar-border rounded px-1 py-0.5">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onToggleDark}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 w-full transition-colors"
          data-testid="button-toggle-theme"
        >
          {dark ? <Sun className="w-4 h-4 opacity-60" /> : <Moon className="w-4 h-4 opacity-60" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>

        {/* Sign out */}
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 w-full transition-colors"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 opacity-60" />
          Sign out
        </button>

        {/* User info */}
        {user && (
          <div className="px-3 pt-2 mt-1 border-t border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-primary">
                  {user.name?.charAt(0).toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</div>
                <div className={cn("text-[10px] font-medium truncate", PLAN_COLOR[user.plan] ?? "text-muted-foreground/60")}>
                  {user.plan}
                  {isAdmin && (
                    <ShieldCheck className="w-2.5 h-2.5 inline ml-1 text-violet-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
