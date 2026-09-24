import React from 'react';
import { Check, X, ArrowRight, Zap, Target, Flame, Lightbulb, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CompetitiveAnalysis() {
  const competitors = [
    {
      name: 'Retool',
      tagline: 'Internal tools in minutes',
      strengths: ['Drag-drop builder', '100+ integrations', 'Enterprise SSO', 'Visual query builder'],
      uxPatterns: ['Component palette sidebar', 'Live preview pane', 'Visual database query builder'],
      colors: ['#3B82F6', '#1E293B'],
      weakness: 'Steep learning curve, not beautiful, no white-label',
      brandColor: '#3B82F6',
    },
    {
      name: 'Supabase',
      tagline: 'The open source Firebase alternative',
      strengths: ['Postgres-native', 'Edge functions', 'Real-time', 'Generous free tier'],
      uxPatterns: ['API key on home page', 'Code snippets inline', 'SQL editor built-in', 'Table view'],
      colors: ['#3ECF8E', '#1C1C1C', '#F8F9FA'],
      weakness: 'Requires Postgres knowledge, no admin UI builder',
      brandColor: '#3ECF8E',
    },
    {
      name: 'Appsmith',
      tagline: 'Build internal apps 10x faster',
      strengths: ['Open-source', 'Self-hosted', 'Drag-drop', '40+ DB connectors'],
      uxPatterns: ['Canvas-based editor', 'Widget library', 'JS anywhere'],
      colors: ['#FF6D2A', '#232323'],
      weakness: 'Slow performance, complex setup, dated UI',
      brandColor: '#FF6D2A',
    },
    {
      name: 'Firebase',
      tagline: "Google's app development platform",
      strengths: ['Google ecosystem', 'Real-time DB', 'Authentication', 'Hosting'],
      uxPatterns: ['Project switcher', 'Console-style layout', 'Generous docs'],
      colors: ['#FFCA28', '#F57C00', '#212121'],
      weakness: 'Vendor lock-in, NoSQL constraints, complex pricing',
      brandColor: '#F57C00',
    },
    {
      name: 'Convex',
      tagline: 'The backend for app developers',
      strengths: ['TypeScript-native', 'Reactive queries', 'Serverless', 'Great DX'],
      uxPatterns: ['Dashboard-as-console', 'Real-time data inspector', 'Functions list'],
      colors: ['#EE342F', '#101827'],
      weakness: 'Newer/smaller ecosystem, steep learning curve',
      brandColor: '#EE342F',
    },
    {
      name: 'Railway',
      tagline: 'Infrastructure, simplified',
      strengths: ['Beautiful UX', 'Instant deploy', 'Any language', 'Great DX'],
      uxPatterns: ['Service graph visualization', 'One-click deploy', 'Gorgeous empty states'],
      colors: ['#B35DF7', '#0B0D0E'],
      weakness: 'Not an admin UI builder, just deployment',
      brandColor: '#B35DF7',
    },
  ];

  const gapFailures = [
    'No beautiful white-label admin UI for end users',
    'No built-in algorithm/data structure visualizers',
    'Poor onboarding for non-technical founders',
    'No unified auth + billing + admin in one product',
    'Not designed for the founder who codes AND sells',
  ];

  const gapStrengths = [
    'Full-stack admin boilerplate, ready to ship',
    'Algorithm visualizers as engagement differentiator',
    'JWT auth + Stripe billing pre-integrated',
    'White-label friendly from day 1',
    'Small team (3 devs) → maintenance-first architecture',
  ];

  const uxPatterns = [
    {
      name: 'API Key on Dashboard Home',
      company: 'Supabase',
      why: 'Builds instant "aha moment"',
      how: 'Add API key widget to dashboard',
    },
    {
      name: 'Beautiful Empty States',
      company: 'Railway/Linear',
      why: 'Reduces abandonment',
      how: 'Design illustrated empty states for each page',
    },
    {
      name: '⌘K Command Palette',
      company: 'Linear',
      why: 'Power user retention',
      how: 'Implement global command palette',
    },
    {
      name: 'Milestone Celebrations',
      company: 'Loom/Notion',
      why: 'Emotional connection',
      how: 'Celebrate first $1k MRR, first 100 users',
    },
  ];

  const decisionMatrix = [
    { approach: 'Dark/terminal (Supabase)', pros: 'Dev trust, focus', cons: 'Alienates non-devs', verdict: 'Good for PLG' },
    { approach: 'Enterprise navy (Datadog)', pros: 'Trust signals', cons: 'Boring, dated', verdict: 'Good for enterprise' },
    { approach: 'Warm/indie (Linear/Notion)', pros: 'Viral, loved', cons: 'Not enterprise', verdict: 'Good for SMB' },
    { approach: 'OUR CHOICE: Adaptive theme (dark default + optional light)', pros: 'Best of both', cons: 'More dev effort', verdict: '✓ WINNER', isWinner: true },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8 md:p-12 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" /> Strategic Research
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Competitive Landscape <span className="text-indigo-600">Analysis</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            SaaS Admin Platform Market — Research basis for product strategy & visual identity decisions.
          </p>
        </header>

        {/* Section 1: Competitors */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            <Box className="w-5 h-5" /> Top 6 Competitor Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((comp) => (
              <div 
                key={comp.name}
                className="bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden"
                style={{ borderLeftWidth: '4px', borderLeftColor: comp.brandColor }}
              >
                <div className="space-y-4 text-[13px]">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{comp.name}</h3>
                    <p className="text-slate-500 italic mt-1">"{comp.tagline}"</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {comp.strengths.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-slate-700">UX Patterns:</p>
                    <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                      {comp.uxPatterns.map(p => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="font-semibold text-slate-700">Visual Identity:</span>
                    <div className="flex gap-1.5">
                      {comp.colors.map(c => (
                        <div key={c} className="w-4 h-4 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="text-red-600 font-medium flex gap-2">
                      <span className="shrink-0 mt-0.5">⚠️</span> 
                      <span>{comp.weakness}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Gap Analysis */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-5 h-5" /> Market Gap Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100">
              <h3 className="text-lg font-bold text-red-900 mb-6 flex items-center gap-2">
                What they all fail at
              </h3>
              <ul className="space-y-4">
                {gapFailures.map((item, i) => (
                  <li key={i} className="flex gap-3 text-red-800/80 text-sm">
                    <X className="w-5 h-5 text-red-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold text-indigo-900 mb-6 flex items-center gap-2 relative z-10">
                Our strategic position <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">LaunchKit</span>
              </h3>
              <ul className="space-y-4 relative z-10">
                {gapStrengths.map((item, i) => (
                  <li key={i} className="flex gap-3 text-indigo-900/80 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: UX Patterns */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> UX Patterns Worth Stealing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {uxPatterns.map((pattern, i) => (
              <div key={i} className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100/50 flex flex-col h-full">
                <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Pattern 0{i + 1}</div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-1">{pattern.name}</h3>
                <p className="text-xs text-slate-500 mb-4">via {pattern.company}</p>
                
                <div className="mt-auto space-y-3 text-[13px]">
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-semibold w-8 shrink-0">Why:</span>
                    <span className="text-slate-700">{pattern.why}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-400 font-semibold w-8 shrink-0">How:</span>
                    <span className="text-indigo-700 font-medium">{pattern.how}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Decision Matrix */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-widest">Visual Identity Decision Matrix</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[30%] font-semibold text-slate-900">Approach</TableHead>
                  <TableHead className="font-semibold text-slate-900">Pros</TableHead>
                  <TableHead className="font-semibold text-slate-900">Cons</TableHead>
                  <TableHead className="font-semibold text-slate-900 text-right">Verdict</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisionMatrix.map((row, i) => (
                  <TableRow key={i} className={row.isWinner ? "bg-indigo-50/50" : ""}>
                    <TableCell className={`font-medium ${row.isWinner ? "text-indigo-700" : "text-slate-700"}`}>
                      {row.approach}
                    </TableCell>
                    <TableCell className="text-slate-600 text-[13px]">{row.pros}</TableCell>
                    <TableCell className="text-slate-600 text-[13px]">{row.cons}</TableCell>
                    <TableCell className={`text-right text-[13px] font-semibold ${row.isWinner ? "text-indigo-600" : "text-slate-500"}`}>
                      {row.verdict}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 5: Strategic Summary */}
        <section className="space-y-6 pb-12">
          <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            <Flame className="w-5 h-5" /> 4Ps & 4Cs Strategic Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-none border-slate-200 bg-slate-50/50">
              <CardHeader className="pb-3 border-b border-slate-100 bg-white rounded-t-xl">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="bg-slate-900 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs">P</span>
                  The 4 Ps
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-3 text-[13px]">
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-slate-900">Product</dt>
                    <dd className="col-span-2 text-slate-600">Platform + boilerplate</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-slate-900">Price</dt>
                    <dd className="col-span-2 text-slate-600">Free tier → $49 → Enterprise</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-slate-900">Place</dt>
                    <dd className="col-span-2 text-slate-600">GitHub / ProductHunt / HackerNews</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-slate-900">Promotion</dt>
                    <dd className="col-span-2 text-slate-600">OSS virality + Paid search</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="shadow-none border-indigo-200 bg-indigo-50/30">
              <CardHeader className="pb-3 border-b border-indigo-100 bg-white rounded-t-xl">
                <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-md flex items-center justify-center text-xs">C</span>
                  The 4 Cs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-3 text-[13px]">
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-indigo-900">Customer</dt>
                    <dd className="col-span-2 text-indigo-700/80">Founders who need to ship fast</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-indigo-900">Cost</dt>
                    <dd className="col-span-2 text-indigo-700/80">Time saved vs building from scratch = 200+ hours</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-indigo-900">Convenience</dt>
                    <dd className="col-span-2 text-indigo-700/80">Clone → configure → ship in hours</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <dt className="font-semibold text-indigo-900">Communication</dt>
                    <dd className="col-span-2 text-indigo-700/80">Docs + Discord + Founder Twitter</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
