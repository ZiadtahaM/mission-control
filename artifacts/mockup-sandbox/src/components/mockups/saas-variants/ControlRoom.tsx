import React, { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { 
  Activity, Users, DollarSign, Cpu, Search, Bell, Settings, Command, 
  Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Zap, Server
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import "./_control-room.css";

// --- Dummy Data ---
const revenueData = [
  { month: "Jan", revenue: 32400 },
  { month: "Feb", revenue: 34100 },
  { month: "Mar", revenue: 38900 },
  { month: "Apr", revenue: 41200 },
  { month: "May", revenue: 44500 },
  { month: "Jun", revenue: 47320 },
];

const kpiData = [
  { label: "MRR", value: "$47,320", trend: "+8.2%", icon: DollarSign, color: "text-cyan-400" },
  { label: "Churn", value: "2.1%", trend: "-0.4%", icon: Activity, color: "text-emerald-400" },
  { label: "DAU", value: "1,847", trend: "+12%", icon: Users, color: "text-blue-400" },
  { label: "API Calls", value: "12.4M", trend: "+3.1%", icon: Cpu, color: "text-purple-400" },
];

const systemHealth = [
  { service: "Auth API", status: "operational", latency: "24ms", uptime: "99.99%" },
  { service: "Payment Gateway", status: "operational", latency: "142ms", uptime: "99.95%" },
  { service: "WebSocket Hub", status: "degraded", latency: "840ms", uptime: "98.20%" },
  { service: "Database Cluster", status: "operational", latency: "8ms", uptime: "99.99%" },
  { service: "Worker Queue", status: "operational", latency: "12ms", uptime: "99.90%" },
  { service: "CDN Edge", status: "operational", latency: "4ms", uptime: "100%" },
];

const activityLog = [
  { time: "10:42:01", event: "User batch import completed", type: "info" },
  { time: "10:38:15", event: "High latency detected on WSS", type: "warn" },
  { time: "10:15:00", event: "Daily backup verified", type: "success" },
  { time: "09:55:22", event: "Payment webhook failed (500)", type: "error" },
];

// --- Sub-components ---

const Sidebar = () => {
  return (
    <div className="cr-sidebar-container absolute left-0 top-0 bottom-0 h-full">
      <div className="cr-sidebar-primary gap-6 text-muted-foreground">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary mb-4">
          <Terminal size={18} />
        </div>
        <button className="p-2 hover:text-primary transition-colors hover:bg-secondary rounded-md"><Activity size={20} /></button>
        <button className="p-2 hover:text-primary transition-colors hover:bg-secondary rounded-md"><Users size={20} /></button>
        <button className="p-2 hover:text-primary transition-colors hover:bg-secondary rounded-md"><DollarSign size={20} /></button>
        <button className="p-2 hover:text-primary transition-colors hover:bg-secondary rounded-md"><Server size={20} /></button>
        <div className="mt-auto mb-4 flex flex-col gap-4">
          <button className="p-2 hover:text-primary transition-colors hover:bg-secondary rounded-md"><Settings size={20} /></button>
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <AvatarFallback>OP</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="cr-sidebar-secondary flex flex-col py-4 px-4">
        <div className="text-xs font-mono text-muted-foreground uppercase mb-4 tracking-wider">Navigation</div>
        <div className="flex flex-col gap-1">
          {["Overview", "Users", "Revenue", "Infrastructure"].map((item, i) => (
            <div key={i} className="text-sm py-2 px-2 hover:bg-secondary rounded-md cursor-pointer text-foreground/80 hover:text-primary transition-colors">
              {item}
            </div>
          ))}
        </div>
        
        <div className="text-xs font-mono text-muted-foreground uppercase mt-8 mb-4 tracking-wider">Quick Actions</div>
        <div className="flex flex-col gap-1">
          {["Restart Workers", "Flush Cache", "Generate Report"].map((item, i) => (
            <div key={i} className="text-sm py-2 px-2 hover:bg-secondary rounded-md cursor-pointer text-foreground/80 hover:text-primary transition-colors">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Topbar = () => {
  return (
    <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 pl-[70px]">
      <div className="flex items-center gap-4">
        <h1 className="font-mono font-bold text-sm tracking-widest text-primary glow-text uppercase">Control Room</h1>
        <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/30 rounded-sm px-1.5 py-0">v2.4.1-prod</Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-sm text-muted-foreground w-64 hover:border-primary/50 transition-colors cursor-text">
          <Search size={14} />
          <span>Search...</span>
          <div className="ml-auto flex items-center gap-1 font-mono text-[10px]">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        </button>
      </div>
    </div>
  );
};

const KpiCard = ({ data }: { data: any }) => {
  const Icon = data.icon;
  return (
    <div className="panel p-4 flex flex-col gap-2 glow-border transition-all cursor-default group">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-wider font-semibold">{data.label}</span>
        <Icon size={14} className={`group-hover:${data.color} transition-colors`} />
      </div>
      <div className="flex items-end justify-between mt-2">
        <span className="font-mono text-2xl font-bold text-foreground tracking-tight">{data.value}</span>
        <span className={`text-xs font-mono ${data.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
          {data.trend}
        </span>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status }: { status: string }) => {
  switch (status) {
    case 'operational':
      return <CheckCircle2 size={14} className="text-emerald-400" />;
    case 'degraded':
      return <AlertTriangle size={14} className="text-amber-400 animate-pulse" />;
    default:
      return <ShieldAlert size={14} className="text-red-400" />;
  }
};

const Footer = () => {
  return (
    <div className="h-8 border-t border-border bg-background flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground fixed bottom-0 w-full pl-[56px] z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-emerald-500">SYSTEM NOMINAL</span>
        </div>
        <span className="text-border">|</span>
        <span>42ms latency</span>
        <span className="text-border">|</span>
        <span>Last sync: 3s ago</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Region: us-east-1</span>
        <span>Active Workers: 142</span>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function ControlRoom() {
  return (
    <div className="control-room-root min-h-screen text-foreground overflow-hidden relative pb-8">
      <Sidebar />
      
      <div className="pl-[48px] h-full flex flex-col">
        <Topbar />
        
        <div className="flex-1 p-6 overflow-y-auto cr-main-content">
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Column: KPIs */}
            <div className="col-span-3 flex flex-col gap-4">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap size={12} className="text-primary" /> Metrics
              </h2>
              {kpiData.map((kpi, idx) => (
                <KpiCard key={idx} data={kpi} />
              ))}
              
              <div className="panel mt-auto p-4 border-l-2 border-l-primary">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Active Session</h3>
                <div className="font-mono text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">ID</span>
                    <span>root_29xj9</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Uptime</span>
                    <span>4d 12h 3m</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Center Column: Chart & Logs */}
            <div className="col-span-6 flex flex-col gap-6">
              <div className="panel p-4 flex-1 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Revenue Trend (6Mo)</h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] bg-secondary border-border font-mono cursor-pointer hover:border-primary">1D</Badge>
                    <Badge variant="outline" className="text-[10px] bg-secondary border-border font-mono cursor-pointer hover:border-primary">1W</Badge>
                    <Badge variant="outline" className="text-[10px] bg-primary/20 text-primary border-primary/50 font-mono cursor-pointer">1M</Badge>
                  </div>
                </div>
                
                <div className="flex-1 cr-chart-container w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "4px" }}
                        itemStyle={{ color: "hsl(var(--primary))", fontFamily: "monospace" }}
                        labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="panel p-4 h-48 flex flex-col">
                <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Live Activity Stream</h2>
                <div className="flex-1 overflow-y-auto font-mono text-xs flex flex-col gap-2">
                  {activityLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-1.5 hover:bg-secondary rounded">
                      <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                      <span className={`shrink-0 ${
                        log.type === 'error' ? 'text-red-400' : 
                        log.type === 'warn' ? 'text-amber-400' : 
                        log.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                      }`}>
                        {log.type.toUpperCase().padEnd(7)}
                      </span>
                      <span className="text-foreground/80 truncate">{log.event}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-muted-foreground p-1.5">
                    <span className="w-2 h-4 bg-primary animate-pulse"></span>
                    <span>Waiting for incoming events...</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: System Health */}
            <div className="col-span-3 flex flex-col gap-4">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">System Health</h2>
              
              <div className="panel p-4 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Overall Status</span>
                    <span className="font-mono text-sm text-amber-400">Degraded Performance</span>
                  </div>
                  <Progress value={85} className="w-16 h-2 bg-secondary" indicatorClassName="bg-amber-400" />
                </div>
                
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1">
                  {systemHealth.map((sys, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status={sys.status} />
                          <span className="text-sm font-medium">{sys.service}</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{sys.latency}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Uptime: {sys.uptime}</span>
                        {sys.status === 'degraded' && <span className="text-amber-400 animate-pulse">Investigating</span>}
                      </div>
                      {idx !== systemHealth.length - 1 && <div className="h-px bg-border/50 w-full mt-2" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
