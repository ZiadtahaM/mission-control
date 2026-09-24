import React from "react";
import "./_EnterpriseDashboard.css";
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  Key, 
  Lock, 
  FileText, 
  Activity, 
  Server, 
  Globe, 
  Settings, 
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";

const SLADetails = [
  { time: "00:00", requests: 12000 },
  { time: "04:00", requests: 8000 },
  { time: "08:00", requests: 35000 },
  { time: "12:00", requests: 54000 },
  { time: "16:00", requests: 48000 },
  { time: "20:00", requests: 22000 },
  { time: "24:00", requests: 15000 },
];

export function EnterpriseDashboard() {
  return (
    <div className="enterprise-dashboard text-[12px]">
      {/* Top Bar */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-[hsl(var(--card))]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="h-5 w-5" />
            <span>SECURECORP</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Production</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Security Dashboard</span>
          </div>
          <div className="ml-4 flex items-center gap-2 px-2 py-1 bg-secondary rounded text-[10px] font-medium border border-border">
            <span className="text-primary">Enterprise Plan</span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-green-400">SOC2 Type II <CheckCircle2 className="h-3 w-3" /></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-[hsl(var(--card))]"></span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="font-medium">Sarah Jenkins</span>
              <span className="text-[10px] text-primary bg-primary/10 px-1 rounded">SUPER_ADMIN</span>
            </div>
            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center font-medium border border-border">
              SJ
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3rem)]">
        {/* Sidebar */}
        <aside className="w-[220px] border-r bg-[hsl(var(--card))] overflow-y-auto shrink-0">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search resources, IP..." 
                className="w-full bg-secondary border border-border rounded pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <nav className="p-2 space-y-4">
            <div>
              <div className="text-[10px] font-bold text-muted-foreground mb-1 px-2 uppercase tracking-wider">Overview</div>
              <ul className="space-y-0.5">
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded bg-primary/10 text-primary font-medium">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <ShieldAlert className="h-4 w-4" />
                    Security Score
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="text-[10px] font-bold text-muted-foreground mb-1 px-2 uppercase tracking-wider">Users & Access</div>
              <ul className="space-y-0.5">
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Users className="h-4 w-4" />
                    All Users
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Key className="h-4 w-4" />
                    Roles & Permissions
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Lock className="h-4 w-4" />
                    SSO Configuration
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-bold text-muted-foreground mb-1 px-2 uppercase tracking-wider">Compliance</div>
              <ul className="space-y-0.5">
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <FileText className="h-4 w-4" />
                    Audit Log
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      GDPR Controls
                    </div>
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-bold text-muted-foreground mb-1 px-2 uppercase tracking-wider">System</div>
              <ul className="space-y-0.5">
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Server className="h-4 w-4" />
                    API Keys
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Activity className="h-4 w-4" />
                    Uptime & SLA
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--background))]">
          <div className="max-w-[1400px] mx-auto space-y-4">
            
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[hsl(var(--card))] border border-border rounded p-3 flex flex-col justify-between h-[80px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium">Uptime (30d)</span>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold mono text-green-400">99.98%</span>
                  <span className="text-green-400 text-[10px] bg-green-400/10 px-1 rounded">+0.01%</span>
                </div>
              </div>
              <div className="bg-[hsl(var(--card))] border border-border rounded p-3 flex flex-col justify-between h-[80px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium">Security Score</span>
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold mono text-amber-500">94/100</span>
                  <span className="text-amber-500 text-[10px] bg-amber-500/10 px-1 rounded">-2 pts</span>
                </div>
              </div>
              <div className="bg-[hsl(var(--card))] border border-border rounded p-3 flex flex-col justify-between h-[80px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium">Active Sessions</span>
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold mono">247</span>
                  <span className="text-muted-foreground text-[10px]">Current</span>
                </div>
              </div>
              <div className="bg-[hsl(var(--card))] border border-border rounded p-3 flex flex-col justify-between h-[80px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium">Compliance Alerts</span>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold mono text-amber-500">3</span>
                  <span className="text-amber-500 text-[10px] bg-amber-500/10 px-1 rounded">Needs Review</span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-10 gap-4">
              {/* Security Events */}
              <div className="col-span-6 bg-[hsl(var(--card))] border border-border rounded">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    Security Events (Last 24h)
                  </h2>
                  <a href="#" className="text-primary hover:underline">View All</a>
                </div>
                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50 text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Timestamp</th>
                        <th className="px-3 py-2 font-medium">Event Type</th>
                        <th className="px-3 py-2 font-medium">User / Actor</th>
                        <th className="px-3 py-2 font-medium">IP Address</th>
                        <th className="px-3 py-2 font-medium">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="mono text-[11px]">
                      {[
                        { time: "10:42:01", type: "LOGIN_FAILED", user: "j.doe@acme.com", ip: "192.168.1.42", sev: "yellow" },
                        { time: "09:15:22", type: "MFA_BYPASS_ATTEMPT", user: "system_svc", ip: "45.22.11.8", sev: "red" },
                        { time: "08:30:00", type: "PERMISSION_CHANGE", user: "admin@corp", ip: "10.0.0.5", sev: "green" },
                        { time: "07:12:45", type: "LOGIN_SUCCESS", user: "s.smith@corp", ip: "10.0.0.12", sev: "green" },
                        { time: "06:05:11", type: "API_KEY_CREATED", user: "dev_ops_1", ip: "192.168.1.100", sev: "yellow" },
                        { time: "05:40:02", type: "LOGIN_FAILED", user: "unknown", ip: "188.42.1.9", sev: "red" },
                        { time: "04:11:18", type: "DATA_EXPORT", user: "analyst@corp", ip: "10.0.0.44", sev: "yellow" },
                        { time: "02:30:00", type: "LOGIN_SUCCESS", user: "ciso@corp", ip: "10.0.0.2", sev: "green" },
                      ].map((evt, i) => (
                        <tr key={i} className="border-b border-border/50 table-row cursor-pointer">
                          <td className="px-3 py-2 text-muted-foreground">{evt.time}</td>
                          <td className="px-3 py-2">{evt.type}</td>
                          <td className="px-3 py-2 truncate max-w-[120px]">{evt.user}</td>
                          <td className="px-3 py-2 text-muted-foreground">{evt.ip}</td>
                          <td className="px-3 py-2">
                            {evt.sev === 'red' && <span className="text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">CRITICAL</span>}
                            {evt.sev === 'yellow' && <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">WARNING</span>}
                            {evt.sev === 'green' && <span className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">INFO</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Roles & SSO */}
              <div className="col-span-4 flex flex-col gap-4">
                <div className="bg-[hsl(var(--card))] border border-border rounded p-3 flex-1">
                  <h2 className="font-bold text-sm mb-3">Role Distribution</h2>
                  <div className="flex h-6 w-full rounded overflow-hidden mb-2">
                    <div className="bg-primary/80 w-[5%]" title="SUPER_ADMIN: 2"></div>
                    <div className="bg-primary/50 w-[15%]" title="ADMIN: 8"></div>
                    <div className="bg-secondary w-[80%]" title="USER: 1,847"></div>
                  </div>
                  <div className="flex justify-between text-muted-foreground mono">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/80"></span>SUPER (2)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/50"></span>ADMIN (8)</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span>USER (1.8k)</div>
                  </div>
                </div>
                
                <div className="bg-[hsl(var(--card))] border border-border rounded p-3 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-sm">SSO Status</h2>
                    <span className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20 uppercase text-[10px] font-bold tracking-wide flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      Active
                    </span>
                  </div>
                  <div className="bg-secondary/50 rounded p-2 mb-2 border border-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Protocol</span>
                      <span className="mono">SAML 2.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Configured IdPs</span>
                      <span className="mono">2 (Okta, Azure AD)</span>
                    </div>
                  </div>
                  <button className="w-full py-1.5 border border-border rounded text-center hover:bg-secondary transition-colors">
                    Manage SSO Providers
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              {/* Compliance Checklist */}
              <div className="bg-[hsl(var(--card))] border border-border rounded">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Compliance Readiness
                  </h2>
                </div>
                <div className="p-3">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">MFA Enforced globally</div>
                        <div className="text-muted-foreground text-[10px]">All users require 2FA for access</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Audit Log Enabled</div>
                        <div className="text-muted-foreground text-[10px]">90-day retention policy active</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">SOC2 Type II Report</div>
                        <div className="text-muted-foreground text-[10px]">Valid through Dec 2024</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 bg-amber-500/5 p-2 rounded border border-amber-500/20">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-amber-500">GDPR DPA Not Signed</div>
                        <div className="text-muted-foreground text-[10px]">Required for EU data processing</div>
                        <button className="mt-1 text-primary hover:underline text-[10px]">Review Document</button>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 bg-amber-500/5 p-2 rounded border border-amber-500/20">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-amber-500">Penetration Test Overdue</div>
                        <div className="text-muted-foreground text-[10px]">Last test was 14 months ago</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* API Usage */}
              <div className="bg-[hsl(var(--card))] border border-border rounded flex flex-col">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    API Usage (Requests/hr)
                  </h2>
                  <span className="mono text-muted-foreground text-[10px]">Last 24h</span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex-1 min-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SLADetails} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '12px' }}
                          itemStyle={{ color: 'hsl(var(--primary))' }}
                        />
                        <ReferenceLine y={50000} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'SLA Limit (50k)', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
                        <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorReq)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-muted-foreground text-[10px] text-center">
                    Peak usage hit 54k req/hr at 12:00, exceeding SLA threshold momentarily.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Full Width Audit Log */}
            <div className="bg-[hsl(var(--card))] border border-border rounded mb-4">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Audit Log (Recent)
                </h2>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors text-muted-foreground flex items-center gap-1">
                    <Search className="h-3 w-3" /> Filter
                  </button>
                  <button className="px-2 py-1 border border-border rounded hover:bg-secondary transition-colors text-primary flex items-center gap-1">
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Action</th>
                      <th className="px-3 py-2 font-medium">Actor</th>
                      <th className="px-3 py-2 font-medium">Resource</th>
                      <th className="px-3 py-2 font-medium">IP Address</th>
                      <th className="px-3 py-2 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody className="mono text-[11px]">
                    {[
                      { action: "UPDATE_SSO_CONFIG", actor: "sj@securecorp.com", res: "SAML_AZURE", ip: "192.168.1.5", time: "2023-10-24 11:42:01 UTC" },
                      { action: "CREATE_USER", actor: "sj@securecorp.com", res: "USER:m.jones", ip: "192.168.1.5", time: "2023-10-24 11:38:15 UTC" },
                      { action: "VIEW_AUDIT_LOG", actor: "auditor@external.com", res: "LOG_EXPORT", ip: "203.0.113.42", time: "2023-10-24 10:15:00 UTC" },
                      { action: "DELETE_API_KEY", actor: "system_admin", res: "KEY_PROD_1", ip: "10.0.0.1", time: "2023-10-24 09:01:22 UTC" },
                      { action: "ROLE_ASSIGNMENT", actor: "sj@securecorp.com", res: "ROLE:ADMIN -> d.smith", ip: "192.168.1.5", time: "2023-10-24 08:45:10 UTC" },
                    ].map((log, i) => (
                      <tr key={i} className="border-b border-border/50 table-row">
                        <td className="px-3 py-2 text-foreground">{log.action}</td>
                        <td className="px-3 py-2 text-muted-foreground">{log.actor}</td>
                        <td className="px-3 py-2 text-primary">{log.res}</td>
                        <td className="px-3 py-2 text-muted-foreground">{log.ip}</td>
                        <td className="px-3 py-2 text-muted-foreground">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
