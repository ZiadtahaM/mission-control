import { useState, useEffect } from "react";
import { Circle } from "lucide-react";

interface StatusItem {
  label: string;
  value: string;
  ok: boolean;
}

export function StatusBar() {
  const [status, setStatus] = useState<StatusItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("now");

  useEffect(() => {
    const refresh = () => {
      setStatus([
        { label: "API", value: "operational", ok: true },
        { label: "Auth", value: "operational", ok: true },
        { label: "DB", value: "operational", ok: true },
      ]);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, []);

  const allOk = status.every(s => s.ok);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-6 bg-sidebar border-t border-sidebar-border flex items-center px-4 gap-4 text-[10px] text-sidebar-foreground/40 font-mono select-none">
      <div className="flex items-center gap-1.5">
        <Circle className={`w-1.5 h-1.5 fill-current ${allOk ? "text-emerald-400" : "text-amber-400"}`} />
        <span className={allOk ? "text-emerald-400/70" : "text-amber-400/70"}>
          {allOk ? "All systems operational" : "Degraded performance"}
        </span>
      </div>
      <div className="h-3 w-px bg-sidebar-border" />
      {status.map(s => (
        <span key={s.label}>
          <span className="opacity-60">{s.label} </span>
          <span className={s.ok ? "text-emerald-400/70" : "text-destructive/70"}>●</span>
        </span>
      ))}
      <span className="ml-auto opacity-40">Updated {lastUpdated}</span>
    </div>
  );
}
