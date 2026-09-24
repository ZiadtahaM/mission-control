import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { CommandPalette, CommandPaletteTrigger } from "@/components/CommandPalette";
import { StatusBar } from "@/components/StatusBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function AppLayout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar dark={dark} onToggleDark={toggleDark} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top search bar */}
        <header className="h-11 flex items-center px-4 border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0 gap-3">
          <CommandPaletteTrigger />
        </header>

        <main className="flex-1 overflow-y-auto pb-6">
          <ErrorBoundary name="page">
            {children}
          </ErrorBoundary>
        </main>
      </div>

      <CommandPalette dark={dark} onToggleDark={toggleDark} />
      <StatusBar />
    </div>
  );
}
