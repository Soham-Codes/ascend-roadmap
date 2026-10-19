import React from 'react';
import {
  ShieldAlert,
  ArrowRightLeft,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function GraduateBackupPlan() {
  const paths = [
    {
      id: 'path-a',
      title: 'Path A: Full-Time Employment',
      icon: Briefcase,
      color: 'text-emerald-400',
      description: 'Secure a high-impact role and gain professional experience before pursuing an MBA.',
      pros: ['Immediate income', 'Real-world experience', 'Stronger MBA application later'],
      cons: ['Delayed academic progression', 'Risk of losing academic momentum'],
      status: 'Viable',
      priority: 2,
    },
    {
      id: 'path-b',
      title: 'Path B: Specialized Master\'s Degree',
      icon: GraduationCap,
      color: 'text-blue-400',
      description: 'Pursue a specialized Master\'s in Business Analytics, SCM, or Industrial Engineering.',
      pros: ['Academic specialization', 'Better technical positioning', 'Safety net for top MBA'],
      cons: ['Additional tuition cost', 'Delayed entry to workforce'],
      status: 'Exploring',
      priority: 3,
    },
    {
      id: 'path-c',
      title: 'Path C: Deferred MBA',
      icon: ShieldAlert,
      color: 'text-indigo-400',
      description: 'Secure admission in Spring 2028 and work during the deferral period.',
      pros: ['Guaranteed seat at elite school', 'Peace of mind', 'Professional growth'],
      cons: ['Competitive application process', 'Strict deferral terms'],
      status: 'Primary Goal',
      priority: 1,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="text-indigo-400" />
            Contingency Planning
          </h1>
          <p className="text-slate-400">Strategic alternatives to ensure a seamless transition after May 2028</p>
        </div >
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
          <Plus size={16} />
          Add Option
        </button>
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div key={path.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-800", path.color)}>
                <path.icon size={24} />
              </div >
              <span className={cn(
                "text-xs px-2 py-1 rounded-full font-bold uppercase",
                path.status === 'Primary Goal' ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-400"
              )}>{path.status}</span>
            </div >
            <h2 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">{path.title}</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{path.description}</p>

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pros</span>
                <ul className="space-y-1">
                  {path.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div >
              <div className="space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Cons</span>
                <ul className="space-y-1">
                  {path.cons.map((con, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div >
            </div >
            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:text-white">
              Explore Requirements
              <ExternalLink size={14} />
            </button>
          </div >
        ))}
      </div >

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-400" />
          Decision Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Criteria</th>
                <th className="px-4 py-3">Employment</th>
                <th className="px-4 py-3">Master's</th>
                <th className="px-4 py-3">Deferred MBA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="px-4 py-3 font-bold">Financial Risk</td>
                <td className="px-4 py-3 text-emerald-400">Low (Earn)</td>
                <td className="px-4 py-3 text-red-400">High (Cost)</td>
                <td className="px-4 py-3 text-emerald-400">Low (Earn)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold">Career Velocity</td>
                <td className="px-4 py-3 text-slate-300">Steady</td>
                <td className="px-4 py-3 text-indigo-400">Accelerated</td>
                <td className="px-4 py-3 text-indigo-400">Maximum</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold">Certainty</td>
                <td className="px-4 py-3 text-slate-300">Moderate</td>
                <td className="px-4 py-3 text-emerald-400">High</td>
                <td className="px-4 py-3 text-red-400">Competitive</td>
              </tr>
            </tbody>
          </table>
        </div >
      </div >
    </div >
  );
}
