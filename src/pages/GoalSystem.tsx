import React, { useState, useEffect } from 'react';
import {
  Target,
  ChevronRight,
  ChevronDown,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  Trophy,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

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

export default function GoalSystem() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ns-1']));
  const [hierarchy, setHierarchy] = useState<HierarchyNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  useEffect(() => {
    async function loadHierarchy() {
      try {
        setLoading(true);
        const [goalsRes, milestonesRes, tasksRes] = await Promise.all([
          supabase.from('strategic_goals').select('*'),
          supabase.from('milestones').select('*'),
          supabase.from('tasks').select('*')
        ]);

        const goals = goalsRes.data || [];
        const milestones = milestonesRes.data || [];
        const tasks = tasksRes.data || [];

        const tree: HierarchyNode = {
          id: 'ns-1',
          level: 'NorthStar',
          title: 'Successful May 2028 Graduation & Career Transition',
          description: 'Graduate from OSU with strong technical/professional skills, research impact, and a secured path to tech/business leadership.',
          progress: 0,
          status: 'In Progress',
          priority: 'Essential',
          children: []
        };

        tree.children = goals.map(g => {
          const goalMilestones = milestones.filter(m => m.strategic_goal_id === g.id).map(m => {
            const goalTasks = tasks.filter(t => t.milestone_id === m.id).map(t => ({
              id: t.id,
              level: 'Task' as GoalLevel,
              title: t.title,
              description: t.description || '',
              progress: t.is_completed ? 100 : 0,
              status: t.status,
              priority: t.priority,
              children: []
            }));

            return {
              id: m.id,
              level: 'Milestone' as GoalLevel,
              title: m.title,
              description: m.description || '',
              progress: m.progress_percent,
              status: m.status,
              priority: 'Essential',
              children: goalTasks
            };
          });

          return {
            id: g.id,
            level: 'Strategic' as GoalLevel,
            title: g.title,
            description: g.description || '',
            progress: g.progress_percent,
            status: 'In Progress',
            priority: 'Essential',
            children: goalMilestones
          };
        });

        const avgProgress = tree.children.reduce((acc, child) => acc + child.progress, 0) / (tree.children.length || 1);
        tree.progress = Math.round(avgProgress);

        setHierarchy(tree);
      } catch (error) {
        console.error('Error building hierarchy:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHierarchy();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;
    try {
      const { error } = await supabase.from('strategic_goals').insert([
        { title: newGoalTitle, progress_percent: 0, status: 'Not Started' }
      ]);
      if (error) throw error;
      setNewGoalTitle('');
      setIsAddingGoal(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

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
            depth === 0 ? "bg-indigo-50 border-indigo-200 mb-6" :
            depth === 1 ? "bg-white border-slate-200 ml-4 mb-2 shadow-sm" :
            depth === 2 ? "bg-slate-50 border-slate-200 ml-8 mb-1" :
            "bg-slate-100 border-slate-200 ml-12 mb-1"
          )}
          onClick={() => toggleNode(node.id)}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {hasChildren && (
              <div className="transition-transform duration-200">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div >
            )}
            <div className="flex items-center gap-2">
              {node.level === 'NorthStar' && <Trophy size={16} className="text-yellow-500" />}
              {node.level === 'Strategic' && <Target size={16} className="text-indigo-500" />}
              {node.level === 'Milestone' && <CheckCircle2 size={16} className="text-emerald-500" />}
              {node.level === 'Task' && <Clock size={16} className="text-slate-400" />}
              <span className={cn(
                "text-sm font-bold truncate",
                depth === 0 ? "text-lg" : "text-sm"
              )}>{node.title}</span>
            </div >
          </div >
          <div className="flex items-center gap-4">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium",
              node.status === 'Completed' ? "bg-emerald-100 text-emerald-600" :
              node.status === 'In Progress' ? "bg-indigo-100 text-indigo-600" :
              "bg-slate-200 text-slate-600"
            )}>{node.status}</span>
            <span className="text-xs font-black text-indigo-600 w-8 text-right">{node.progress}%</span>
          </div >
        </div >

        {isExpanded && hasChildren && (
          <div className="mt-1 space-y-1">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div >
        )}
      </div >
    );
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div >
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">North Star Achievements</h1>
          <p className="text-slate-500 mt-1">Align every daily task to your ultimate objective</p>
        </div >
        <button
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          <Plus size={16} />
          Add New Achievement
        </button>
      </div >

      {isAddingGoal && (
        <div className="flex gap-2 p-4 bg-white border border-indigo-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <input
            autoFocus
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            placeholder="What is your new strategic achievement?"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleAddGoal} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all">Add</button>
          <button onClick={() => setIsAddingGoal(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all">Cancel</button>
        </div >
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Layers size={20} className="text-indigo-500" />
              Strategic Health
            </h2>
            <div className="space-y-6">
              {hierarchy?.children.map(sg => (
                <div key={sg.id} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium truncate">{sg.title}</span>
                    <span className="text-indigo-600 font-bold">{sg.progress}%</span>
                  </div >
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${sg.progress}%` }} />
                  </div >
                </div >
              ))}
            </div >
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Alignment</span>
                <span className="text-xl font-black text-indigo-600">{hierarchy?.progress}%</span>
              </div >
            </div >
          </div >

          <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">North Star</h3>
            <p className="text-lg font-bold leading-tight">{hierarchy?.title}</p>
          </div >
        </div >

        <div className="lg:col-span-3 space-y-6">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target size={20} className="text-indigo-500" />
                Achievement Dependency Map
              </h2>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">Expand All</button>
                <button className="text-xs px-3 py-1 bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">Collapse All</button>
              </div >
            </div >

            <div className="space-y-2">
              {hierarchy ? renderNode(hierarchy) : <p className="text-center text-slate-500">No achievements found.</p>}
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
