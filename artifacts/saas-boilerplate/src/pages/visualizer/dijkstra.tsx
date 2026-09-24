import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Shuffle } from "lucide-react";

interface Node { id: number; x: number; y: number; }
interface Edge { from: number; to: number; weight: number; }

type NodeState = "unvisited" | "current" | "visited" | "path";
const NODE_COLORS: Record<NodeState, string> = {
  unvisited: "#334155",
  current: "#6366f1",
  visited: "#10b981",
  path: "#f59e0b",
};

function generateRandomGraph(n = 6): { nodes: Node[]; edges: Edge[] } {
  const W = 560, H = 300, PAD = 60;
  const nodes: Node[] = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: PAD + Math.random() * (W - 2 * PAD),
    y: PAD + Math.random() * (H - 2 * PAD),
  }));
  const edges: Edge[] = [];
  // Ensure connectivity + some extra edges
  for (let i = 1; i < n; i++) {
    const j = Math.floor(Math.random() * i);
    const w = Math.floor(Math.random() * 9) + 1;
    edges.push({ from: i, to: j, weight: w });
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < 0.3) {
        const w = Math.floor(Math.random() * 9) + 1;
        edges.push({ from: i, to: j, weight: w });
      }
    }
  }
  return { nodes, edges };
}

interface DijkstraStep {
  nodeStates: Record<number, NodeState>;
  distances: Record<number, number>;
  pathEdges: Set<string>;
  queue: { id: number; dist: number }[];
  description: string;
}

function runDijkstra(nodes: Node[], edges: Edge[], start: number): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const dist: Record<number, number> = {};
  const prev: Record<number, number | null> = {};
  const visited = new Set<number>();
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[start] = 0;

  const getNeighbors = (id: number) => edges
    .filter(e => e.from === id || e.to === id)
    .map(e => ({ id: e.from === id ? e.to : e.from, weight: e.weight }));

  const addStep = (current: number, desc: string) => {
    const pathEdges = new Set<string>();
    nodes.forEach(n => {
      let v = n.id;
      while (prev[v] !== null && prev[v] !== undefined) {
        pathEdges.add(`${Math.min(v, prev[v]!)}-${Math.max(v, prev[v]!)}`);
        v = prev[v]!;
      }
    });
    steps.push({
      nodeStates: Object.fromEntries(nodes.map(n => [n.id, visited.has(n.id) ? "visited" : n.id === current ? "current" : "unvisited"])),
      distances: { ...dist },
      pathEdges,
      queue: nodes.filter(n => !visited.has(n.id)).map(n => ({ id: n.id, dist: dist[n.id]! })).sort((a, b) => a.dist - b.dist),
      description: desc,
    });
  };

  addStep(-1, `Start Dijkstra from node ${start}. All distances = ∞ except start = 0.`);

  while (visited.size < nodes.length) {
    const unvisited = nodes.filter(n => !visited.has(n.id));
    if (!unvisited.length) break;
    const u = unvisited.reduce((min, n) => dist[n.id]! < dist[min.id]! ? n : min);
    if (dist[u.id] === Infinity) break;
    visited.add(u.id);
    addStep(u.id, `Process node ${u.id} (dist=${dist[u.id]}). Explore neighbors.`);

    for (const { id: v, weight: w } of getNeighbors(u.id)) {
      if (visited.has(v)) continue;
      const newDist = dist[u.id]! + w;
      if (newDist < dist[v]!) {
        dist[v] = newDist;
        prev[v] = u.id;
        addStep(u.id, `Update dist[${v}] = ${newDist} via node ${u.id} + edge(${w})`);
      }
    }
  }

  // Final: highlight all shortest paths
  const finalPathEdges = new Set<string>();
  nodes.forEach(n => {
    let v = n.id;
    while (prev[v] !== null && prev[v] !== undefined) {
      finalPathEdges.add(`${Math.min(v, prev[v]!)}-${Math.max(v, prev[v]!)}`);
      v = prev[v]!;
    }
  });
  steps.push({
    nodeStates: Object.fromEntries(nodes.map(n => [n.id, "path"])),
    distances: { ...dist },
    pathEdges: finalPathEdges,
    queue: [],
    description: "Done! Gold edges show shortest paths from source.",
  });

  return steps;
}

export default function DijkstraPage() {
  const [{ nodes, edges }, setGraph] = useState(generateRandomGraph);
  const [start, setStart] = useState(0);
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const shuffle = () => { setGraph(generateRandomGraph()); setSteps([]); setCurrentStep(-1); };
  const reset = () => { setSteps([]); setCurrentStep(-1); };

  const run = () => {
    const s = runDijkstra(nodes, edges, start);
    setSteps(s);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const SVG_W = 560, SVG_H = 300;

  const getEdgeKey = (e: Edge) => `${Math.min(e.from, e.to)}-${Math.max(e.from, e.to)}`;

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dijkstra's Algorithm</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Shortest path on weighted graphs</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Start node:</span>
            <div className="flex gap-1.5">
              {nodes.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setStart(n.id); reset(); }}
                  className={`w-7 h-7 rounded-full text-xs font-bold border-2 transition-all ${start === n.id ? "bg-primary border-primary text-white" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  data-testid={`button-node-${n.id}`}
                >{n.id}</button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <Button size="sm" onClick={run} className="h-8" data-testid="button-run"><Play className="w-3.5 h-3.5 mr-1.5" />Run</Button>
              <Button size="sm" variant="outline" onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))} disabled={currentStep >= steps.length - 1 || currentStep < 0} className="h-8" data-testid="button-next">Next</Button>
              <Button size="sm" variant="ghost" onClick={shuffle} className="h-8" data-testid="button-shuffle"><Shuffle className="w-3.5 h-3.5 mr-1.5" />New graph</Button>
              <Button size="sm" variant="ghost" onClick={reset} className="h-8" data-testid="button-reset"><RotateCcw className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
          {step && (
            <div className="text-xs p-2 rounded bg-primary/10 border border-primary/20 text-primary font-mono" data-testid="text-description">
              Step {currentStep + 1}/{steps.length}: {step.description}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* SVG Graph */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-3 overflow-hidden" data-testid="viz-dijkstra">
            <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
              {/* Edges */}
              {edges.map(e => {
                const from = nodes.find(n => n.id === e.from)!;
                const to = nodes.find(n => n.id === e.to)!;
                const isPath = step?.pathEdges.has(getEdgeKey(e));
                const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
                return (
                  <g key={`${e.from}-${e.to}`}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={isPath ? "#f59e0b" : "#334155"} strokeWidth={isPath ? 3 : 1.5} />
                    <text x={mx} y={my - 4} textAnchor="middle" fill="#94a3b8" fontSize={11} fontFamily="monospace">{e.weight}</text>
                  </g>
                );
              })}
              {/* Nodes */}
              {nodes.map(n => {
                const state = (step?.nodeStates[n.id] ?? "unvisited") as NodeState;
                const d = step?.distances[n.id];
                return (
                  <g key={n.id} onClick={() => { setStart(n.id); reset(); }} style={{ cursor: "pointer" }}>
                    <circle cx={n.x} cy={n.y} r={20} fill={NODE_COLORS[state]} stroke={n.id === start ? "#6366f1" : "#475569"} strokeWidth={n.id === start ? 2.5 : 1.5} />
                    <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={13} fontWeight="bold" fontFamily="monospace">{n.id}</text>
                    {d !== undefined && (
                      <text x={n.x} y={n.y - 26} textAnchor="middle" fill="#94a3b8" fontSize={10} fontFamily="monospace">
                        {d === Infinity ? "∞" : d}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Distance table */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Distance Table</h3>
            <div className="space-y-1.5">
              {nodes.map(n => {
                const d = step?.distances[n.id];
                const state = (step?.nodeStates[n.id] ?? "unvisited") as NodeState;
                return (
                  <div key={n.id} className="flex items-center justify-between" data-testid={`dist-node-${n.id}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: NODE_COLORS[state] }}>{n.id}</div>
                      <span className="text-xs text-muted-foreground">Node {n.id}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-foreground">{d === undefined ? "∞" : d === Infinity ? "∞" : d}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-border pt-3">
              <h4 className="text-xs font-semibold text-foreground mb-2">Legend</h4>
              {(Object.entries(NODE_COLORS) as [NodeState, string][]).map(([s, c]) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: c }} />
                  <span className="text-xs text-muted-foreground capitalize">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
