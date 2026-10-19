import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Filter,
  Plus,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

const PHASES_CONFIG = [
  { id: 1, title: 'BUILD THE FOUNDATION', period: 'Oct – Dec 2026', color: 'bg-blue-500', start: '2026-10-01', end: '2026-12-31' },
  { id: 2, title: 'DEVELOP SKILLS & DIRECTION', period: 'Jan – May 2027', color: 'bg-indigo-500', start: '2027-01-01', end: '2027-05-31' },
  { id: 3, title: 'DEMONSTRATE PROFESSIONAL IMPACT', period: 'May – Aug 2027', color: 'bg-purple-500', start: '2027-05-01', end: '2027-08-31' },
  { id: 4, title: 'BUILD THE APPLICATION', period: 'Aug – Dec 2027', color: 'bg-pink-500', start: '2027-08-01', end: '2027-12-31' },
  { id: 5, title: 'EXECUTE & TRANSITION', period: 'Jan – May 2028', color: 'bg-emerald-500', start: '2028-01-01', end: '2028-05-31' },
];

export default function MasterRoadmap() {
  const [activePhase, setActivePhase] = useState(1);
  const [filter, setFilter] = useState('All');
  const [milestones, setMilestones] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: mData } = await supabase.from('milestones').select('*');
        const { data: gData } = await supabase.from('strategic_goals').select('*');
        if (mData) setMilestones(mData);
        if (gData) setGoals(gData);
      } catch (error) {
        console.error('Error fetching roadmap data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentPhaseConfig = PHASES_CONFIG.find(p => p.id === activePhase)!;

  // Filter goals and milestones based on the selected phase's date range
  const phaseGoals = goals.filter(g =>
    g.target_date && g.target_date >= currentPhaseConfig.start && g.target_date <= currentPhaseConfig.end
  );

  const phaseMilestones = milestones.filter(m =>
    m.target_date && m.target_date >= currentPhaseConfig.start && m.target_date <= currentPhaseConfig.end
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Master Roadmap</h1>
          <p className="text-slate-400 mt-1">Your strategic path from October 2026 to May 2028</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            Add Milestone
          </button>
        </div >
      </div >

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl blur opacity-10 transition-opacity" />
        <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 overflow-x-auto">
          <div className="flex justify-between min-w-[1000px] relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 z-0" />
            {PHASES_CONFIG.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-4 transition-all",
                  activePhase === phase.id ? "scale-110" : "opacity-50 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full border-4 border-slate-900 flex items-center justify-center transition-all",
                  activePhase === phase.id ? `${phase.color} ring-4 ring-indigo-500/20` : "bg-slate-800"
                )}>
                  <span className="text-xs font-bold text-white">{phase.id}</span>
                </div >
                <div className="text-center max-w-[120px]">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    activePhase === phase.id ? "text-indigo-400" : "text-slate-500"
                  )}>{phase.period}</p>
                  <p className="text-xs text-slate-600 font-medium truncate">{phase.title}</p>
                </div >
              </button>
            ))}
          </div >
        </div >
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-400" />
              Phase Goals
            </h2>
            <div className="space-y-4">
              {phaseGoals.length > 0 ? phaseGoals.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                  <div className="mt-1 h-2 w-2 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors" />
                  <p className="text-sm text-slate-300 leading-relaxed">{goal.title}</p>
                </div >
              )) : (
                <p className="text-sm text-slate-500 italic">No goals assigned to this phase.</p>
              )}
            </div >
          </div >
        </div >

        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 size={20} className="text-indigo-400" />
                Key Milestones
              </h2>
              <div className="flex gap-2">
                {['All', 'Pending', 'Completed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg transition-all",
                      filter === f ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    )}
                  >{f}</button>
                ))}
              </div >
            </div >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phaseMilestones
                .filter(m => filter === 'All' || (filter === 'Completed' && m.status === 'Completed') || (filter === 'Pending' && m.status !== 'Completed'))
                .map((milestone, idx) => (
                <div key={idx} className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {milestone.status === 'Completed' ? (
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      ) : milestone.status === 'In Progress' ? (
                        <Clock size={14} className="text-indigo-400" />
                      ) : (
                        <AlertCircle size={14} className="text-slate-600" />
                      )}
                      <span className="text-[10px] font-medium text-slate-500">{milestone.status}</span>
                    </div >
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div >
                  <p className="text-sm font-bold group-hover:text-indigo-300 transition-colors">{milestone.title}</p>
                </div >
              ))}
            </div >

            {phaseMilestones.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No milestones found for this phase.</p>
                <button className="mt-4 text-indigo-400 text-sm font-medium hover:underline">Create first milestone</button>
              </div >
            )}
          </div >
        </div >
      </div >
    </div >
  );
}
