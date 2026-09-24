import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Briefcase, 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  Palette, 
  Globe, 
  Copy, 
  Puzzle, 
  BookOpen, 
  Megaphone, 
  LifeBuoy,
  ChevronRight,
  ArrowUpRight,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Settings
} from 'lucide-react';
import './_ecosystem.css';

const clientRevenueData = [
  { name: 'Acme Corp', revenue: 3200 },
  { name: 'Globex Inc', revenue: 2800 },
  { name: 'Stark Ind.', revenue: 2100 },
  { name: 'Initech', revenue: 1650 },
  { name: 'Umbrella', revenue: 1400 },
  { name: 'Massive', revenue: 950 },
  { name: 'Soylent', revenue: 740 },
];

const integrationData = [
  { name: 'Stripe', status: 'Connected', icon: '💸' },
  { name: 'Slack', status: 'Connected', icon: '💬' },
  { name: 'HubSpot', status: 'Available', icon: '🦊' },
  { name: 'Zapier', status: 'Connected', icon: '⚡' },
  { name: 'GitHub', status: 'Available', icon: '🐙' },
  { name: 'Intercom', status: 'Available', icon: '👋' },
];

const revenueHistory = [
  { month: 'March', amount: '$2,100', trend: '+4.2%' },
  { month: 'April', amount: '$2,340', trend: '+11.4%' },
  { month: 'May', amount: '$2,568', trend: '+9.7%' },
];

const activeClients = [
  { name: 'Acme Corp', plan: 'Enterprise Plus', mrr: '$3,200', status: 'Active', lastActivity: '2 hours ago' },
  { name: 'Globex Inc', plan: 'Enterprise', mrr: '$2,800', status: 'Active', lastActivity: '5 hours ago' },
  { name: 'Stark Ind.', plan: 'Pro', mrr: '$2,100', status: 'Active', lastActivity: '1 day ago' },
  { name: 'Initech', plan: 'Pro', mrr: '$1,650', status: 'Churn Risk', lastActivity: '12 days ago' },
  { name: 'Umbrella Corp', plan: 'Starter', mrr: '$1,400', status: 'Active', lastActivity: '3 days ago' },
];

export default function EcosystemDashboard() {
  return (
    <div className="ecosystem-dashboard flex flex-col h-screen overflow-hidden">
      {/* Top Navigation */}
      <header className="h-16 bg-[#1e293b] text-white flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#0d9488] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">PlatformX</span>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#334155] text-slate-300 ml-1">
              Partner Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-[#f59e0b]/20 text-[#fcd34d] px-3 py-1.5 rounded-full border border-[#f59e0b]/30">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">Goldstar Partner</span>
            <div className="flex gap-0.5 ml-1">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
          
          <div className="h-6 w-px bg-slate-700"></div>
          
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">Your Clients: <strong className="text-white">24</strong></span>
          </div>

          <div className="h-6 w-px bg-slate-700"></div>

          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <div className="text-sm font-semibold leading-tight">Elevate Agency</div>
              <div className="text-xs text-slate-400">Partner Account</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-[#0d9488] flex items-center justify-center text-sm font-bold">
              EA
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[220px] bg-white border-r flex flex-col shrink-0 overflow-y-auto eco-scrollbar">
          <div className="p-4 space-y-6">
            
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">My Business</div>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md bg-[#0d9488]/10 text-[#0d9488] font-medium text-sm">
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <DollarSign className="w-4 h-4" /> Earnings
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Briefcase className="w-4 h-4" /> Clients
                </a>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">White-Label</div>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Palette className="w-4 h-4" /> Branding
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Globe className="w-4 h-4" /> Custom Domain
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Copy className="w-4 h-4" /> Templates
                </a>
              </div>
            </div>
            
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Marketplace</div>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Puzzle className="w-4 h-4" /> Apps
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Settings className="w-4 h-4" /> Integrations
                </a>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Resources</div>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <BookOpen className="w-4 h-4" /> API Docs
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <Megaphone className="w-4 h-4" /> Co-Marketing
                </a>
                <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-colors">
                  <LifeBuoy className="w-4 h-4" /> Partner Support
                </a>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 eco-scrollbar">
          
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Partner Overview</h1>
            <button className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              + Register New Deal
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <div className="ecosystem-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-500">Partner MRR</h3>
                <div className="p-1.5 bg-[#0d9488]/10 rounded-md text-[#0d9488]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-slate-900">$12,840</div>
                <div className="text-xs font-medium text-[#0d9488] mb-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> 18%
                </div>
              </div>
            </div>
            
            <div className="ecosystem-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-500">Clients Managed</h3>
                <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-slate-900">24</div>
                <div className="text-xs font-medium text-slate-500 mb-1">+2 this month</div>
              </div>
            </div>

            <div className="ecosystem-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-500">Revenue Share (30%)</h3>
                <div className="p-1.5 bg-green-500/10 rounded-md text-green-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-slate-900">$2,568</div>
                <div className="text-xs font-medium text-slate-500 mb-1">Estimated</div>
              </div>
            </div>

            <div className="ecosystem-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-500">Marketplace Apps</h3>
                <div className="p-1.5 bg-purple-500/10 rounded-md text-purple-600">
                  <Puzzle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-slate-900">7</div>
                <div className="text-xs font-medium text-slate-500 mb-1">Installed</div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-6">
            
            <div className="col-span-7 ecosystem-card p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-slate-900">Client Revenue Breakdown</h3>
                <button className="text-sm text-[#0d9488] font-medium hover:underline">View All</button>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientRevenueData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#475569'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                      formatter={(value: number) => [`$${value}`, 'MRR']}
                    />
                    <Bar dataKey="revenue" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-5 ecosystem-card p-0 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0d9488]/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="p-5 border-b flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-slate-900">White-Label Config</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </span>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-inner">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Company Name</span>
                      <span className="font-medium text-slate-900">Elevate Analytics</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Custom Domain</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1">
                        app.elevate-agency.io
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Primary Color</span>
                      <span className="font-medium text-slate-900 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#6366f1] inline-block"></span>
                        #6366f1
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Logo</span>
                      <div className="w-6 h-6 bg-white border rounded flex items-center justify-center text-[10px] font-bold">
                        EA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t">
                <button className="w-full py-2 bg-white border border-slate-300 shadow-sm text-sm font-medium text-slate-700 rounded-md hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                  Edit Branding <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-12 gap-6">
            
            <div className="col-span-5 ecosystem-card p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-1">Partner Tier Progress</h3>
              <p className="text-sm text-slate-500 mb-5">You are 8 clients away from Platinum status.</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-[#f59e0b] flex items-center gap-1"><Award className="w-4 h-4" /> Gold</span>
                  <span className="text-slate-400">Platinum</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] w-[75%] rounded-full"></div>
                </div>
                <div className="text-xs text-slate-500 text-right">24 / 32 clients</div>
              </div>

              <div className="bg-[#f8fafc] rounded-md p-3 border border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Next Tier Perks</div>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                    40% Revenue Share (up from 30%)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                    Dedicated co-sell account executive
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                    $500/mo co-marketing budget
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-span-4 ecosystem-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900">Integrations</h3>
                <button className="text-[#0d9488] p-1 hover:bg-[#0d9488]/10 rounded"><Settings className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {integrationData.map((int, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${int.status === 'Connected' ? 'border-[#0d9488]/30 bg-[#0d9488]/5' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{int.icon}</span>
                      <span className="font-medium text-sm text-slate-800">{int.name}</span>
                    </div>
                    <div className={`text-[10px] uppercase font-bold tracking-wider ${int.status === 'Connected' ? 'text-[#0d9488]' : 'text-slate-400'}`}>
                      {int.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-3 ecosystem-card p-0 flex flex-col">
              <div className="p-5 border-b">
                <h3 className="text-base font-semibold text-slate-900">RevShare History</h3>
              </div>
              <div className="flex-1 p-2">
                <table className="w-full text-sm">
                  <tbody>
                    {revenueHistory.map((rev, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-slate-600 font-medium">{rev.month}</td>
                        <td className="py-3 px-3 text-slate-900 font-semibold text-right">{rev.amount}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                            {rev.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-slate-50 border-t text-center">
                <button className="text-sm font-medium text-[#0d9488] hover:underline">View Full Ledger</button>
              </div>
            </div>

          </div>

          {/* Bottom Table */}
          <div className="ecosystem-card overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Active Clients</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]"
                />
                <button className="p-1.5 border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 uppercase font-semibold border-b">
                  <tr>
                    <th className="px-5 py-3">Client Name</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">MRR</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Last Activity</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeClients.map((client, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-900">{client.name}</td>
                      <td className="px-5 py-4 text-slate-600">{client.plan}</td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{client.mrr}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{client.lastActivity}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-slate-400 hover:text-[#0d9488] transition-colors font-medium text-xs">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
