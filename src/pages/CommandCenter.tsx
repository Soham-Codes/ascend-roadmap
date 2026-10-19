import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ArrowUpRight,
  Plus,
  Zap,
  Trophy,
  ChevronRight,
  Target,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

const countdowns = [
  { label: 'Graduation', date: '2028-05-15', color: 'text-indigo-400' },
  { label: 'MBA Application Window', date: '2028-01-01', color: 'text-purple-400' },
  { label: 'Summer Internship', date: '2027-05-10', color: 'text-emerald-400' },
];

const workstreams = [
  { name: 'Technical Skills', progress: 35, status: 'On Track', icon: '💻', color: 'bg-blue-500' },
  { name: 'MBA & GMAT/GRE', progress: 15, status: 'Planned', icon: '🎓', color: 'bg-purple-500' },
  { name: 'Career & Recruiting', progress: 40, status: 'Active', icon: '💼', color: 'bg-emerald-500' },
  { name: 'Honors Research', progress: 10, status: 'Exploratory', icon: '🔬', color: 'bg-amber-500' },
  { name: 'MITx MicroMasters', progress: 0, status: 'Enrolled', icon: '📚', color: 'bg-orange-500' },
  { name: 'Leadership', progress: 20, status: 'On Track', icon: '🚀', color: 'bg-pink-500' },
  { name: 'Academics', progress: 60, status: 'On Track', icon: '📝', color: 'bg-cyan-500' },
];

const focusTasks = [
  { title: 'Complete Python Functions Module', deadline: 'Oct 25', priority: 'Essential', effort: '4h', status: 'In Progress' },
  { title: 'Research HBS 2+2 Requirements', deadline: 'Oct 28', priority: 'Important', effort: '2h', status: 'Not Started' },
  { title: 'Draft Honors Research Topic', deadline: 'Nov 02', priority: 'Essential', effort: '6h', status: 'Not Started' },
];

export default function CommandCenter() {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateCountdown = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            ASCEND <span className="text-slate-500 font-medium text-xl">| {getTimeGreeting()}</span>
          </h1>
          <p className="text-slate-400 mt-1">"Build the skills. Create the impact. Earn the opportunity."</p>
        </div >

        <div className="flex gap-3 overflow-x-auto pb-2">
          {countdowns.map((cd) => (
            <div key={cd.label} className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
              <Clock size={16} className={cd.color} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{cd.label}</p>
                <p className={cn("text-sm font-bold", cd.color)}>{calculateCountdown(cd.date)} days remaining</p>
              </div >
            </div >
          ))}
        </div >
      </div >

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Progress & Focus */}
        <div className="lg:col-span-2 space-y-6">

          {/* Overall Progress Card */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={120} className="text-indigo-500" />
            </div >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Zap size={20} className="text-indigo-400" />
                  Overall Progress
                </h2>
                <span className="text-2xl font-black text-indigo-400">42%</span>
              </div >

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000" style={{ width: '42%' }} />
              </div >

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Completed', value: '128', icon: CheckCircle2, color: 'text-emerald-400' },
                  { label: 'Remaining', value: '214', icon: Clock, color: 'text-slate-400' },
                  { label: 'Overdue', value: '3', icon: AlertCircle, color: 'text-red-400' },
                  { label: 'Next Due', value: '2 days', icon: CalendarDays, color: 'text-indigo-400' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-slate-800/50 rounded-xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon size={14} className={stat.color} />
                      <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                    </div >
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div >
                ))}
              </div >
            </div >
          </div >

          {/* Current Focus */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target size={20} className="text-indigo-400" />
                Current Focus
              </h2>
              <button className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                View all <ChevronRight size={12} />
              </button>
            </div >

            <div className="space-y-3">
              {focusTasks.map((task, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-5 w-5 rounded-md border-2 border-slate-600 group-hover:border-indigo-500 transition-colors" />
                    <div>
                      <p className="text-sm font-semibold group-hover:text-indigo-300 transition-colors">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-300 font-medium">{task.priority}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> {task.deadline}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Zap size={10} /> {task.effort}
                        </span>
                      </div >
                    </div >
                  </div >
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                      {task.status}
                    </span>
                  </div >
                </div >
              ))}
            </div >
          </div >

          {/* Workstream Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workstreams.map((ws) => (
              <div key={ws.name} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ws.icon}</span>
                    <div>
                      <p className="text-sm font-bold">{ws.name}</p>
                      <p className="text-[10px] text-slate-500">{ws.status}</p>
                    </div >
                  </div >
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-400">{ws.progress}%</p>
                  </div >
                </div >
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", ws.color)} style={{ width: `${ws.progress}%` }} />
                </div >
              </div >
            ))}
          </div >
        </div >

        {/* Right Column: Quick Actions & Deadlines */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="p-6 bg-indigo-600 rounded-2xl shadow-lg text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus size={20} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Add New Task', icon: Plus },
                { label: 'Log Achievement', icon: Trophy },
                { label: 'Plan My Week', icon: CalendarDays },
                { label: 'Add Reflection', icon: BookOpen },
                { label: 'Update Goal', icon: Target },
              ].map((action) => (
                <button key={action.label} className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium group">
                  <div className="flex items-center gap-3">
                    <action.icon size={16} />
                    {action.label}
                  </div >
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div >
          </div >

          {/* Upcoming Deadlines */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CalendarDays size={20} className="text-indigo-400" />
                Upcoming
              </h2>
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                {['7d', '14d', '30d'].map(d => (
                  <button key={d} className={cn(
                    "px-2 py-1 text-[10px] rounded-md transition-all",
                    d === '7d' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  )}>{d}</button>
                ))}
              </div >
            </div >

            <div className="space-y-4">
              {[
                { title: 'Python Basics Quiz', date: 'Oct 21', type: 'Skill', urgency: 'high' },
                { title: 'GMAT Diagnostic', date: 'Oct 24', type: 'MBA', urgency: 'medium' },
                { title: 'Research Outreach', date: 'Oct 27', type: 'Research', urgency: 'medium' },
                { title: 'MITx Course Prep', date: 'Nov 01', type: 'MITx', urgency: 'low' },
              ].map((dl, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      dl.urgency === 'high' ? "bg-red-500" : dl.urgency === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                    )} />
                    <div>
                      <p className="text-xs font-semibold">{dl.title}</p>
                      <p className="text-[10px] text-slate-500">{dl.date} • {dl.type}</p>
                    </div >
                  </div >
                  <button className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                    <ChevronRight size={14} className="text-slate-600" />
                  </button>
                </div >
              ))}
            </div >
          </div >

          {/* Weekly Reflection Prompt */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-400" />
              Weekly Reflection
            </h2>
            <p className="text-xs text-slate-400 mb-4">"What progress did you make this week?"</p>
            <div className="relative">
              <textarea
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 placeholder:text-slate-600"
                placeholder="Start typing your reflection..."
              />
              <button className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg">
                <CheckCircle2 size={16} />
              </button>
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
