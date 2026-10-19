import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp,
  Trophy,
  Activity,
  Target,
  Zap,
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

const TIME_SERIES_DATA = [
  { month: 'Oct', tasks: 12, goals: 2 },
  { month: 'Nov', tasks: 18, goals: 1 },
  { month: 'Dec', tasks: 15, goals: 3 },
  { month: 'Jan', tasks: 22, goals: 2 },
  { month: 'Feb', tasks: 20, goals: 2 },
  { month: 'Mar', tasks: 25, goals: 1 },
];

const WORKSTREAM_DATA = [
  { subject: 'Technical', A: 80, fullMark: 100 },
  { subject: 'MBA Prep', A: 40, fullMark: 100 },
  { subject: 'Career', A: 60, fullMark: 100 },
  { subject: 'Research', A: 30, fullMark: 100 },
  { subject: 'MITx', A: 20, fullMark: 100 },
  { subject: 'Leadership', A: 50, fullMark: 100 },
];

const PIPELINE_DATA = [
  { name: 'Interested', value: 40, color: '#6366f1' },
  { name: 'Applied', value: 25, color: '#8b5cf6' },
  { name: 'Interview', value: 10, color: '#ec4899' },
  { name: 'Offer', value: 2, color: '#10b981' },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="text-indigo-400" />
            Analytics & Progress
          </h1>
          <p className="text-slate-400">Quantitative visualization of your journey to 2028</p>
        </div >
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            Export Data (JSON)
          </button>
        </div >
      </div >

      {/* High Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Weighted Progress', value: '42%', icon: Target, color: 'text-indigo-400' },
          { label: 'Consistency Score', value: '88%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Tasks Completed', value: '128', icon: CheckCircle2, color: 'text-blue-400' },
          { label: 'Skill Growth', value: '+12%', icon: Zap, color: 'text-yellow-400' },
        ].map((kpi, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon size={16} className={kpi.color} />
            </div >
            <p className="text-2xl font-black">{kpi.value}</p>
          </div >
        ))}
      </div >

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Momentum Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity size={20} className="text-indigo-400" />
              Momentum Tracker
            </h3>
            <span className="text-xs text-slate-500">Tasks vs Goals</span>
          </div >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TIME_SERIES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                <Line type="monotone" dataKey="goals" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899' }} />
              </LineChart>
            </ResponsiveContainer>
          </div >
        </div >

        {/* Workstream Balance */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target size={20} className="text-indigo-400" />
              Workstream Balance
            </h3>
            <span className="text-xs text-slate-500">Proficiency Map</span>
          </div >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={WORKSTREAM_DATA}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" />
                <Radar name="Proficiency" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div >
        </div >

        {/* Pipeline Funnel */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PieIcon size={20} className="text-indigo-400" />
              Application Funnel
            </h3>
            <span className="text-xs text-slate-500">Conversion Rate</span>
          </div >
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIPELINE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIPELINE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black">79</span>
              <span className="text-[10px] text-slate-500 uppercase">Total</span>
            </div >
          </div >
        </div >

        {/* Achievement Timeline */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy size={20} className="text-indigo-400" />
            Milestone History
          </h3>
          <div className="space-y-4">
            {[
              { date: 'Oct 12', title: 'Completed Python Basics', status: 'Achievement' },
              { date: 'Sep 28', title: 'Secured Internship Offer', status: 'Major' },
              { date: 'Aug 15', title: 'Completed GMAT Diagnostic', status: 'Milestone' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/40 border border-slate-800 rounded-xl group hover:border-indigo-500/50 transition-all">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <div className="flex-1">
                  <p className="text-xs font-bold">{event.title}</p>
                  <p className="text-[10px] text-slate-500">{event.date} • {event.status}</p>
                </div >
                <CheckCircle2 size={14} className="text-emerald-400" />
              </div >
            ))}
            <button className="w-full py-3 text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors border border-dashed border-slate-800 rounded-xl">
              View Full History
            </button>
          </div >
        </div >
      </div >
    </div >
  );
}
