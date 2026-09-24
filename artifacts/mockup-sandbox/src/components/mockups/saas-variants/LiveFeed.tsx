import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  CreditCard, 
  AlertCircle, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search, 
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  UserMinus
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

// --- MOCK DATA ---

type EventType = 'signup' | 'upgrade' | 'churn' | 'error';

interface FeedEvent {
  id: string;
  type: EventType;
  timestamp: string; // e.g. "2 min ago"
  user: { name: string; email: string; initials: string };
  plan: string;
  description: string;
  revenueImpact?: string;
}

const EVENTS: FeedEvent[] = [
  {
    id: 'evt_1',
    type: 'upgrade',
    timestamp: 'Just now',
    user: { name: 'Sarah Jenkins', email: 'sarah.j@acmecorp.com', initials: 'SJ' },
    plan: 'Pro Plan',
    description: 'Upgraded from Starter → Pro (Annual)',
    revenueImpact: '+$1,188/yr'
  },
  {
    id: 'evt_2',
    type: 'signup',
    timestamp: '14 min ago',
    user: { name: 'David Chen', email: 'david@buildstream.io', initials: 'DC' },
    plan: 'Starter Plan',
    description: 'Created new workspace "Buildstream HQ"',
    revenueImpact: '+$49/mo'
  },
  {
    id: 'evt_3',
    type: 'error',
    timestamp: '42 min ago',
    user: { name: 'System', email: 'api-gateway', initials: 'SYS' },
    plan: 'Infrastructure',
    description: 'Stripe webhook delivery failed (503 Service Unavailable). Retrying...'
  },
  {
    id: 'evt_4',
    type: 'signup',
    timestamp: '1 hr ago',
    user: { name: 'Elena Rodriguez', email: 'elena.r@nova.design', initials: 'ER' },
    plan: 'Pro Plan',
    description: 'Converted from 14-day trial',
    revenueImpact: '+$99/mo'
  },
  {
    id: 'evt_5',
    type: 'upgrade',
    timestamp: '2 hrs ago',
    user: { name: 'Marcus Todd', email: 'mtodd@fintech-ventures.com', initials: 'MT' },
    plan: 'Enterprise',
    description: 'Added 5 new seats to existing subscription',
    revenueImpact: '+$245/mo'
  },
  {
    id: 'evt_6',
    type: 'churn',
    timestamp: '3 hrs ago',
    user: { name: 'Alex Thompson', email: 'alex@freelance.net', initials: 'AT' },
    plan: 'Starter Plan',
    description: 'Cancelled subscription. Reason: "No longer needed"',
    revenueImpact: '-$49/mo'
  },
  {
    id: 'evt_7',
    type: 'signup',
    timestamp: '5 hrs ago',
    user: { name: 'Jessica Park', email: 'jpark@retail-flow.com', initials: 'JP' },
    plan: 'Starter Plan',
    description: 'Created new workspace "Retail Flow"',
    revenueImpact: '+$49/mo'
  },
  {
    id: 'evt_8',
    type: 'error',
    timestamp: '6 hrs ago',
    user: { name: 'Tom Wilson', email: 'twilson@logistics-co.com', initials: 'TW' },
    plan: 'Pro Plan',
    description: 'Failed payment on renewal. Card expired.',
  },
  {
    id: 'evt_9',
    type: 'upgrade',
    timestamp: '8 hrs ago',
    user: { name: 'Priya Patel', email: 'priya.p@healthsync.ai', initials: 'PP' },
    plan: 'Enterprise',
    description: 'Upgraded from Pro → Enterprise (Custom SLA)',
    revenueImpact: '+$850/mo'
  }
];

const SPARKLINE_DATA = [
  { day: 'Mon', value: 12 },
  { day: 'Tue', value: 18 },
  { day: 'Wed', value: 15 },
  { day: 'Thu', value: 24 },
  { day: 'Fri', value: 31 },
  { day: 'Sat', value: 28 },
  { day: 'Sun', value: 35 },
];

// --- COMPONENTS ---

const TypeIcon = ({ type }: { type: EventType }) => {
  switch (type) {
    case 'signup': return <UserPlus className="w-4 h-4 text-emerald-600" />;
    case 'upgrade': return <TrendingUp className="w-4 h-4 text-blue-600" />;
    case 'churn': return <UserMinus className="w-4 h-4 text-amber-600" />;
    case 'error': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
  }
};

const TypeBorder = ({ type }: { type: EventType }) => {
  switch (type) {
    case 'signup': return 'border-l-emerald-500';
    case 'upgrade': return 'border-l-blue-500';
    case 'churn': return 'border-l-amber-500';
    case 'error': return 'border-l-rose-500';
  }
};

const TypeBg = ({ type }: { type: EventType }) => {
  switch (type) {
    case 'signup': return 'bg-emerald-50';
    case 'upgrade': return 'bg-blue-50';
    case 'churn': return 'bg-amber-50';
    case 'error': return 'bg-rose-50';
  }
};

const TypeBadgeText = ({ type }: { type: EventType }) => {
  switch (type) {
    case 'signup': return 'text-emerald-700';
    case 'upgrade': return 'text-blue-700';
    case 'churn': return 'text-amber-700';
    case 'error': return 'text-rose-700';
  }
};


export default function LiveFeed() {
  return (
    <div className="min-h-screen flex bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-slate-200 bg-white flex flex-col shrink-0 fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Nexus Ops
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            14 events today
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-900">
            <Activity className="w-4 h-4" /> Live Feed
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Dashboards
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Users className="w-4 h-4" /> Customers
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CreditCard className="w-4 h-4" /> Revenue
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <AlertCircle className="w-4 h-4" /> Alerts
          </a>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] flex justify-center py-12 px-8">
        <div className="w-full max-w-[1100px] flex gap-12 items-start">
          
          {/* Left Column: Feed */}
          <div className="flex-[7] min-w-0">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Live Activity Stream</h1>
                <p className="text-sm text-slate-500 mt-1">Real-time events across your workspace.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </header>

            <div className="space-y-4">
              {EVENTS.map((event) => (
                <div 
                  key={event.id}
                  className={`group relative bg-white border border-slate-200 border-l-[4px] ${TypeBorder(event.type)} rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Avatar / Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-slate-100 ${TypeBg(event.type)}`}>
                        <TypeIcon type={event.type} />
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900 text-sm">{event.user.name}</span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-500 text-xs">{event.user.email}</span>
                        </div>
                        <p className="text-slate-800 text-sm mb-2">{event.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${TypeBg(event.type)} ${TypeBadgeText(event.type)}`}>
                            {event.type}
                          </span>
                          <span className="text-slate-500 text-[13px]">{event.plan}</span>
                          {event.revenueImpact && (
                            <>
                              <span className="text-slate-300 text-xs">•</span>
                              <span className={`text-[13px] font-medium ${event.type === 'churn' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {event.revenueImpact}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timestamp & Action */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-xs text-slate-400 font-medium">{event.timestamp}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
                        <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-md hover:bg-slate-100">
                Load older events...
              </button>
            </div>
          </div>

          {/* Right Column: Summary Panel */}
          <div className="flex-[3] sticky top-12 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 uppercase mb-4">Today's Pulse</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs font-medium text-slate-500 mb-1">Signups</div>
                  <div className="text-2xl font-semibold text-slate-900">24</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs font-medium text-slate-500 mb-1">Upgrades</div>
                  <div className="text-2xl font-semibold text-slate-900">8</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs font-medium text-slate-500 mb-1">Churns</div>
                  <div className="text-2xl font-semibold text-slate-900">2</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-xs font-medium text-slate-500 mb-1">Errors</div>
                  <div className="text-2xl font-semibold text-slate-900">14</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-slate-500 uppercase">7-Day Signups</div>
                  <div className="text-xs font-medium text-emerald-600">+12% vs last week</div>
                </div>
                <div className="h-[80px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SPARKLINE_DATA}>
                      <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {
                          SPARKLINE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === SPARKLINE_DATA.length - 1 ? '#10b981' : '#cbd5e1'} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 shadow-sm text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Weekly Target: 85%</h3>
                  <p className="text-slate-400 text-xs mb-3">142 signups needed to hit Q3 goal. Currently tracking ahead of pace.</p>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
