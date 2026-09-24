import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Bell, Settings, 
  Plus, X, AlertTriangle, AlertCircle, CheckCircle2,
  TrendingUp, TrendingDown, ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const chartData = [
  { date: 'Oct 1', revenue: 42000 },
  { date: 'Oct 5', revenue: 45000 },
  { date: 'Oct 10', revenue: 44500 },
  { date: 'Oct 15', revenue: 48000 },
  { date: 'Oct 20', revenue: 52000 },
  { date: 'Oct 25', revenue: 51000 },
  { date: 'Oct 30', revenue: 56000 },
];

const topUsers = [
  { id: 1, name: 'Acme Corp', plan: 'Enterprise', mrr: '$4,500', growth: '+12%' },
  { id: 2, name: 'Globex', plan: 'Enterprise', mrr: '$3,800', growth: '+5%' },
  { id: 3, name: 'Soylent', plan: 'Growth', mrr: '$2,100', growth: '-2%' },
  { id: 4, name: 'Initech', plan: 'Growth', mrr: '$1,850', growth: '+8%' },
  { id: 5, name: 'Umbrella', plan: 'Startup', mrr: '$950', growth: '+15%' },
];

const alerts = [
  { id: 1, type: 'critical', title: 'Database CPU above 90%', time: '10m ago', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { id: 2, type: 'warning', title: 'High latency on API route /v1/events', time: '1h ago', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { id: 3, type: 'resolved', title: 'Failed background jobs processed', time: '3h ago', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
];

export default function TabbedWorkspace() {
  const [activeRail, setActiveRail] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard-1');

  const tabs = [
    { id: 'dashboard-1', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'users-1', title: 'Users: plan=Growth', icon: Users },
    { id: 'billing-1', title: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-300 font-sans flex overflow-hidden">
      {/* Icon Rail */}
      <div className="w-14 shrink-0 bg-[#151923] border-r border-slate-800 flex flex-col items-center py-4 z-20">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center mb-8 shadow-lg shadow-violet-500/20 text-white font-bold text-sm">
          W
        </div>
        
        <nav className="flex flex-col gap-4 w-full">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'users', icon: Users },
            { id: 'billing', icon: CreditCard },
            { id: 'alerts', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveRail(item.id)}
              className={`relative flex items-center justify-center w-full h-10 group transition-colors ${
                activeRail === item.id ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {activeRail === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full" />
              )}
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 w-full">
          <button className="flex items-center justify-center w-full h-10 text-slate-500 hover:text-slate-300 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-700 mx-auto border border-slate-600 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0E1117]">
        {/* Tab Bar */}
        <div className="h-10 bg-[#151923] border-b border-slate-800 flex items-center px-2 z-10 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-2 h-8 px-3 rounded-md text-sm border transition-all select-none max-w-[200px] ${
                    isActive 
                      ? 'bg-[#1C212D] border-slate-700 text-slate-100 shadow-sm' 
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-[#1C212D]/50 hover:text-slate-300'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  <span className="truncate">{tab.title}</span>
                  <div 
                    className={`w-4 h-4 rounded-sm flex items-center justify-center ml-1 shrink-0 transition-colors ${
                      isActive ? 'hover:bg-slate-600 text-slate-400' : 'opacity-0 group-hover:opacity-100 hover:bg-slate-700 text-slate-500'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <X className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-[#1C212D] hover:text-slate-300 transition-colors ml-1">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">Workspace overview and key metrics.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 rounded-md bg-[#1C212D] border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                  Last 30 Days
                </button>
                <button className="px-3 py-1.5 rounded-md bg-violet-600 text-sm font-medium text-white hover:bg-violet-700 shadow-sm shadow-violet-900/50 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Monthly Recurring Revenue', value: '$124,500', change: '+12.5%', trend: 'up' },
                { label: 'Active Users', value: '12,450', change: '+5.2%', trend: 'up' },
                { label: 'Churn Rate', value: '2.4%', change: '-0.4%', trend: 'down' },
                { label: 'System Uptime', value: '99.99%', change: '0.0%', trend: 'neutral' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#151923] border border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="text-slate-400 text-sm font-medium mb-2">{stat.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-semibold text-slate-100">{stat.value}</div>
                    <div className={`flex items-center text-xs font-medium ${
                      stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Layout 2 Cols */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart */}
              <div className="lg:col-span-2 bg-[#151923] border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-slate-100">Revenue Growth</h3>
                  <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center">
                    View full report <ArrowUpRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => '$' + (val / 1000) + 'k'} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#c4b5fd' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Users Table */}
              <div className="bg-[#151923] border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-100">Top Users by MRR</h3>
                  <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {topUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#1C212D] border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.plan}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-200">{user.mrr}</div>
                        <div className={`text-xs ${user.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {user.growth}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="bg-[#151923] border border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#11141c]">
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" /> Open Alerts
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">2 NEW</span>
                </h3>
                <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">
                  Mark all as read
                </button>
              </div>
              <div className="divide-y divide-slate-800">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 flex items-start gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${alert.bg} ${alert.border} border flex items-center justify-center shrink-0 mt-0.5`}>
                      <alert.icon className={`w-4 h-4 ${alert.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-slate-200">{alert.title}</div>
                        <div className="text-xs text-slate-500">{alert.time}</div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">View Details</button>
                        {alert.type !== 'resolved' && (
                          <button className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">Resolve</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
