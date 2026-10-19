import React from 'react';
import {
  Zap,
  Lightbulb,
  Rocket,
  Trophy,
  Plus,
  CheckCircle2,
  Target,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function LeadershipEntrepreneurship() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Rocket className="text-indigo-400" />
            Leadership & Entrepreneurship
          </h1>
          <p className="text-slate-400">Evidence of initiative, ownership, and real-world impact</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            Log Initiative
          </button>
        </div >
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leadership Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-indigo-400" />
              Impact & Initiative Log
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Lead Research Initiative', problem: 'Lack of standardized data for AI/SC', action: 'Designed a cross-functional data collection framework', outcome: 'Increased data consistency by 40%', status: 'In Progress' },
                { title: 'Internship Project Ownership', problem: 'Slow report generation for stakeholders', action: 'Automated reporting pipeline using Python/SQL', outcome: 'Reduced report time from 4h to 10m', status: 'Completed' },
                { title: 'Community Tech Mentoring', problem: 'Freshmen struggling with Git/GitHub', action: 'Organized weekly peer-led workshops', outcome: 'Mentored 15+ students', status: 'Completed' },
              ].map((init, idx) => (
                <div key={idx} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-sm group-hover:text-indigo-300 transition-colors">{init.title}</h3>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      init.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                    )}>{init.status}</span>
                  </div >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase font-bold text-[10px] block">The Problem</span>
                      <p className="text-slate-300">{init.problem}</p>
                    </div >
                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase font-bold text-[10px] block">The Action</span>
                      <p className="text-slate-300">{init.action}</p>
                    </div >
                  </div >
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-xs font-bold text-slate-300">{init.outcome}</span>
                    </div >
                    <button className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-600 hover:text-indigo-400">
                      <ChevronRight size={14} />
                    </button>
                  </div >
                </div >
              ))}
            </div >
          </div >
        </div >

        {/* Entrepreneurship Idea Journal */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-indigo-400" />
              Idea Journal
            </h2>
            <div className="space-y-4">
              {[
                { problem: 'Fragmented SC visibility', solution: 'AI-driven real-time tracking', status: 'Ideation' },
                { problem: 'Academic research silos', solution: 'Collaborative AI-research hub', status: 'Validation' },
              ].map((idea, idx) => (
                <div key={idx} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
                  <p className="text-xs font-bold text-slate-300 mb-1">{idea.problem}</p>
                  <p className="text-[10px] text-slate-500 mb-2">{idea.solution}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-400">{idea.status}</span>
                    <ArrowRight size={12} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div >
                </div >
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                <Plus size={14} />
                New Idea
              </button>
            </div >
          </div >

          <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Core Philosophy</h3>
            <p className="text-sm leading-relaxed italic">
              {"Impact > Title. Focus on solving real problems and documenting the results. The admission committee values evidence of initiative over elected positions."}
            </p>
          </div >
        </div >
      </div >
    </div >
  );
}
