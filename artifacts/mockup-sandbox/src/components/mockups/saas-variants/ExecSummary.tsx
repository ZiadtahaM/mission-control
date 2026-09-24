import React from "react";
import { 
  Area, 
  AreaChart, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Hexagon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import "./_exec-summary.css";

// --- Mock Data ---

const mrrSparkline = [
  { value: 40 }, { value: 42 }, { value: 45 }, { value: 43 }, { value: 46 }, 
  { value: 48 }, { value: 50 }, { value: 54 }, { value: 52 }, { value: 58 }, 
  { value: 60 }, { value: 64 }, { value: 68 }, { value: 72 }
];

const usersSparkline = [
  { value: 1500 }, { value: 1520 }, { value: 1550 }, { value: 1540 }, 
  { value: 1580 }, { value: 1610 }, { value: 1650 }, { value: 1680 }, 
  { value: 1720 }, { value: 1750 }, { value: 1790 }, { value: 1847 }
];

const npsSparkline = [
  { value: 72 }, { value: 74 }, { value: 75 }, { value: 73 }, { value: 70 }, 
  { value: 71 }, { value: 68 }, { value: 65 }, { value: 66 }, { value: 64 }, 
  { value: 67 }
];

const revenueData = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 31000 },
  { month: "Mar", revenue: 33500 },
  { month: "Apr", revenue: 32000 },
  { month: "May", revenue: 35000 },
  { month: "Jun", revenue: 38000 },
  { month: "Jul", revenue: 41000 },
  { month: "Aug", revenue: 40500 },
  { month: "Sep", revenue: 43000 },
  { month: "Oct", revenue: 45000 },
  { month: "Nov", revenue: 46500 },
  { month: "Dec", revenue: 47320 },
];

const recentSignups = [
  { id: 1, name: "Eleanor Vance", company: "Acme Corp", plan: "Enterprise", date: "Today, 8:42 AM", mrr: "$1,200" },
  { id: 2, name: "Marcus Thorne", company: "Globex", plan: "Pro", date: "Today, 7:15 AM", mrr: "$299" },
  { id: 3, name: "Sylvia Plath", company: "Initech", plan: "Pro", date: "Yesterday, 4:30 PM", mrr: "$299" },
  { id: 4, name: "Arthur Dent", company: "Hitchhikers", plan: "Starter", date: "Yesterday, 2:10 PM", mrr: "$49" },
  { id: 5, name: "Mia Wallace", company: "Jack Rabbit Slims", plan: "Enterprise", date: "Yesterday, 11:05 AM", mrr: "$2,500" },
];

// --- Sub-components ---

const KPICard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  data, 
  color 
}: { 
  title: string, 
  value: string, 
  trend: "up" | "down", 
  trendValue: string,
  data: any[],
  color: string
}) => {
  const isPositive = trend === "up";
  const trendColor = isPositive ? "text-emerald-700" : "text-rose-700";
  const trendBg = isPositive ? "bg-emerald-50" : "bg-rose-50";
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="shadow-none border-neutral-200 bg-white overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{title}</CardTitle>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${trendBg} ${trendColor}`}>
          <Icon className="w-3 h-3" />
          {trendValue}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="font-serif-heading text-5xl md:text-6xl font-semibold text-neutral-900 tracking-tight">
            {value}
          </div>
          <div className="w-[120px] h-[50px] pb-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2.5} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ExecSummary() {
  return (
    <div className="min-h-screen exec-summary-wrapper pb-12">
      {/* Navigation */}
      <header className="border-b border-neutral-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-emerald-800">
              <Hexagon className="w-6 h-6 fill-emerald-800" />
              <span className="font-serif-heading font-bold text-xl tracking-tight">Signal</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500">
              <a href="#" className="text-neutral-900">Overview</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Users</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Billing</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Settings</a>
            </nav>
          </div>
          <div>
            <Avatar className="h-8 w-8 border border-neutral-200">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@founder" />
              <AvatarFallback>FD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        
        {/* KPI Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <KPICard 
            title="Monthly Rec. Revenue" 
            value="$47.3k" 
            trend="up" 
            trendValue="12%" 
            data={mrrSparkline}
            color="#047857" // emerald-700
          />
          <KPICard 
            title="Active Users" 
            value="1,847" 
            trend="up" 
            trendValue="8%" 
            data={usersSparkline}
            color="#047857"
          />
          <KPICard 
            title="NPS Score" 
            value="67" 
            trend="down" 
            trendValue="3" 
            data={npsSparkline}
            color="#be123c" // rose-700
          />
        </div>

        {/* Revenue Chart Section */}
        <section className="bg-white border border-neutral-200 rounded-xl shadow-none overflow-hidden p-6">
          <div className="mb-6">
            <h2 className="text-lg font-serif-heading font-semibold text-neutral-900">Revenue Growth (TTM)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#047857', fontWeight: 600 }}
                  labelStyle={{ color: '#737373', marginBottom: '4px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#047857" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Signups Table Section */}
        <section className="bg-white border border-neutral-200 rounded-xl shadow-none overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-serif-heading font-semibold text-neutral-900">Recent Signups</h2>
          </div>
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="hover:bg-transparent border-neutral-100">
                <TableHead className="font-medium text-neutral-500">Customer</TableHead>
                <TableHead className="font-medium text-neutral-500">Plan</TableHead>
                <TableHead className="font-medium text-neutral-500">Joined</TableHead>
                <TableHead className="text-right font-medium text-neutral-500">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSignups.map((signup) => (
                <TableRow key={signup.id} className="border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="font-medium text-neutral-900">{signup.name}</div>
                    <div className="text-sm text-neutral-500">{signup.company}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="bg-neutral-100 text-neutral-700 font-normal hover:bg-neutral-200">
                      {signup.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-neutral-500">{signup.date}</TableCell>
                  <TableCell className="py-4 text-right font-medium text-emerald-700">{signup.mrr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 text-center">
        <p className="text-sm text-neutral-400">Last updated 2 minutes ago</p>
      </footer>
    </div>
  );
}
