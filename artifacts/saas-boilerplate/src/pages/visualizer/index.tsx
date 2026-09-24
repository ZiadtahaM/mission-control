import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { GitGraph, Search, ArrowUpDown, TreePine, Grid3x3, Network, Layers } from "lucide-react";

const ALGORITHMS = [
  { href: "/visualizer/sorting", icon: ArrowUpDown, label: "Sorting Algorithms", desc: "Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Tim Sort" },
  { href: "/visualizer/binary-search", icon: Search, label: "Binary Search", desc: "Step-by-step binary search with pointer visualization" },
  { href: "/visualizer/dijkstra", icon: GitGraph, label: "Dijkstra's Algorithm", desc: "Interactive shortest path on weighted graphs" },
  { href: "/visualizer/bst", icon: TreePine, label: "Binary Search Tree", desc: "Insert, delete, search with traversal animations" },
  { href: "/visualizer/astar", icon: Grid3x3, label: "A* Pathfinding", desc: "Grid-based pathfinding with heuristic visualization" },
  { href: "/visualizer/graph-traversal", icon: Network, label: "BFS / DFS Traversal", desc: "Breadth-first vs depth-first comparison" },
  { href: "/visualizer/dp", icon: Layers, label: "Dynamic Programming", desc: "Knapsack and LCS with DP table visualization" },
];

export default function VisualizerIndexPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground">Algorithm Visualizer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Step-by-step visualizations of classic algorithms</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {ALGORITHMS.map((alg) => (
            <Link key={alg.href} href={alg.href}>
              <a
                className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/40 hover:bg-card/80 transition-colors group"
                data-testid={`card-algo-${alg.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <alg.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{alg.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{alg.desc}</div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
