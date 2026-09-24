import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function knapsack(weights: number[], values: number[], capacity: number): number[][] {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1]! <= w) {
        dp[i]![w] = Math.max(dp[i - 1]![w]!, dp[i - 1]![w - weights[i - 1]!]! + values[i - 1]!);
      } else {
        dp[i]![w] = dp[i - 1]![w]!;
      }
    }
  }
  return dp;
}

function lcs(s1: string, s2: string): number[][] {
  const m = s1.length, n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i]![j] = dp[i - 1]![j - 1]! + 1;
      else dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
  }
  return dp;
}

function getLCSString(dp: number[][], s1: string, s2: string): string {
  let i = s1.length, j = s2.length, result = "";
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) { result = s1[i - 1]! + result; i--; j--; }
    else if (dp[i - 1]![j]! > dp[i]![j - 1]!) i--;
    else j--;
  }
  return result;
}

export default function DPPage() {
  const [kWeights, setKWeights] = useState("2 3 4 5");
  const [kValues, setKValues] = useState("3 4 5 6");
  const [kCapacity, setKCapacity] = useState("8");
  const [kDp, setKDp] = useState<number[][]>([]);
  const [kResult, setKResult] = useState<number | null>(null);

  const [lcsS1, setLcsS1] = useState("ABCBDAB");
  const [lcsS2, setLcsS2] = useState("BDCAB");
  const [lcsDp, setLcsDp] = useState<number[][]>([]);
  const [lcsResult, setLcsResult] = useState<string>("");

  const runKnapsack = () => {
    const weights = kWeights.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
    const values = kValues.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
    const capacity = parseInt(kCapacity);
    if (!weights.length || !values.length || isNaN(capacity)) return;
    const n = Math.min(weights.length, values.length);
    const dp = knapsack(weights.slice(0, n), values.slice(0, n), capacity);
    setKDp(dp);
    setKResult(dp[n]![capacity]!);
  };

  const runLCS = () => {
    const s1 = lcsS1.trim().toUpperCase(), s2 = lcsS2.trim().toUpperCase();
    if (!s1 || !s2) return;
    const dp = lcs(s1, s2);
    setLcsDp(dp);
    setLcsResult(getLCSString(dp, s1, s2));
  };

  const maxK = kDp.reduce((m, r) => Math.max(m, Math.max(...r)), 0);
  const maxL = lcsDp.reduce((m, r) => Math.max(m, Math.max(...r)), 0);

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dynamic Programming</h1>
          <p className="text-sm text-muted-foreground mt-0.5">DP table visualization for classic problems</p>
        </div>

        <Tabs defaultValue="knapsack">
          <TabsList className="bg-muted">
            <TabsTrigger value="knapsack" data-testid="tab-knapsack">0/1 Knapsack</TabsTrigger>
            <TabsTrigger value="lcs" data-testid="tab-lcs">LCS</TabsTrigger>
          </TabsList>

          <TabsContent value="knapsack" className="space-y-4 mt-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Weights</label>
                  <Input value={kWeights} onChange={e => setKWeights(e.target.value)} className="bg-input border-border text-sm font-mono" data-testid="input-weights" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Values</label>
                  <Input value={kValues} onChange={e => setKValues(e.target.value)} className="bg-input border-border text-sm font-mono" data-testid="input-values" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Capacity</label>
                  <Input value={kCapacity} onChange={e => setKCapacity(e.target.value)} className="bg-input border-border text-sm font-mono w-24" data-testid="input-capacity" />
                </div>
              </div>
              <Button size="sm" onClick={runKnapsack} className="h-8" data-testid="button-run-knapsack">Compute</Button>
              {kResult !== null && <div className="text-sm font-semibold text-primary">Max value: {kResult}</div>}
            </div>

            {kDp.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto" data-testid="viz-knapsack">
                <div className="text-xs text-muted-foreground mb-2">DP Table (rows=items+1, cols=capacity+1)</div>
                <table className="border-collapse text-xs font-mono">
                  <tbody>
                    {kDp.map((row, i) => (
                      <tr key={i}>
                        <td className="pr-2 text-muted-foreground">{i === 0 ? "—" : `i${i}`}</td>
                        {row.map((val, j) => (
                          <td key={j} className="w-8 h-7 text-center border border-border/30 text-xs font-mono"
                            style={{ background: val === 0 ? "transparent" : `hsl(245,75%,${30 + (val / maxK) * 35}%)`, color: val === 0 ? "hsl(215,20%,40%)" : "white" }}
                            data-testid={`cell-k-${i}-${j}`}
                          >{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lcs" className="space-y-4 mt-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">String 1</label>
                  <Input value={lcsS1} onChange={e => setLcsS1(e.target.value)} className="bg-input border-border text-sm font-mono uppercase" data-testid="input-s1" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">String 2</label>
                  <Input value={lcsS2} onChange={e => setLcsS2(e.target.value)} className="bg-input border-border text-sm font-mono uppercase" data-testid="input-s2" />
                </div>
              </div>
              <Button size="sm" onClick={runLCS} className="h-8" data-testid="button-run-lcs">Compute LCS</Button>
              {lcsResult && <div className="text-sm font-semibold text-primary font-mono">LCS: "{lcsResult}" (length: {lcsResult.length})</div>}
            </div>

            {lcsDp.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto" data-testid="viz-lcs">
                <div className="text-xs text-muted-foreground mb-2">LCS DP Table</div>
                <table className="border-collapse text-xs font-mono">
                  <thead>
                    <tr>
                      <td className="w-8 h-7" />
                      <td className="w-8 h-7 text-center text-muted-foreground">""</td>
                      {lcsS2.toUpperCase().split("").map((c, i) => <td key={i} className="w-8 h-7 text-center text-primary font-bold">{c}</td>)}
                    </tr>
                  </thead>
                  <tbody>
                    {lcsDp.map((row, i) => (
                      <tr key={i}>
                        <td className="pr-1 text-center text-primary font-bold">{i === 0 ? '""' : lcsS1[i - 1]?.toUpperCase()}</td>
                        {row.map((val, j) => (
                          <td key={j} className="w-8 h-7 text-center border border-border/30"
                            style={{ background: val === 0 ? "transparent" : `hsl(245,75%,${30 + (val / maxL) * 35}%)`, color: val === 0 ? "hsl(215,20%,40%)" : "white" }}
                            data-testid={`cell-lcs-${i}-${j}`}
                          >{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
