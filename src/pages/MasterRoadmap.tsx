import React, { useState } from 'react';
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

const PHASES = [
  {
    id: 1,
    title: 'BUILD THE FOUNDATION',
    period: 'Oct – Dec 2026',
    goals: [
      'Strengthen foundational Python programming skills',
      'Secure a Summer 2027 internship',
      'Research deferred MBA programs',
      'Identify potential honors research professors',
    ],
    milestones: [
      { title: 'Establish consistent coding routine', status: 'Completed' },
      { title: 'Complete foundational Python projects', status: 'In Progress' },
      { title: 'Choose GMAT or GRE', status: 'Not Started' },
      { title: 'Create preliminary MBA shortlist', status: 'Not Started' },
    ],
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'DEVELOP SKILLS & DIRECTION',
    period: 'Jan – May 2027',
    goals: [
      'Begin MITx Supply Chain MicroMasters',
      'Start structured GMAT/GRE preparation',
      'Gain practical exposure to Pandas & SQL',
      'Confirm honors research mentor',
    ],
    milestones: [
      { title: 'Progress through MITx coursework', status: 'Not Started' },
      { title: 'First GMAT/GRE attempt', status: 'Not Started' },
      { title: 'Research direction confirmed', status: 'Not Started' },
    ],
    color: 'bg-indigo-500'
  },
  {
    id: 3,
    title: 'DEMONSTRATE PROFESSIONAL IMPACT',
    period: 'May – Aug 2027',
    goals: [
      'Complete Summer 2027 internship',
      'Document measurable contributions',
      'Build strong recommender relationship',
      'Competitive standardized test result',
    ],
    milestones: [
      { title: 'Internship project completed', status: 'Not Started' },
      { title: 'Documented professional accomplishments', status: 'Not Started' },
      { title: 'Updated resume', status: 'Not Started' },
    ],
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'BUILD THE APPLICATION',
    period: 'Aug – Dec 2027',
    goals: [
      'Begin senior-year honors research',
      'Draft deferred MBA essays',
      'Apply for full-time roles',
      'Investigate direct-entry master\'s alternatives',
    ],
    milestones: [
      { title: 'Research project underway', status: 'Not Started' },
      { title: 'First MBA essay drafts complete', status: 'Not Started' },
      { title: 'Recommenders selected', status: 'Not Started' },
    ],
    color: 'bg-pink-500'
  },
  {
    id: 5,
    title: 'EXECUTE & TRANSITION',
    period: 'Jan – May 2028',
    goals: [
      'Submit deferred MBA applications',
      'Complete honors research deliverables',
      'Satisfy graduation requirements',
      'Secure post-graduation pathway',
    ],
    milestones: [
      { title: 'MBA applications submitted', status: 'Not Started' },
      { title: 'Research deliverables completed', status: 'Not Started' },
      { title: 'Graduation: May 2028', status: 'Not Started' },
    ],
    color: 'bg-emerald-500'
  },
];

export default function MasterRoadmap() {
  const [activePhase, setActivePhase] = useState(1);
  const [filter, setFilter] = useState('All');

  const currentPhase = PHASES.find(p => p.id === activePhase)!;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
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

      {/* Interactive Horizontal Timeline */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
          <div className="flex justify-between min-w-[1000px] relative">
            {/* Timeline Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-800 z-0" />

            {PHASES.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-4 transition-all",
                  activePhase === phase.id ? "scale-110" : "opacity-60 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full border-4 border-slate-900 flex items-center justify-center transition-all",
                  activePhase === phase.id ? `${phase.color} ring-4 ring-indigo-500/30` : "bg-slate-800"
                )}>
                  <span className="text-xs font-bold text-white">{phase.id}</span>
                </div >
                <div className="text-center max-w-[120px]">
                  <p className={cn(
                    "text-xs font-bold uppercase tracking-tighter transition-colors",
                    activePhase === phase.id ? "text-indigo-400" : "text-slate-500"
                  )}>{phase.period}</p>
                  <p className="text-[10px] text-slate-600 font-medium truncate">{phase.title}</p>
                </div >
              </button>
            ))}
          </div >
        </div >
      </div >

      {/* Active Phase Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Goals Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-400" />
              Phase Goals
            </h2>
            <div className="space-y-4">
              {currentPhase.goals.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                  <div className="mt-1 h-4 w-4 rounded-full border-2 border-slate-600 group-hover:border-indigo-500 transition-colors" />
                  <p className="text-sm text-slate-300 leading-relaxed">{goal}</p>
                </div >
              ))}
            </div >
          </div >
        </div >

        {/* Milestones Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
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
              {currentPhase.milestones
                .filter(m => filter === 'All' || (filter === 'Completed' && m.status === 'Completed') || (filter === 'Pending' && m.status !== 'Completed'))
                .map((milestone, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {milestone.status === 'Completed' ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : milestone.status === 'In Progress' ? (
                        <Clock size={16} className="text-indigo-400" />
                      ) : (
                        <AlertCircle size={16} className="text-slate-600" />
                      )}
                      <span className="text-xs font-medium text-slate-400">{milestone.status}</span>
                    </div >
                    <button className="p-1 hover:bg-slate-700 rounded transition-colors">
                      <ChevronRight size={14} className="text-slate-600" />
                    </button>
                  </div >
                  <p className="text-sm font-bold group-hover:text-indigo-300 transition-colors">{milestone.title}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">Phase {currentPhase.id} Milestone</span>
                    <span className="text-[10px] text-slate-500">Detail $\rightarrow$</span>
                  </div >
                </div >
              ))}
            </div >

            {currentPhase.milestones.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No milestones defined for this phase yet.</p>
                <button className="mt-4 text-indigo-400 text-sm font-medium hover:underline">Create first milestone</button>
              </div >
            )}
          </div >
        </div >
      </div >
    </div >
  );
}
