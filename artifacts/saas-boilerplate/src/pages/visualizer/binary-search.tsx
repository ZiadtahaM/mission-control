import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, SkipForward, RotateCcw } from "lucide-react";

interface Step {
  left: number; right: number; mid: number;
  comparison: string; found: boolean; notFound: boolean;
}

function binarySearchSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const v = arr[mid]!;
    if (v === target) {
      steps.push({ left, right, mid, comparison: `arr[${mid}]=${v} === ${target} ✓ Found!`, found: true, notFound: false });
      return steps;
    } else if (v < target) {
      steps.push({ left, right, mid, comparison: `arr[${mid}]=${v} < ${target}, search right half`, found: false, notFound: false });
      left = mid + 1;
    } else {
      steps.push({ left, right, mid, comparison: `arr[${mid}]=${v} > ${target}, search left half`, found: false, notFound: false });
      right = mid - 1;
    }
  }
  steps.push({ left, right, mid: -1, comparison: `Target ${target} not found`, found: false, notFound: true });
  return steps;
}

export default function BinarySearchPage() {
  const [arrayInput, setArrayInput] = useState("2 5 8 12 16 23 38 56 72 91");
  const [target, setTarget] = useState("23");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [arr, setArr] = useState<number[]>([]);

  const parseArr = () => {
    const a = arrayInput.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
    return [...new Set(a)].sort((x, y) => x - y);
  };

  const run = () => {
    const a = parseArr();
    const t = parseInt(target);
    if (isNaN(t) || a.length === 0) return;
    setArr(a);
    setSteps(binarySearchSteps(a, t));
    setCurrentStep(0);
  };

  const step = steps[currentStep];

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Binary Search</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Step through binary search with pointer visualization</p>
          <Badge variant="secondary" className="mt-2 font-mono text-xs">O(log n)</Badge>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Array (space-separated, will be sorted)</label>
              <Input value={arrayInput} onChange={e => setArrayInput(e.target.value)} placeholder="2 5 8 12 16 23..." className="bg-input border-border text-sm font-mono" data-testid="input-array" />
            </div>
            <div className="w-28">
              <label className="text-xs text-muted-foreground mb-1 block">Target</label>
              <Input value={target} onChange={e => setTarget(e.target.value)} placeholder="23" className="bg-input border-border text-sm font-mono" data-testid="input-target" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={run} className="h-8" data-testid="button-start"><Play className="w-3.5 h-3.5 mr-1.5" />Start</Button>
            <Button size="sm" variant="outline" onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))} disabled={currentStep >= steps.length - 1 || currentStep < 0} className="h-8" data-testid="button-next-step">
              <SkipForward className="w-3.5 h-3.5 mr-1.5" />Next step
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setCurrentStep(-1); setSteps([]); setArr([]); }} className="h-8" data-testid="button-reset">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />Reset
            </Button>
            <span className="text-xs text-muted-foreground flex items-center ml-auto">
              Step {Math.max(0, currentStep + 1)} / {steps.length}
            </span>
          </div>
        </div>

        {arr.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4" data-testid="viz-binary-search">
            {/* Array boxes */}
            <div className="overflow-x-auto">
              <div className="flex gap-1.5 min-w-max">
                {arr.map((v, i) => {
                  const isLeft = step?.left === i;
                  const isRight = step?.right === i;
                  const isMid = step?.mid === i;
                  const isFound = isMid && step?.found;
                  const isNotFound = step?.notFound;
                  const inRange = step && i >= step.left && i <= step.right;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-md border-2 text-sm font-semibold transition-all ${
                        isFound ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" :
                        isNotFound && isMid ? "bg-destructive/10 border-destructive text-destructive" :
                        isMid ? "bg-primary/20 border-primary text-primary" :
                        inRange ? "bg-muted/50 border-border text-foreground" :
                        "bg-muted/20 border-border/40 text-muted-foreground"
                      }`} data-testid={`box-${i}`}>{v}</div>
                      <div className="text-xs text-muted-foreground font-mono">{i}</div>
                      <div className="h-4 flex gap-0.5">
                        {isLeft && <span className="text-xs font-bold text-blue-400">L</span>}
                        {isMid && <span className="text-xs font-bold text-primary">M</span>}
                        {isRight && <span className="text-xs font-bold text-rose-400">R</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-400" /><span>Left</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary" /><span>Mid</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-rose-400" /><span>Right</span></div>
            </div>

            {/* Comparison */}
            {step && (
              <div className={`p-3 rounded-lg border text-sm font-mono ${
                step.found ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                step.notFound ? "bg-destructive/10 border-destructive/30 text-destructive" :
                "bg-primary/10 border-primary/30 text-primary"
              }`} data-testid="text-comparison">
                {step.comparison}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
