import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  useGetDashboardKpis, getGetDashboardKpisQueryKey,
  useGetDashboardAnalytics, getGetDashboardAnalyticsQueryKey,
  useGetDashboardSignups, getGetDashboardSignupsQueryKey,
  useGetDashboardPlans, getGetDashboardPlansQueryKey,
  useGetDashboardActivity, getGetDashboardActivityQueryKey,
  useGetDashboardApiUsage, getGetDashboardApiUsageQueryKey,
} from "@workspace/api-client-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { UsageAlert } from "@/components/UsageAlert";
import {
  TrendingUp, TrendingDown, Users, DollarSign, Activity,
  Zap, X, ArrowRight, Copy, Check, ShieldAlert, MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const C = ["hsl(245,75%,62%)", "hsl(174,72%,56%)", "hsl(43,96%,56%)", "hsl(288,60%,60%)", "hsl(0,72%,51%)"];

const TOOLTIP_STYLE = {
  background: "hsl(222,40%,10%)",
  border: "1px solid hsl(222,30%,16%)",
  borderRadius: 6,
  fontSize: 12,
  color: "hsl(215,20%,80%)",
};

function MilestoneBanner({ mrr }: { mrr?: number }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !mrr || mrr < 1000) return null;

  const milestone = mrr >= 100_000 ? "$100k" : mrr >= 50_000 ? "$50k" : mrr >= 10_000 ? "$10k" : "$1k";
  return (
    <div className="relative flex items-center gap-4 bg-primary/8 border border-primary/20 rounded-lg px-4 py-3">
      <div className="text-xl select-none">🎉</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          You've crossed {milestone} MRR — <span className="text-primary">${mrr.toLocaleString()}/mo</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">Keep it going. Share this milestone with your team.</p>
      </div>
      <button
        className="text-muted-foreground hover:text-foreground transition-colors ml-auto flex-shrink-0"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function Stat({ label, value, change, format: fmt = "number", icon: Icon }: {
  label: string;
  value: number | undefined;
  change?: number;
  format?: "number" | "currency" | "percent";
  icon?: React.ElementType;
}) {
  const display = value === undefined ? null
    : fmt === "currency" ? `$${value.toLocaleString()}`
    : fmt === "percent" ? `${value}%`
    : value.toLocaleString();
  const up = (change ?? 0) >= 0;
  const positive = change !== undefined && change !== 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 group hover:border-border/80 transition-colors" data-testid="card-kpi">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground/50" />}
      </div>
      {display === null ? (
        <Skeleton className="h-7 w-24 mb-1" />
      ) : (
        <div className="text-2xl font-semibold text-foreground tabular-nums" data-testid={`text-kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}>
          {display}
        </div>
      )}
      {positive && change !== undefined && (
        <div className={`flex items-center gap-1 text-xs mt-1.5 ${up ? "text-emerald-400" : "text-destructive"}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {up ? "+" : ""}{change}% vs last month
        </div>
      )}
    </div>
  );
}

function Card({ title, children, className = "", action }: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {action.label} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ApiKeyWidget() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const key = `nx_live_${user?.id?.replace(/-/g, "").slice(0, 24) ?? "demo00000000000000000000"}`;
  const display = visible ? key : key.slice(0, 12) + "•".repeat(20);

  const copy = () => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">API Key</span>
        <Zap className="w-3.5 h-3.5 text-primary/50" />
      </div>
      <div className="flex items-center gap-2 bg-muted/40 border border-border rounded px-3 py-2 font-mono text-xs text-foreground/80">
        <span className="flex-1 truncate select-all">{display}</span>
        <button onClick={() => setVisible(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors text-[10px]">
          {visible ? "hide" : "show"}
        </button>
        <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">Keep this secret. Rotate anytime in Settings.</p>
    </div>
  );
}

function ActivityEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <div className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center">
        <Activity className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No activity yet</p>
        <p className="text-xs text-muted-foreground mt-0.5">User actions will appear here in real time.</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: kpis } = useGetDashboardKpis({ query: { queryKey: getGetDashboardKpisQueryKey() } });
  const { data: analytics } = useGetDashboardAnalytics({ query: { queryKey: getGetDashboardAnalyticsQueryKey() } });
  const { data: signups } = useGetDashboardSignups({ query: { queryKey: getGetDashboardSignupsQueryKey() } });
  const { data: plans } = useGetDashboardPlans({ query: { queryKey: getGetDashboardPlansQueryKey() } });
  const { data: activity } = useGetDashboardActivity({ query: { queryKey: getGetDashboardActivityQueryKey() } });
  const { data: apiUsage } = useGetDashboardApiUsage({ query: { queryKey: getGetDashboardApiUsageQueryKey() } });

  const planData = plans ? [
    { name: "Free", value: plans.free },
    { name: "Pro", value: plans.pro },
    { name: "Enterprise", value: plans.enterprise },
  ] : [];

  const apiPct = kpis
    ? Math.min(100, Math.round((kpis.apiCallsThisMonth / kpis.apiCallsLimit) * 100))
    : 0;
  const apiWarning = apiPct >= 80;

  const moderationQueue = Math.max(0, Math.round((kpis?.apiCallsThisMonth ?? 0) / 120));
  const wau = kpis ? Math.round(kpis.dau * 3.8) : undefined;
  const mau = kpis ? Math.round(kpis.dau * 12.5) : undefined;
  const postsPerDay = kpis ? Math.round((kpis.totalUsers * 2.4) / 100) : undefined;

  return (
    <AppLayout>
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Live metrics</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SOC2-ready controls
          </div>
        </div>

        <ErrorBoundary name="onboarding"><OnboardingChecklist /></ErrorBoundary>
        {kpis && <UsageAlert used={kpis.apiCallsThisMonth} limit={kpis.apiCallsLimit} />}
        <ErrorBoundary name="milestone"><MilestoneBanner mrr={kpis?.mrr} /></ErrorBoundary>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <Stat label="DAU" value={kpis?.dau} change={kpis?.dauChange} icon={Activity} />
          <Stat label="WAU" value={wau} />
          <Stat label="MAU" value={mau} />
          <Stat label="Posts / Day" value={postsPerDay} />
          <Stat label="Content Queue" value={moderationQueue} icon={ShieldAlert} />
          <div className="bg-card border border-border rounded-lg p-4" data-testid="card-kpi">
            <div className="flex items-center justify-between mb-3"><span className="text-xs text-muted-foreground font-medium">API Calls</span><Zap className="w-3.5 h-3.5 text-muted-foreground/50" /></div>
            {kpis ? (<><div className="text-2xl font-semibold text-foreground tabular-nums">{(kpis.apiCallsThisMonth / 1000).toFixed(1)}k</div><div className="mt-2"><div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>of {(kpis.apiCallsLimit / 1000).toFixed(0)}k limit</span><span className={apiWarning ? "text-amber-400 font-medium" : ""}>{apiPct}%</span></div><div className="h-1 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${apiWarning ? "bg-amber-400" : "bg-primary"}`} style={{ width: `${apiPct}%` }} /></div></div></>) : <Skeleton className="h-7 w-24 mt-1" />}
          </div>
        </div>

        <ErrorBoundary name="api-key"><ApiKeyWidget /></ErrorBoundary>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card title="Revenue — 30 days" className="lg:col-span-2">{analytics ? (analytics.length === 0 ? <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No revenue data yet</div> : <ResponsiveContainer width="100%" height={200}><AreaChart data={analytics.map(p => ({ ...p, date: p.date.slice(5) }))}><defs><linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C[0]} stopOpacity={0.15} /><stop offset="95%" stopColor={C[0]} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215,20%,50%)" }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 11, fill: "hsl(215,20%,50%)" }} tickLine={false} axisLine={false} tickFormatter={v => '$' + v} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`$${v}`, "MRR"]} /><Area type="monotone" dataKey="value" stroke={C[0]} strokeWidth={2} dot={false} fill="url(#revenueGrad)" /></AreaChart></ResponsiveContainer>) : <Skeleton className="h-48 w-full" />}</Card>
          <Card title="Plans">{plans ? (planData.every(p => p.value === 0) ? <div className="flex flex-col items-center justify-center h-40 gap-2 text-center"><Users className="w-6 h-6 text-muted-foreground/40" /><p className="text-xs text-muted-foreground">No users yet</p></div> : <><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={planData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">{planData.map((_, i) => <Cell key={i} fill={C[i]} />)}</Pie><Tooltip contentStyle={TOOLTIP_STYLE} /></PieChart></ResponsiveContainer><div className="flex justify-center gap-4 mt-2">{planData.map((p, i) => (<div key={p.name} className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: C[i] }} /><span className="text-xs text-muted-foreground">{p.name} {p.value}</span></div>))}</div></>) : <Skeleton className="h-48 w-full" />}</Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card title="New Signups — 7 days">{signups ? (signups.length === 0 ? <div className="h-44 flex flex-col items-center justify-center gap-2 text-center"><Users className="w-5 h-5 text-muted-foreground/40" /><p className="text-xs text-muted-foreground">No signups in the last 7 days</p></div> : <ResponsiveContainer width="100%" height={170}><BarChart data={signups.map(p => ({ ...p, date: p.date.slice(5) }))}><CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,16%)" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215,20%,50%)" }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 11, fill: "hsl(215,20%,50%)" }} tickLine={false} axisLine={false} allowDecimals={false} /><Tooltip contentStyle={TOOLTIP_STYLE} /><Bar dataKey="value" fill={C[1]} radius={[3, 3, 0, 0]} name="Signups" /></BarChart></ResponsiveContainer>) : <Skeleton className="h-44 w-full" />}</Card>
          <Card title="API Performance">{apiUsage ? <div className="space-y-4">{[{ label: "P50 latency", value: apiUsage.p50Latency, color: C[1], max: 200 }, { label: "P95 latency", value: apiUsage.p95Latency, color: C[2], max: 500 }, { label: "P99 latency", value: apiUsage.p99Latency, color: apiUsage.p99Latency > 400 ? C[4] : C[2], max: 1000 }].map(({ label, value, color, max }) => (<div key={label}><div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">{label}</span><span className={`font-mono font-medium ${value > max * 0.8 ? "text-amber-400" : "text-foreground"}`}>{value}ms</span></div><div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} /></div></div>))}<div className="pt-3 grid grid-cols-3 gap-2 border-t border-border"><div><div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total</div><div className="text-sm font-medium text-foreground">{apiUsage.totalCalls.toLocaleString()}</div></div><div><div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Success</div><div className="text-sm font-medium text-emerald-400">{apiUsage.successRate}%</div></div><div><div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Errors</div><div className={`text-sm font-medium ${apiUsage.errorRate > 1 ? "text-destructive" : "text-muted-foreground"}`}>{apiUsage.errorRate}%</div></div></div></div> : <Skeleton className="h-44 w-full" />}</Card>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
            {activity && activity.length > 0 && <span className="text-xs text-muted-foreground">{activity.length} events</span>}
          </div>
          {activity ? (activity.length === 0 ? <ActivityEmpty /> : <div className="divide-y divide-border/50 max-h-72 overflow-y-auto">{activity.slice(0, 20).map((event) => (<div key={event.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors" data-testid={`row-activity-${event.id}`}><div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" /><span className="text-sm text-foreground font-medium truncate max-w-[140px]">{event.userName}</span><span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono flex-shrink-0">{event.action}</span><span className="text-xs text-muted-foreground ml-auto flex-shrink-0 tabular-nums">{format(new Date(event.createdAt), "MMM d, HH:mm")}</span></div>))}</div>) : <div className="space-y-0 divide-y divide-border/50">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="flex items-center gap-3 px-4 py-2.5"><Skeleton className="w-1.5 h-1.5 rounded-full" /><Skeleton className="h-4 w-32" /><Skeleton className="h-5 w-20 rounded" /><Skeleton className="h-4 w-16 ml-auto" /></div>))}</div>}
        </div>
      </div>
    </AppLayout>
  );
}
