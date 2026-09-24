import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

interface Node { id: number; x: number; y: number; }
interface Edge { from: number; to: number; }

const DEMO_NODES: Node[] = [
  { id: 0, x: 60, y: 130 }, { id: 1, x: 150, y: 60 }, { id: 2, x: 150, y: 200 },
  { id: 3, x: 240, y: 130 }, { id: 4, x: 300, y: 60 }, { id: 5, x: 300, y: 200 },
  { id: 6, x: 380, y: 130 }, { id: 7, x: 440, y: 60 }, { id: 8, x: 440, y: 200 },
];
const DEMO_EDGES: Edge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 },
  { from: 3, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 6 },
  { from: 6, to: 7 }, { from: 6, to: 8 },
];

function bfsOrder(nodes: Node[], edges: Edge[], start: number): number[] {
  const adj: Record<number, number[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => { adj[e.from]!.push(e.to); adj[e.to]!.push(e.from); });
  const visited = new Set<number>([start]);
  const queue = [start], order = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nb of (adj[cur] ?? []).sort((a, b) => a - b)) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); order.push(nb); }
    }
  }
  return order;
}

function dfsOrder(nodes: Node[], edges: Edge[], start: number): number[] {
  const adj: Record<number, number[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => { adj[e.from]!.push(e.to); adj[e.to]!.push(e.from); });
  const visited = new Set<number>();
  const order: number[] = [];
  const stack = [start];
  while (stack.length) {
    const cur = stack.pop()!;
    if (!visited.has(cur)) { visited.add(cur); order.push(cur); stack.push(...(adj[cur] ?? []).sort((a, b) => b - a)); }
  }
  return order;
}

export default function GraphTraversalPage() {
  const [bfsHighlight, setBfsHighlight] = useState<Set<number>>(new Set());
  const [dfsHighlight, setDfsHighlight] = useState<Set<number>>(new Set());
  const [bfsOrder, setBfsOrder] = useState<number[]>([]);
  const [dfsOrder, setDfsOrder] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const start = 0;

  const run = () => {
    setRunning(true);
    setBfsHighlight(new Set()); setDfsHighlight(new Set());
    const bfs = bfsOrder(DEMO_NODES, DEMO_EDGES, start);
    const dfs = dfsOrder(DEMO_NODES, DEMO_EDGES, start);
    setBfsOrder(bfs); setDfsOrder(dfs);
    const maxLen = Math.max(bfs.length, dfs.length);
    for (let i = 0; i < maxLen; i++) {
      setTimeout(() => {
        if (i < bfs.length) setBfsHighlight(h => new Set([...h, bfs[i]!]));
        if (i < dfs.length) setDfsHighlight(h => new Set([...h, dfs[i]!]));
        if (i === maxLen - 1) setRunning(false);
      }, i * 500);
    }
  };

  const reset = () => { setBfsHighlight(new Set()); setDfsHighlight(new Set()); setBfsOrder([]); setDfsOrder([]); setRunning(false); };

  const renderGraph = (highlighted: Set<number>, label: string) => (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      </div>
      <svg width="100%" viewBox="0 0 500 260" className="w-full">
        {DEMO_EDGES.map(e => {
          const from = DEMO_NODES.find(n => n.id === e.from)!;
          const to = DEMO_NODES.find(n => n.id === e.to)!;
          return <line key={`${e.from}-${e.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#334155" strokeWidth={1.5} />;
        })}
        {DEMO_NODES.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={18} fill={n.id === start ? "#6366f1" : highlighted.has(n.id) ? "#10b981" : "#1e293b"} stroke={highlighted.has(n.id) ? "#10b981" : "#475569"} strokeWidth={1.5} />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={12} fontWeight="bold" fontFamily="monospace">{n.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">BFS / DFS Traversal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Side-by-side breadth-first vs depth-first comparison</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <Button size="sm" onClick={run} disabled={running} className="h-8" data-testid="button-run">
            <Play className="w-3.5 h-3.5 mr-1.5" />Run both
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="h-8" data-testid="button-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />Reset
          </Button>
          <div className="ml-4 flex gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /><span>Start node</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span>Visited</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderGraph(bfsHighlight, "BFS (Breadth-First)")}
          {renderGraph(dfsHighlight, "DFS (Depth-First)")}
        </div>

        {bfsOrder.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">BFS Order (Queue-based)</h4>
              <div className="flex flex-wrap gap-1.5">
                {bfsOrder.map((v, i) => (
                  <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${bfsHighlight.has(v) ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`} data-testid={`bfs-${i}`}>{v}</span>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">DFS Order (Stack-based)</h4>
              <div className="flex flex-wrap gap-1.5">
                {dfsOrder.map((v, i) => (
                  <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${dfsHighlight.has(v) ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`} data-testid={`dfs-${i}`}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
