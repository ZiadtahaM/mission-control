import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BSTNode { val: number; left: BSTNode | null; right: BSTNode | null; }

function insert(root: BSTNode | null, val: number): BSTNode {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) return { ...root, left: insert(root.left, val) };
  if (val > root.val) return { ...root, right: insert(root.right, val) };
  return root;
}

function getHeight(node: BSTNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function inorder(node: BSTNode | null, result: number[] = []): number[] {
  if (!node) return result;
  inorder(node.left, result); result.push(node.val); inorder(node.right, result);
  return result;
}
function preorder(node: BSTNode | null, result: number[] = []): number[] {
  if (!node) return result;
  result.push(node.val); preorder(node.left, result); preorder(node.right, result);
  return result;
}
function postorder(node: BSTNode | null, result: number[] = []): number[] {
  if (!node) return result;
  postorder(node.left, result); postorder(node.right, result); result.push(node.val);
  return result;
}

interface NodePos { val: number; x: number; y: number; parentX?: number; parentY?: number; highlighted: boolean; }

function getPositions(node: BSTNode | null, x: number, y: number, xOff: number, highlighted: Set<number>, positions: NodePos[] = []): NodePos[] {
  if (!node) return positions;
  positions.push({ val: node.val, x, y, highlighted: highlighted.has(node.val) });
  if (node.left) {
    const child = getPositions(node.left, x - xOff, y + 60, xOff / 2, highlighted, []);
    child[0] && (child[0].parentX = x, child[0].parentY = y);
    positions.push(...child);
  }
  if (node.right) {
    const child = getPositions(node.right, x + xOff, y + 60, xOff / 2, highlighted, []);
    child[0] && (child[0].parentX = x, child[0].parentY = y);
    positions.push(...child);
  }
  return positions;
}

export default function BSTPage() {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [insertVal, setInsertVal] = useState("50");
  const [searchVal, setSearchVal] = useState("");
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const handleInsert = () => {
    const v = parseInt(insertVal);
    if (isNaN(v)) return;
    setRoot(r => insert(r, v));
    setInsertVal("");
    setMessage(`Inserted ${v}`);
    setHighlighted(new Set([v]));
    setTimeout(() => setHighlighted(new Set()), 1500);
  };

  const handleSearch = () => {
    const v = parseInt(searchVal);
    if (isNaN(v)) return;
    let node = root;
    const path: number[] = [];
    while (node) {
      path.push(node.val);
      if (v === node.val) { setHighlighted(new Set(path)); setMessage(`Found ${v}!`); setTimeout(() => setHighlighted(new Set()), 2000); return; }
      node = v < node.val ? node.left : node.right;
    }
    setMessage(`${v} not found`);
    setHighlighted(new Set(path));
    setTimeout(() => setHighlighted(new Set()), 2000);
  };

  const runTraversal = (type: "inorder" | "preorder" | "postorder") => {
    const result = type === "inorder" ? inorder(root) : type === "preorder" ? preorder(root) : postorder(root);
    setTraversalResult(result);
    result.forEach((v, i) => setTimeout(() => setHighlighted(new Set([v])), i * 400));
    setTimeout(() => setHighlighted(new Set()), result.length * 400 + 500);
    setMessage(`${type} traversal`);
  };

  const height = getHeight(root);
  const positions = root ? getPositions(root, 280, 40, Math.min(120, 800 / Math.pow(2, Math.max(1, height - 1))), highlighted) : [];
  const SVG_H = Math.max(200, height * 70 + 20);

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Binary Search Tree</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Insert, search, and traverse with animations</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Input value={insertVal} onChange={e => setInsertVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleInsert()} placeholder="Value" className="w-24 h-8 bg-input border-border text-sm font-mono" data-testid="input-insert" />
              <Button size="sm" onClick={handleInsert} className="h-8" data-testid="button-insert">Insert</Button>
            </div>
            <div className="flex gap-2">
              <Input value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="Search" className="w-24 h-8 bg-input border-border text-sm font-mono" data-testid="input-search" />
              <Button size="sm" variant="outline" onClick={handleSearch} className="h-8" data-testid="button-search">Search</Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => runTraversal("inorder")} className="h-8" data-testid="button-inorder">In-order</Button>
              <Button size="sm" variant="outline" onClick={() => runTraversal("preorder")} className="h-8" data-testid="button-preorder">Pre-order</Button>
              <Button size="sm" variant="outline" onClick={() => runTraversal("postorder")} className="h-8" data-testid="button-postorder">Post-order</Button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => { setRoot(null); setHighlighted(new Set()); setTraversalResult([]); setMessage(""); }} className="h-8 ml-auto" data-testid="button-clear">Clear</Button>
          </div>
          {message && <div className="text-xs p-2 rounded bg-primary/10 border border-primary/20 text-primary font-mono" data-testid="text-message">{message}</div>}
          {traversalResult.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {traversalResult.map((v, i) => (
                <Badge key={i} variant={highlighted.has(v) ? "default" : "secondary"} className="font-mono text-xs transition-all">{v}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden" data-testid="viz-bst">
          {!root ? (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">Insert values to build the tree</div>
          ) : (
            <svg width="100%" viewBox={`0 0 560 ${SVG_H}`} className="w-full">
              {positions.filter(p => p.parentX !== undefined).map(p => (
                <line key={`${p.val}-line`} x1={p.parentX} y1={p.parentY} x2={p.x} y2={p.y} stroke="#334155" strokeWidth={1.5} />
              ))}
              {positions.map(p => (
                <g key={p.val}>
                  <circle cx={p.x} cy={p.y} r={18} fill={p.highlighted ? "#6366f1" : "#1e293b"} stroke={p.highlighted ? "#818cf8" : "#475569"} strokeWidth={p.highlighted ? 2 : 1.5} />
                  <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill={p.highlighted ? "white" : "#94a3b8"} fontSize={12} fontWeight="bold" fontFamily="monospace">{p.val}</text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
