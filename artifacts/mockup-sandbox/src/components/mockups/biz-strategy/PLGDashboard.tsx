import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Terminal, GitBranch, Settings,
  Search, Bell, Copy, Check, ChevronRight, Activity, Zap, Server, 
  Github, MessageSquare
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, YAxis } from 'recharts';
import './_PLGDashboard.css';

const REVENUE_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i,
  value: 40000 + Math.random() * 10000 + (i * 500),
}));

const SPARKLINE_DATA = Array.from({ length: 20 }, (_, i) => ({
  day: i,
  value: 2000 + Math.random() * 1000 + (i * 100),
}));

const ENDPOINT_USAGE = [
  { name: '/api/v1/auth', calls: 4.2 },
  { name: '/api/v1/users', calls: 3.8 },
  { name: '/api/v1/data', calls: 2.1 },
  { name: '/api/v1/stream', calls: 1.5 },
  { name: '/api/v1/events', calls: 0.8 },
];

const DEPLOYS = [
  { id: 'a1b2c3d', status: 'success', time: '2 min ago', branch: 'main' },
  { id: 'e4f5g6h', status: 'success', time: '1 hour ago', branch: 'feat/new-api' },
  { id: 'i7j8k9l', status: 'failed', time: '3 hours ago', branch: 'fix/auth-bug' },
  { id: 'm0n1o2p', status: 'success', time: '5 hours ago', branch: 'main' },
  { id: 'q3r4s5t', status: 'success', time: '1 day ago', branch: 'main' },
];

export function PLGDashboard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="plg-dashboard min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-[var(--plg-border)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--plg-accent)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-semibold text-lg tracking-tight">NexusAPI</span>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plg-text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search resources, docs... (⌘K)"
              className="plg-input w-full pl-9 pr-4 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[var(--plg-text-secondary)] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 cursor-pointer" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-14 border-r border-[var(--plg-border)] flex flex-col items-center py-4 gap-6 shrink-0 bg-[var(--plg-card-bg)]">
          <button className="text-[var(--plg-accent)]"><LayoutDashboard className="w-5 h-5" /></button>
          <button className="text-[var(--plg-text-secondary)] hover:text-white transition-colors"><Users className="w-5 h-5" /></button>
          <button className="text-[var(--plg-text-secondary)] hover:text-white transition-colors"><Terminal className="w-5 h-5" /></button>
          <button className="text-[var(--plg-text-secondary)] hover:text-white transition-colors"><GitBranch className="w-5 h-5" /></button>
          <button className="text-[var(--plg-text-secondary)] hover:text-white transition-colors"><CreditCard className="w-5 h-5" /></button>
          <div className="flex-1" />
          <button className="text-[var(--plg-text-secondary)] hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 flex gap-6 min-w-0">
          
          {/* Left Column (35%) */}
          <div className="flex flex-col gap-6" style={{ width: '35%' }}>
            {/* API Key Card */}
            <div className="plg-card p-5">
              <h2 className="text-sm font-medium text-[var(--plg-text-secondary)] mb-3 uppercase tracking-wider">Your API Key</h2>
              <div className="flex items-center gap-2 mb-2">
                <div className="plg-input plg-mono text-sm px-3 py-2 flex-1 flex items-center justify-between truncate">
                  <span className="truncate">pk_live_8f92k...</span>
                  <button onClick={handleCopy} className="text-[var(--plg-text-secondary)] hover:text-white ml-2">
                    {copied ? <Check className="w-4 h-4 text-[var(--plg-accent)]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-[var(--plg-text-secondary)]">Generated 2 days ago · Never expires</p>
            </div>

            {/* Quick Start Card */}
            <div className="plg-card p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[var(--plg-border)] flex items-center justify-between bg-black/40">
                <h2 className="text-sm font-medium">Quick Start</h2>
                <span className="text-xs text-[var(--plg-text-secondary)] plg-mono">Node.js</span>
              </div>
              <div className="p-4 bg-[#010409] plg-mono text-sm text-gray-300 leading-relaxed overflow-x-auto">
                <span className="text-purple-400">import</span> {'{ createClient }'} <span className="text-purple-400">from</span> <span className="text-green-300">'@nexus/client'</span>;
                <br /><br />
                <span className="text-purple-400">const</span> client = createClient({'{'}
                <br />
                {'  '}url: <span className="text-green-300">'https://api.nexus.dev'</span>,
                <br />
                {'  '}key: process.env.NEXUS_API_KEY
                <br />
                {'}'});
              </div>
              <div className="p-3 border-t border-[var(--plg-border)] flex justify-end">
                <button className="text-xs text-[var(--plg-accent)] hover:underline flex items-center gap-1">
                  View full documentation <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Invite Team */}
            <div className="plg-card p-5 bg-gradient-to-br from-[var(--plg-card-bg)] to-black relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--plg-accent-dim)] rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <h2 className="text-lg font-semibold mb-2">Build faster together</h2>
              <p className="text-sm text-[var(--plg-text-secondary)] mb-5">
                Invite your team to collaborate on API integrations and monitor usage metrics.
              </p>
              <button className="plg-btn-primary w-full py-2 text-sm">
                Invite Teammates
              </button>
              <p className="text-xs text-center text-[var(--plg-text-secondary)] mt-3">
                3 seats remaining on Free tier
              </p>
            </div>
          </div>

          {/* Center Column (40%) */}
          <div className="flex flex-col gap-6" style={{ width: '40%' }}>
            
            <div className="grid grid-cols-2 gap-6">
              {/* MRR Card */}
              <div className="plg-card p-5 flex flex-col justify-between h-32 relative overflow-hidden">
                <div>
                  <h3 className="text-sm font-medium text-[var(--plg-text-secondary)] mb-1">Total Revenue</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">$47,320</span>
                    <span className="text-xs font-medium text-[var(--plg-accent)] mb-1">↑ 12%</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50">
                   <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SPARKLINE_DATA}>
                      <Line type="monotone" dataKey="value" stroke="var(--plg-accent)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Users */}
              <div className="plg-card p-5 flex flex-col justify-between h-32">
                <div>
                  <h3 className="text-sm font-medium text-[var(--plg-text-secondary)] mb-1">Active Users (7d)</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">1,847</span>
                    <span className="text-xs font-medium text-[var(--plg-accent)] mb-1">↑ 8%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--plg-text-secondary)]">
                  <Users className="w-3 h-3" /> 230 new this week
                </div>
              </div>
            </div>

            {/* Progress Bar Card */}
            <div className="plg-card p-5">
               <div className="flex justify-between items-end mb-3">
                  <h3 className="text-sm font-medium text-[var(--plg-text-secondary)]">API Calls (This Month)</h3>
                  <span className="text-sm plg-mono">12.4M / 50M</span>
               </div>
               <div className="h-2 w-full bg-[#010409] rounded-full overflow-hidden mb-2">
                 <div className="h-full bg-[var(--plg-accent)] rounded-full" style={{ width: '24.8%' }} />
               </div>
               <p className="text-xs text-[var(--plg-text-secondary)]">
                 24.8% of your plan limit used. Resets in 12 days.
               </p>
            </div>

            {/* Main Chart */}
            <div className="plg-card p-5 flex-1 flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-medium text-[var(--plg-text-secondary)]">30-Day Revenue Trend</h3>
                 <select className="bg-transparent border border-[var(--plg-border)] rounded text-xs px-2 py-1 text-[var(--plg-text-secondary)] focus:outline-none">
                   <option>Last 30 Days</option>
                   <option>Last 90 Days</option>
                 </select>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="var(--plg-border)" tick={{ fill: 'var(--plg-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--plg-border)" tick={{ fill: 'var(--plg-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--plg-card-bg)', borderColor: 'var(--plg-border)', borderRadius: '6px' }}
                      itemStyle={{ color: 'var(--plg-accent)' }}
                      labelStyle={{ color: 'var(--plg-text-secondary)' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--plg-accent)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--plg-accent)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column (25%) */}
          <div className="flex flex-col gap-6" style={{ width: '25%' }}>
            
            {/* Recent Deploys */}
            <div className="plg-card p-0 flex flex-col">
              <div className="p-4 border-b border-[var(--plg-border)] flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Deploys</h3>
                <button className="text-xs text-[var(--plg-text-secondary)] hover:text-white">View all</button>
              </div>
              <div className="flex flex-col">
                {DEPLOYS.map((deploy, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border-b border-[var(--plg-border)] last:border-0 hover:bg-white/5 transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${deploy.status === 'success' ? 'bg-[var(--plg-accent)]' : 'bg-red-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm plg-mono font-medium truncate">{deploy.id}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-sm bg-white/10 text-[var(--plg-text-secondary)] truncate">{deploy.branch}</span>
                      </div>
                      <p className="text-xs text-[var(--plg-text-secondary)] mt-0.5">{deploy.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage by endpoint */}
            <div className="plg-card p-5">
              <h3 className="text-sm font-medium text-[var(--plg-text-secondary)] mb-4">Usage by Endpoint (M)</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ENDPOINT_USAGE} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="var(--plg-border)" tick={{ fill: 'var(--plg-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'var(--plg-card-bg)', borderColor: 'var(--plg-border)', borderRadius: '6px' }}
                    />
                    <Bar dataKey="calls" fill="var(--plg-accent)" radius={[0, 4, 4, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Community Card */}
            <div className="plg-card p-5">
               <h3 className="text-sm font-medium text-[var(--plg-text-secondary)] mb-4">Community</h3>
               <div className="flex flex-col gap-3">
                  <a href="#" className="flex items-center justify-between p-3 rounded-md bg-[#010409] hover:bg-white/5 transition-colors border border-[var(--plg-border)]">
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="w-4 h-4" />
                      GitHub
                    </div>
                    <span className="text-xs font-medium plg-mono text-[var(--plg-text-secondary)] flex items-center gap-1">⭐ 4.8k</span>
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded-md bg-[#010409] hover:bg-white/5 transition-colors border border-[var(--plg-border)]">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                      Discord
                    </div>
                    <span className="text-xs font-medium plg-mono text-[var(--plg-text-secondary)]">3.2k</span>
                  </a>
               </div>
            </div>

          </div>

        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-8 border-t border-[var(--plg-border)] bg-[var(--plg-card-bg)] shrink-0 flex items-center px-4 text-xs text-[var(--plg-text-secondary)] justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--plg-accent)]" />
          All systems operational
        </div>
        <div className="flex items-center gap-4 plg-mono">
          <span>API 23ms</span>
          <span>Last updated now</span>
        </div>
      </footer>
    </div>
  );
}
