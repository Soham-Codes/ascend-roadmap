import React, { useState } from 'react';
import {
  Target,
  ChevronRight,
  ChevronDown,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';

type GoalLevel = 'NorthStar' | 'Strategic' | 'Milestone' | 'Task';

interface HierarchyNode {
  id: string;
  level: GoalLevel;
  title: string;
  description: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
  priority: 'Essential' | 'Important' | 'Optional';
  children: HierarchyNode[];
}

const MOCK_HIERARCHY: HierarchyNode = {
  id: 'ns-1',
  level: 'NorthStar',
  title: 'Successful May 2028 Graduation & Career Transition',
  description: 'Graduate from OSU with strong technical/professional skills, research impact, and a secured path to tech/business leadership.',
  progress: 42,
  status: 'In Progress',
  priority: 'Essential',
  children: [
    {
      id: 'sg-1',
      level: 'Strategic',
      title: 'Secure Full-Time Employment',
      description: 'Land a high-impact role in AI Engineering, PM, or Analytics.',
      progress: 30,
      status: 'In Progress',
      priority: 'Essential',
      children: [
        {
          id: 'm-1',
          level: 'Milestone',
          title: 'Summer 2027 Internship Completion',
          description: 'Successfully complete internship with documented impact.',
          progress: 100,
          status: 'Completed',
          priority: 'Essential',
          children: [
            { id: 't-1', level: 'Task', title: 'Document KPI improvements', description: 'Quantify results from Summer project', progress: 100, status: 'Completed', priority: 'Essential', children: [] },
            { id: 't-2', level: 'Task', title: 'Secure manager recommendation', description: 'Formalize relationship with lead', progress: 50, status: 'In Progress', priority: 'Essential', children: [] },
          ],
        },
        {
          id: 'm-2',
          level: 'Milestone',
          title: 'Full-Time Offer secured',
          description: 'Receive and accept a competitive FT offer.',
          progress: 0,
          status: 'Not Started',
          priority: 'Essential',
          children: [],
        },
      ],
    },
    {
      id: 'sg-2',
      level: 'Strategic',
      title: 'Gain Admission to Top Deferred MBA',
      description: 'Secure a seat at HBS, Stanford, or similar elite program.',
      progress: 15,
      status: 'In Progress',
      priority: 'Essential',
      children: [
        {
          id: 'm-3',
          level: 'Milestone',
          title: 'Competitive Standardized Test Score',
          description: 'Achieve 730+ GMAT or equivalent GRE.',
          progress: 20,
          status: 'In Progress',
          priority: 'Essential',
          children: [
            { id: 't-3', level: 'Task', title: 'Complete diagnostic test', description: 'Baseline score assessment', progress: 100, status: 'Completed', priority: 'Essential', children: [] },
            { id: 't-4', level: 'Task', title: 'Study Quant section', description: 'Focus on high-weight topics', progress: 10, status: 'In Progress', priority: 'Important', children: [] },
          ],
        },
      ],
    },
    {
      id: 'sg-3',
      level: 'Strategic',
      title: 'Become Technically Proficient',
      description: 'Master AI, Python, and Data Engineering fundamentals.',
      progress: 50,
      status: 'In Progress',
      priority: 'Essential',
      children: [
        {
          id: 'm-4',
          level: 'Milestone',
          title: 'Python Mastery',
          description: 'Implement complex data structures and AI modules independently.',
          progress: 60,
          status: 'In Progress',
          priority: 'Essential',
          children: [
            { id: 't-5', level: 'Task', title: 'OOP Fundamentals', description: 'Build a class-based project', progress: 100, status: 'Completed', priority: 'Essential', children: [] },
            { id: 't-6', level: 'Task', title: 'Pandas Data Analysis', description: 'Analyze a real-world dataset', progress: 40, status: 'In Progress', priority: 'Essential', children: [] },
          ],
        },
      ],
    },
  ],
};

export default function GoalSystem() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ns-1']));

  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedNodes(next);
  };

  const renderNode = (node: HierarchyNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={cn(
            "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
            depth === 0 ? "bg-indigo-600/10 border-indigo-500/30 mb-4" :
            depth === 1 ? "bg-slate-900 border-slate-800 ml-4" :
            depth === 2 ? "bg-slate-800/40 border-slate-800 ml-8" :
            "bg-slate-800/20 border-slate-800 ml-12"
          )}
          onClick={() => toggleNode(node.id)}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {hasChildren && (
              <div className="transition-transform duration-200">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div >
            )}
            <div className="flex items-center gap-2">
              {node.level === 'NorthStar' && <Trophy size={16} className="text-yellow-400" />}
              {node.level === 'Strategic' && <Target size={16} className="text-indigo-400" />}
              {node.level === 'Milestone' && <CheckCircle2 size={16} className="text-emerald-400" />}
              {node.level === 'Task' && <Clock size={16} className="text-slate-400" />}
              <span className={cn(
                "text-sm font-bold truncate",
                depth === 0 ? "text-lg" : "text-sm"
              )}>{node.title}</span>
            </div >
          </div >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{node.priority}</span>
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                node.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400" :
                node.status === 'In Progress' ? "bg-indigo-500/10 text-indigo-400" :
                "bg-slate-700 text-slate-400"
              )}>{node.status}</span>
            </div >
            <span className="text-xs font-black text-indigo-400 w-8 text-right">{node.progress}%</span>
          </div >
        </div >

        {isExpanded && hasChildren && (
          <div className="mt-2 space-y-2">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div >
        )}
      </div >
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">North Star Goal System</h1>
          <p className="text-slate-400 mt-1">Align every daily task to your ultimate graduation objective</p>
        </div >
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
          <Plus size={16} />
          Add New Goal
        </button>
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel: Strategic Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Layers size={20} className="text-indigo-400" />
              Strategic Health
            </h2>
            <div className="space-y-4">
              {MOCK_HIERARCHY.children.map(sg => (
                <div key={sg.id} className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium truncate">{sg.title}</span>
                    <span className="text-indigo-400 font-bold">{sg.progress}%</span>
                  </div >
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${sg.progress}%` }} />
                  </div >
                </div >
              ))}
            </div >
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Alignment</span>
                <span className="text-lg font-black text-indigo-400">{MOCK_HIERARCHY.progress}%</span>
              </div >
            </div >
          </div >

          <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">North Star</h3>
            <p className="text-lg font-bold leading-tight">{MOCK_HIERARCHY.title}</p>
            <p className="text-xs opacity-70 mt-2">{MOCK_HIERARCHY.description}</p>
          </div >
        </div >

        {/* Right Panel: Hierarchy Explorer */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target size={20} className="text-indigo-400" />
                Goal Dependency Map
              </h2>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">Expand All</button>
                <button className="text-xs px-3 py-1 bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">Collapse All</button>
              </div >
            </div >

            <div className="space-y-2">
              {renderNode(MOCK_HIERARCHY)}
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
