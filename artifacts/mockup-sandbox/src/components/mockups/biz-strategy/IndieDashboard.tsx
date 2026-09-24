import React from "react";
import { 
  Sparkles, Command, Search, Home, Users, CreditCard, 
  Settings, BarChart3, Bell, ArrowRight, Zap, Target
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import "./_PLG.css";

const revenueData = [
  { value: 32000 }, { value: 34000 }, { value: 33500 }, { value: 37000 },
  { value: 36000 }, { value: 41000 }, { value: 43000 }, { value: 45000 },
  { value: 44500 }, { value: 47320 }
];

export function IndieDashboard() {
  return (
    <div className="indie-dashboard-wrapper flex flex-col md:flex-row w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-[220px] shrink-0 border-r border-stone-200/60 flex flex-col justify-between p-4 bg-[#fafaf8]/80 backdrop-blur-sm hidden md:flex h-screen sticky top-0">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 mb-6">
            <div className="bg-coral-50 text-coral-500 p-1.5 rounded-lg border border-coral-200">
              <Sparkles size={18} />
            </div>
            <span className="font-semibold text-lg tracking-tight">LaunchKit</span>
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<Home size={18} />} label="Overview" active />
            <NavItem icon={<Users size={18} />} label="Customers" />
            <NavItem icon={<CreditCard size={18} />} label="Revenue" />
            <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        <div className="mt-8 bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-stone-500" />
            <span className="text-xs font-medium text-stone-600">This week's goal</span>
          </div>
          <p className="text-sm font-semibold mb-2">$5k MRR</p>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-coral-500 rounded-full" style={{ width: "83%" }} />
          </div>
          <p className="text-[10px] text-stone-500 text-right">83% there</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 border-b border-stone-200/60 flex items-center justify-between px-6 shrink-0 bg-[#fafaf8]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-stone-600 font-medium">Good morning, Alex! 👋</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-sm text-stone-500 bg-white border border-stone-200 hover:border-stone-300 rounded-full px-3 py-1.5 transition-colors shadow-sm">
              <Search size={14} />
              <span>Search or jump to...</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-medium ml-2 font-mono border border-stone-200">⌘K</kbd>
            </button>
            <div className="relative">
              <Bell size={18} className="text-stone-600 cursor-pointer hover:text-stone-900" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-coral-500 rounded-full"></span>
            </div>
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=f97316" 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-stone-200 cursor-pointer hover:opacity-90 transition-opacity bg-coral-50"
            />
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 pb-20">
          
          {/* Hero Banner */}
          <div className="relative bg-white border border-coral-200 rounded-2xl p-8 shadow-sm overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group">
            <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-coral-500 rounded-full confetti-dot" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-12 left-24 w-2 h-2 bg-yellow-400 rounded-full confetti-dot" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-8 right-32 w-1.5 h-1.5 bg-blue-400 rounded-full confetti-dot" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-8 right-12 w-2 h-2 bg-coral-400 rounded-full confetti-dot" style={{ animationDelay: '1.5s' }}></div>
            
            <div className="relative z-10 text-center sm:text-left">
              <span className="inline-block bg-coral-50 text-coral-500 text-xs font-semibold px-2 py-1 rounded-full mb-3 border border-coral-200">
                Milestone Reached 🎉
              </span>
              <h1 className="text-3xl sm:text-4xl font-playfair font-semibold text-stone-900 mb-2">
                You just crossed <span className="text-coral-500">$47k MRR!</span>
              </h1>
              <p className="text-stone-500">That's 12% up this month. Your indie empire is growing.</p>
            </div>
            
            <button className="relative z-10 shrink-0 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
              Share this <ArrowRight size={16} />
            </button>
          </div>

          {/* Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* People Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-stone-500 text-sm font-medium">Your People</span>
                <span className="text-emerald-500 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">+24 this week</span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-playfair font-semibold text-stone-900">1,847</span>
                <span className="text-stone-500 text-sm ml-2">active users</span>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/notionists/svg?seed=user${i}&backgroundColor=e5e5e5`} className="w-8 h-8 rounded-full border-2 border-white bg-stone-100" alt="user" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-medium text-stone-600">
                  +1k
                </div>
              </div>
            </div>

            {/* Revenue Chart Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-stone-500 text-sm font-medium">Revenue</span>
                <span className="text-coral-500 text-xs font-medium flex items-center gap-1">
                  Best month ever ↑
                </span>
              </div>
              <div>
                <span className="text-3xl font-playfair font-semibold text-stone-900">$47,320</span>
                <span className="text-stone-500 text-sm ml-2">MRR</span>
              </div>
              <div className="flex-1 mt-4 h-16 w-full -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} isAnimationActive={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Health Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-stone-500 text-sm font-medium">Health</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                  😊
                </div>
                <div>
                  <div className="text-xl font-semibold text-stone-900">All systems go</div>
                  <div className="text-stone-500 text-sm">Looking great today</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">API uptime</span>
                  <span className="font-medium text-stone-900">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Avg response</span>
                  <span className="font-medium text-stone-900">23ms</span>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-stone-900 font-playfair">What's happening today</h2>
              <div className="space-y-3">
                <ActivityCard icon="🎊" text="Sarah upgraded to Pro plan" time="2 hours ago" />
                <ActivityCard icon="🚀" text="Your API hit a new daily high (4.2k requests)" time="4 hours ago" />
                <ActivityCard icon="👋" text="3 new signups from Product Hunt" time="5 hours ago" />
                <ActivityCard icon="💳" text="New payment received: $99 from Acme Corp" time="1 day ago" />
                <ActivityCard icon="✨" text="You shipped 'Dark Mode' to production" time="1 day ago" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-stone-900 font-playfair">What to focus on</h2>
              <div className="space-y-3">
                <ActionCard title="Set up your custom domain" time="2 min" />
                <ActionCard title="Invite your first teammate" time="1 min" />
                <ActionCard title="Enable Stripe webhooks" time="5 min" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      active 
        ? "bg-white text-stone-900 font-medium shadow-sm border border-stone-200/50" 
        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
    }`}>
      <span className={active ? "text-coral-500" : "text-stone-400"}>{icon}</span>
      {label}
    </button>
  );
}

function ActivityCard({ icon, text, time }: { icon: string, text: string, time: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4 hover:border-stone-300 transition-colors cursor-default shadow-sm">
      <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-xl shrink-0 border border-stone-100">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-900">{text}</p>
        <p className="text-xs text-stone-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function ActionCard({ title, time }: { title: string, time: string }) {
  return (
    <button className="w-full bg-white border border-stone-200 hover:border-coral-300 rounded-xl p-4 text-left flex items-start justify-between group transition-all shadow-sm">
      <div>
        <p className="text-sm font-medium text-stone-900 group-hover:text-coral-600 transition-colors">{title}</p>
        <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
          <Zap size={12} className="text-yellow-500" />
          Takes ~{time}
        </p>
      </div>
      <ArrowRight size={16} className="text-stone-300 group-hover:text-coral-500 transform group-hover:translate-x-1 transition-all" />
    </button>
  );
}

export default IndieDashboard;
