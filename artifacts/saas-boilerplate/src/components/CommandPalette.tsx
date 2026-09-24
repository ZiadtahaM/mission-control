import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard, Users, CreditCard, User, Code2, Settings,
  LogOut, Moon, Sun, Zap,
} from "lucide-react";

interface CommandPaletteProps {
  dark: boolean;
  onToggleDark: () => void;
}

export function CommandPalette({ dark, onToggleDark }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = useCallback((href: string) => {
    setOpen(false);
    navigate(href);
  }, [navigate]);

  const PAGES = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Billing", href: "/billing", icon: CreditCard },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Visualizer", href: "/visualizer", icon: Code2 },
    { label: "Settings", href: "/settings", icon: Settings },
    ...(isAdmin ? [{ label: "Users (Admin)", href: "/users", icon: Users }] : []),
  ];

  const VISUALIZERS = [
    { label: "Sorting Algorithms", href: "/visualizer/sorting" },
    { label: "Binary Search", href: "/visualizer/binary-search" },
    { label: "Dijkstra's Algorithm", href: "/visualizer/dijkstra" },
    { label: "Binary Search Tree", href: "/visualizer/bst" },
    { label: "A* Pathfinding", href: "/visualizer/astar" },
    { label: "Graph Traversal", href: "/visualizer/graph-traversal" },
    { label: "Dynamic Programming", href: "/visualizer/dp" },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, tools, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {PAGES.map(({ label, href, icon: Icon }) => (
            <CommandItem key={href} value={label} onSelect={() => go(href)}>
              <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Visualizers">
          {VISUALIZERS.map(({ label, href }) => (
            <CommandItem key={href} value={label} onSelect={() => go(href)}>
              <Code2 className="w-4 h-4 mr-2 text-muted-foreground" />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem value="toggle theme" onSelect={() => { setOpen(false); onToggleDark(); }}>
            {dark
              ? <Sun className="w-4 h-4 mr-2 text-muted-foreground" />
              : <Moon className="w-4 h-4 mr-2 text-muted-foreground" />}
            {dark ? "Switch to light mode" : "Switch to dark mode"}
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem value="sign out logout" onSelect={() => { setOpen(false); logout(); }}>
            <LogOut className="w-4 h-4 mr-2 text-muted-foreground" />
            Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
      className="hidden md:flex items-center gap-2 px-3 h-8 text-xs text-muted-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-md transition-colors"
      aria-label="Open command palette"
    >
      <Zap className="w-3 h-3" />
      Search…
      <kbd className="ml-1 font-mono text-[10px] bg-background border border-border rounded px-1 py-0.5">⌘K</kbd>
    </button>
  );
}
