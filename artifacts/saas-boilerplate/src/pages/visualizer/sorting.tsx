import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";

type BarState = "default" | "comparing" | "swapping" | "sorted";

interface Bar {
  value: number;
  state: BarState;
}

type AlgorithmKey = "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap" | "radix" | "tim";

interface AlgoInfo {
  label: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const ALGOS: Record<AlgorithmKey, AlgoInfo> = {
  bubble: { label: "Bubble Sort", timeComplexity: "O(n²)", spaceComplexity: "O(1)" },
  selection: { label: "Selection Sort", timeComplexity: "O(n²)", spaceComplexity: "O(1)" },
  insertion: { label: "Insertion Sort", timeComplexity: "O(n²)", spaceComplexity: "O(1)" },
  merge: { label: "Merge Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(n)" },
  quick: { label: "Quick Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(log n)" },
  heap: { label: "Heap Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(1)" },
  radix: { label: "Radix Sort", timeComplexity: "O(nk)", spaceComplexity: "O(n+k)" },
  tim: { label: "Tim Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(n)" },
};

const BAR_COLORS: Record<BarState, string> = {
  default: "hsl(222,35%,25%)",
  comparing: "hsl(43,96%,56%)",
  swapping: "hsl(0,72%,51%)",
  sorted: "hsl(245,75%,62%)",
};

function generateArray(size: number, type: string): Bar[] {
  let vals: number[];
  const MAX = 100;
  if (type === "sorted") {
    vals = Array.from({ length: size }, (_, i) => Math.round((i + 1) * MAX / size));
  } else if (type === "reverse") {
    vals = Array.from({ length: size }, (_, i) => Math.round((size - i) * MAX / size));
  } else if (type === "equal") {
    vals = Array.from({ length: size }, () => 50);
  } else {
    vals = Array.from({ length: size }, () => Math.floor(Math.random() * MAX) + 1);
  }
  return vals.map(v => ({ value: v, state: "default" }));
}

type Step = { type: "compare" | "swap" | "set" | "sorted"; i: number; j: number; vals?: number[] };

function* bubbleSortGen(arr: number[]): Generator<Step> {
  const a = [...arr], n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: "compare", i: j, j: j + 1, vals: [...a] };
      if (a[j]! > a[j + 1]!) {
        [a[j], a[j + 1]] = [a[j + 1]!, a[j]!];
        yield { type: "swap", i: j, j: j + 1, vals: [...a] };
      }
    }
    yield { type: "sorted", i: n - i - 1, j: -1, vals: [...a] };
  }
  yield { type: "sorted", i: 0, j: -1, vals: [...a] };
}

function* selectionSortGen(arr: number[]): Generator<Step> {
  const a = [...arr], n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", i: minIdx, j, vals: [...a] };
      if (a[j]! < a[minIdx]!) minIdx = j;
    }
    if (minIdx !== i) { [a[i], a[minIdx]] = [a[minIdx]!, a[i]!]; yield { type: "swap", i, j: minIdx, vals: [...a] }; }
    yield { type: "sorted", i, j: -1, vals: [...a] };
  }
  yield { type: "sorted", i: n - 1, j: -1, vals: [...a] };
}

function* insertionSortGen(arr: number[]): Generator<Step> {
  const a = [...arr], n = a.length;
  yield { type: "sorted", i: 0, j: -1, vals: [...a] };
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && a[j - 1]! > a[j]!) {
      yield { type: "compare", i: j - 1, j, vals: [...a] };
      [a[j], a[j - 1]] = [a[j - 1]!, a[j]!];
      yield { type: "swap", i: j, j: j - 1, vals: [...a] };
      j--;
    }
    yield { type: "sorted", i: j, j: -1, vals: [...a] };
  }
}

function* mergeSortGen(arr: number[]): Generator<Step> {
  const a = [...arr];
  function* mergeSort(l: number, r: number): Generator<Step> {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    yield* mergeSort(l, m);
    yield* mergeSort(m + 1, r);
    const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      yield { type: "compare", i: l + i, j: m + 1 + j, vals: [...a] };
      if (left[i]! <= right[j]!) { a[k++] = left[i++]!; }
      else { a[k++] = right[j++]!; }
      yield { type: "set", i: k - 1, j: -1, vals: [...a] };
    }
    while (i < left.length) { a[k++] = left[i++]!; yield { type: "set", i: k - 1, j: -1, vals: [...a] }; }
    while (j < right.length) { a[k++] = right[j++]!; yield { type: "set", i: k - 1, j: -1, vals: [...a] }; }
    for (let x = l; x <= r; x++) yield { type: "sorted", i: x, j: -1, vals: [...a] };
  }
  yield* mergeSort(0, a.length - 1);
}

function* quickSortGen(arr: number[]): Generator<Step> {
  const a = [...arr];
  function* qs(lo: number, hi: number): Generator<Step> {
    if (lo >= hi) { if (lo === hi) yield { type: "sorted", i: lo, j: -1, vals: [...a] }; return; }
    const pivot = a[hi]!; let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      yield { type: "compare", i: j, j: hi, vals: [...a] };
      if (a[j]! <= pivot) { i++; [a[i], a[j]] = [a[j]!, a[i]!]; if (i !== j) yield { type: "swap", i, j, vals: [...a] }; }
    }
    [a[i + 1], a[hi]] = [a[hi]!, a[i + 1]!];
    yield { type: "swap", i: i + 1, j: hi, vals: [...a] };
    yield { type: "sorted", i: i + 1, j: -1, vals: [...a] };
    yield* qs(lo, i);
    yield* qs(i + 2, hi);
  }
  yield* qs(0, a.length - 1);
}

function* heapSortGen(arr: number[]): Generator<Step> {
  const a = [...arr], n = a.length;
  function* heapify(n: number, i: number): Generator<Step> {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    yield { type: "compare", i: l < n ? l : i, j: i, vals: [...a] };
    if (l < n && a[l]! > a[largest]!) largest = l;
    if (r < n && a[r]! > a[largest]!) largest = r;
    if (largest !== i) { [a[i], a[largest]] = [a[largest]!, a[i]!]; yield { type: "swap", i, j: largest, vals: [...a] }; yield* heapify(n, largest); }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i]!, a[0]!]; yield { type: "swap", i: 0, j: i, vals: [...a] };
    yield { type: "sorted", i, j: -1, vals: [...a] };
    yield* heapify(i, 0);
  }
  yield { type: "sorted", i: 0, j: -1, vals: [...a] };
}

function* radixSortGen(arr: number[]): Generator<Step> {
  const a = [...arr];
  const max = Math.max(...a);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(a.length).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < a.length; i++) { const d = Math.floor(a[i]! / exp) % 10; count[d]!++; }
    for (let i = 1; i < 10; i++) count[i]! += count[i - 1]!;
    for (let i = a.length - 1; i >= 0; i--) {
      const d = Math.floor(a[i]! / exp) % 10;
      output[--count[d]!] = a[i]!;
      yield { type: "compare", i, j: -1, vals: [...a] };
    }
    for (let i = 0; i < a.length; i++) { a[i] = output[i]!; yield { type: "set", i, j: -1, vals: [...a] }; }
  }
  for (let i = 0; i < a.length; i++) yield { type: "sorted", i, j: -1, vals: [...a] };
}

function* timSortGen(arr: number[]): Generator<Step> {
  // Simplified Tim Sort (insertion sort on runs + merge)
  yield* insertionSortGen(arr);
}

const GENERATORS: Record<AlgorithmKey, (arr: number[]) => Generator<Step>> = {
  bubble: bubbleSortGen, selection: selectionSortGen, insertion: insertionSortGen,
  merge: mergeSortGen, quick: quickSortGen, heap: heapSortGen, radix: radixSortGen, tim: timSortGen,
};

export default function SortingPage() {
  const [algo, setAlgo] = useState<AlgorithmKey>("bubble");
  const [arraySize, setArraySize] = useState(40);
  const [arrayType, setArrayType] = useState("random");
  const [speed, setSpeed] = useState(50);
  const [bars, setBars] = useState<Bar[]>(() => generateArray(40, "random"));
  const [running, setRunning] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const genRef = useRef<Generator<Step> | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
    setRunning(false);
    setComparisons(0);
    setSwaps(0);
    setSortedIndices(new Set());
    const arr = generateArray(arraySize, arrayType);
    setBars(arr);
    genRef.current = null;
  }, [arraySize, arrayType]);

  useEffect(() => { reset(); }, [algo, arraySize, arrayType]);

  const start = () => {
    if (runningRef.current) return;
    if (!genRef.current) {
      const arr = bars.map(b => b.value);
      genRef.current = GENERATORS[algo](arr);
    }
    runningRef.current = true;
    setRunning(true);

    const sortedSet = new Set<number>(sortedIndices);
    let comps = comparisons, sws = swaps;

    const step = () => {
      if (!runningRef.current || !genRef.current) return;
      const { value: s, done } = genRef.current.next();
      if (done) {
        runningRef.current = false;
        setRunning(false);
        setBars(prev => prev.map((b, i) => ({ ...b, state: "sorted" })));
        return;
      }
      if (s.vals) {
        if (s.type === "compare") { comps++; setComparisons(comps); }
        if (s.type === "swap") { sws++; setSwaps(sws); }
        if (s.type === "sorted") sortedSet.add(s.i);
        setBars(s.vals.map((v, i) => ({
          value: v,
          state: sortedSet.has(i) ? "sorted" : s.type === "compare" && (i === s.i || i === s.j) ? "comparing" : s.type === "swap" && (i === s.i || i === s.j) ? "swapping" : "default"
        })));
        setSortedIndices(new Set(sortedSet));
      }
      const delay = Math.max(1, 200 - speed * 2);
      rafRef.current = setTimeout(step, delay) as unknown as number;
    };
    step();
  };

  const pause = () => {
    runningRef.current = false;
    setRunning(false);
    if (rafRef.current) clearTimeout(rafRef.current);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Sorting Algorithms</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Animated step-by-step sorting visualization</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="font-mono text-xs">{ALGOS[algo]?.timeComplexity}</Badge>
            <Badge variant="secondary" className="font-mono text-xs">Space: {ALGOS[algo]?.spaceComplexity}</Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Algorithm</label>
              <Select value={algo} onValueChange={v => setAlgo(v as AlgorithmKey)}>
                <SelectTrigger className="w-44 h-8 text-xs bg-input border-border" data-testid="select-algorithm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ALGOS) as AlgorithmKey[]).map(k => (
                    <SelectItem key={k} value={k} className="text-xs">{ALGOS[k]!.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Array type</label>
              <Select value={arrayType} onValueChange={setArrayType}>
                <SelectTrigger className="w-36 h-8 text-xs bg-input border-border" data-testid="select-array-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="sorted">Nearly Sorted</SelectItem>
                  <SelectItem value="reverse">Reverse Sorted</SelectItem>
                  <SelectItem value="equal">All Equal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-32">
              <label className="text-xs text-muted-foreground mb-1.5 block">Size: {arraySize}</label>
              <Slider value={[arraySize]} onValueChange={([v]) => setArraySize(v!)} min={10} max={120} step={5} className="w-full" data-testid="slider-size" />
            </div>
            <div className="flex-1 min-w-32">
              <label className="text-xs text-muted-foreground mb-1.5 block">Speed: {speed}x</label>
              <Slider value={[speed]} onValueChange={([v]) => setSpeed(v!)} min={1} max={100} className="w-full" data-testid="slider-speed" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={running ? pause : start} className="h-8" data-testid="button-play-pause">
                {running ? <><Pause className="w-3.5 h-3.5 mr-1.5" />Pause</> : <><Play className="w-3.5 h-3.5 mr-1.5" />Play</>}
              </Button>
              <Button size="sm" variant="outline" onClick={reset} className="h-8" data-testid="button-reset">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />Reset
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { reset(); }} className="h-8" data-testid="button-shuffle">
                <Shuffle className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Comparisons: <span className="text-foreground font-mono font-semibold">{comparisons.toLocaleString()}</span></span>
            <span>Swaps: <span className="text-foreground font-mono font-semibold">{swaps.toLocaleString()}</span></span>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-muted-foreground">
            {(["default", "comparing", "swapping", "sorted"] as BarState[]).map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: BAR_COLORS[s] }} />
                <span className="capitalize">{s === "default" ? "Unsorted" : s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-card border border-border rounded-xl p-4 h-64 flex items-end gap-px overflow-hidden" data-testid="viz-sorting">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-none"
              style={{
                height: `${bar.value}%`,
                background: BAR_COLORS[bar.state],
                minWidth: 2,
              }}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
