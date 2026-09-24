import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw } from "lucide-react";

const ROWS = 15, COLS = 25;
type CellType = "empty" | "wall" | "start" | "end" | "open" | "closed" | "path";

const CELL_COLORS: Record<CellType, string> = {
  empty: "bg-muted/20",
  wall: "bg-slate-700",
  start: "bg-emerald-500",
  end: "bg-rose-500",
  open: "bg-amber-500/60",
  closed: "bg-slate-600/60",
  path: "bg-primary",
};

function heuristic(a: [number, number], b: [number, number]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function astar(grid: CellType[][], start: [number, number], end: [number, number]): { open: Set<string>; closed: Set<string>; path: string[] }[] {
  const key = (r: number, c: number) => `${r},${c}`;
  const steps: { open: Set<string>; closed: Set<string>; path: string[] }[] = [];

  const openSet = new Set<string>([key(...start)]);
  const closedSet = new Set<string>();
  const gScore: Record<string, number> = { [key(...start)]: 0 };
  const fScore: Record<string, number> = { [key(...start)]: heuristic(start, end) };
  const cameFrom: Record<string, string> = {};

  const reconstructPath = (current: string): string[] => {
    const path = [current];
    while (cameFrom[current]) { current = cameFrom[current]!; path.unshift(current); }
    return path;
  };

  while (openSet.size > 0) {
    const current = [...openSet].reduce((min, k) => (fScore[k] ?? Infinity) < (fScore[min] ?? Infinity) ? k : min);
    if (current === key(...end)) {
      steps.push({ open: new Set(openSet), closed: new Set(closedSet), path: reconstructPath(current) });
      return steps;
    }
    openSet.delete(current);
    closedSet.add(current);
    const [r, c] = current.split(",").map(Number) as [number, number];
    steps.push({ open: new Set(openSet), closed: new Set(closedSet), path: reconstructPath(current) });

    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (grid[nr]?.[nc] === "wall") continue;
      const nk = key(nr, nc);
      if (closedSet.has(nk)) continue;
      const tentativeG = (gScore[current] ?? Infinity) + 1;
      if (tentativeG < (gScore[nk] ?? Infinity)) {
        cameFrom[nk] = current;
        gScore[nk] = tentativeG;
        fScore[nk] = tentativeG + heuristic([nr, nc], end);
        openSet.add(nk);
      }
    }
  }
  return steps;
}

export default function AstarPage() {
  const [grid, setGrid] = useState<CellType[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as CellType[])
  );
  const [start, setStart] = useState<[number, number]>([7, 2]);
  const [end, setEnd] = useState<[number, number]>([7, 22]);
  const [mode, setMode] = useState<"wall" | "start" | "end">("wall");
  const [displayGrid, setDisplayGrid] = useState<CellType[][]>(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as CellType[])
  );

  const getBaseGrid = useCallback(() => {
    return grid.map((row, r) =>
      row.map((cell, c): CellType => {
        if (r === start[0] && c === start[1]) return "start";
        if (r === end[0] && c === end[1]) return "end";
        return cell;
      })
    );
  }, [grid, start, end]);

  const handleCellClick = (r: number, c: number) => {
    if (mode === "start") { setStart([r, c]); }
    else if (mode === "end") { setEnd([r, c]); }
    else {
      setGrid(g => g.map((row, ri) => row.map((cell, ci): CellType =>
        ri === r && ci === c ? (cell === "wall" ? "empty" : "wall") : cell
      )));
    }
    setDisplayGrid(getBaseGrid());
  };

  const runAstar = () => {
    const steps = astar(grid, start, end);
    if (!steps.length) return;
    steps.forEach((step, i) => {
      setTimeout(() => {
        setDisplayGrid(grid.map((row, r) =>
          row.map((cell, c): CellType => {
            const k = `${r},${c}`;
            if (r === start[0] && c === start[1]) return "start";
            if (r === end[0] && c === end[1]) return "end";
            if (i === steps.length - 1 && step.path.includes(k)) return "path";
            if (step.closed.has(k)) return "closed";
            if (step.open.has(k)) return "open";
            return cell;
          })
        ));
      }, i * 30);
    });
  };

  const reset = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as CellType[]));
    setDisplayGrid(Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as CellType[]));
  };

  const finalGrid = displayGrid.map((row, r) => row.map((cell, c): CellType => {
    if (r === start[0] && c === start[1]) return "start";
    if (r === end[0] && c === end[1]) return "end";
    return cell;
  }));

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">A* Pathfinding</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Click to place walls, set start/end, then run A*</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {(["wall", "start", "end"] as const).map(m => (
              <Button key={m} size="sm" variant={mode === m ? "default" : "outline"} onClick={() => setMode(m)} className="h-8 capitalize" data-testid={`button-mode-${m}`}>{m}</Button>
            ))}
            <Button size="sm" onClick={runAstar} className="h-8 ml-4" data-testid="button-run"><Play className="w-3.5 h-3.5 mr-1.5" />Run A*</Button>
            <Button size="sm" variant="ghost" onClick={reset} className="h-8" data-testid="button-reset"><RotateCcw className="w-3.5 h-3.5" /></Button>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {([["open", "Open set"], ["closed", "Closed set"], ["path", "Shortest path"], ["start", "Start"], ["end", "End"], ["wall", "Wall"]] as [CellType, string][]).map(([t, l]) => (
              <div key={t} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${CELL_COLORS[t]}`} />
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-3 overflow-x-auto" data-testid="viz-astar">
          <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, minWidth: COLS * 20 }}>
            {finalGrid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`aspect-square rounded-sm cursor-pointer transition-colors ${CELL_COLORS[cell]}`}
                  style={{ minWidth: 18, minHeight: 18 }}
                  onClick={() => handleCellClick(r, c)}
                  data-testid={`cell-${r}-${c}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
