import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Plus,
  AlertCircle,
  Target,
  ExternalLink,
  X,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';
import MBAApplications from './MBAApplications';

const PHASES_CONFIG = [
  {
    id: 1,
    title: 'Build the Foundation',
    period: 'October – December 2026',
    criteria: 'Defined MBA shortlist, test strategy, internship plan, research prospects, and career narrative.',
    tasks: [
      "Complete a full profile inventory: GPA, internships, projects, awards, activities, and evidence of impact",
      "Build an initial MBA shortlist of 8–12 programs and review eligibility",
      "Take one diagnostic GMAT and one diagnostic GRE",
      "Select the exam to prepare for based on the diagnostics",
      "Continue Python fundamentals and independent practice projects",
      "Prioritize securing a Summer 2027 internship",
      "Identify 3–5 potential honors research faculty mentors",
      "Write a first draft of why you eventually want to lead technology teams or businesses",
      "Review your progress"
    ]
  },
  {
    id: 2,
    title: 'Build the Credentials',
    period: 'January – April 2027',
    criteria: 'A first test score, research direction, tangible skill development, and improved academic positioning.',
    tasks: [
      "Begin MITx Supply Chain MicroMasters coursework at a manageable pace",
      "GMAT/GRE Preparation",
      "Schedule and complete a first official GMAT/GRE attempt when ready",
      "Meet prospective research professors and identify a suitable project",
      "Confirm research eligibility and course arrangements with OSU",
      "Start an independent technical project/company",
      "Identify one opportunity for meaningful initiative or leadership outside club elections",
      "Maintain or improve academic performance (3.7 or higher target)",
      "Review your progress"
    ]
  },
  {
    id: 3,
    title: 'Create Professional Impact',
    period: 'May – August 2027',
    criteria: 'Strong professional examples, a credible recommender candidate, and a finalized or near-finalized test score.',
    tasks: [
      "Complete a meaningful internship if an offer is secured",
      "Continue working on an important problem/project you took up last phase",
      "Keep a record of everything you do",
      "Build a professional relationship with a potential recommender",
      "Complete or retake the GMAT/GRE if the score warrants improvement",
      "Update your MBA resume using verified accomplishments",
      "Begin identifying Fall 2027 full-time recruiting opportunities",
      "Reflect on what your work taught you about management and leadership",
      "Review your progress"
    ]
  },
  {
    id: 4,
    title: 'Build your Application Identity',
    period: 'September – November 2027',
    criteria: 'Clear career goals, recommendation pipeline, research progress, and an organized application evidence bank.',
    tasks: [
      "Begin CSE honors research with your approved faculty mentor",
      "Define research objectives, personal responsibilities, and deliverables",
      "Record research decisions, collaboration, and emerging outcomes",
      "Identify professional and academic recommendation writers",
      "Meet recommenders, discuss your goals, and share relevant achievements",
      "Develop 5–7 authentic leadership, teamwork, impact, and growth stories",
      "Refine your short-term and long-term post-MBA career goals",
      "Review each school's official 2028 application requirements as published",
      "Begin full-time employment applications and evaluate master's backup programs"
    ]
  },
  {
    id: 5,
    title: 'Prepare Application Materials',
    period: 'December 2027 – February 2028',
    criteria: 'Applications substantially ready, recommenders engaged, and all materials organized.',
    tasks: [
      "Finalize a realistic list of schools based on fit, requirements, and workload",
      "Prepare a concise, accurate MBA resume",
      "Draft school-specific essays and short answers",
      "Explain why an MBA is relevant to your long-term leadership ambitions",
      "Support essays with concrete examples rather than generalized claims",
      "Request and coordinate recommendations with ample notice",
      "Collect transcripts, scores, and required application information",
      "Create an application calendar showing all confirmed deadlines",
      "Reach a meaningful honors research checkpoint by February",
      "Practice presenting and defending your personal and professional story"
    ]
  },
  {
    id: 6,
    title: 'Submit and Transition',
    period: 'March – May 2028',
    criteria: 'MBA applications submitted, OSU graduation completed, and career/graduate-school transition actively managed.',
    tasks: [
      "Proofread and submit each MBA application before its official deadline",
      "Confirm recommendation submissions and receipt of required documents",
      "Prepare for interviews if invited",
      "Continue your honors research and document outputs",
      "Finish OSU graduation requirements successfully",
      "Continue full-time recruiting until an acceptable next step is secured",
      "Complete direct-entry master's applications if they remain necessary and deadlines permit",
      "Record admissions results and follow-up dates, including decisions expected after May",
      "Evaluate career and educational offers without assuming admissions success"
    ]
  },
];

const PRIORITY_COLORS = {
  'Important': 'text-red-600 bg-red-50 border-red-100',
  'Moderate': 'text-amber-600 bg-amber-50 border-amber-100',
  'Less Important': 'text-slate-600 bg-slate-50 border-slate-100'
};

export default function MasterRoadmap() {
  const [activePhase, setActivePhase] = useState(1);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    async function initRoadmap() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('roadmap_tasks').select('*');

        if (error) {
          console.error('Error fetching roadmap tasks:', error);
          // Fallback to hardcoded tasks if table doesn't exist yet
          setTasks(generateDefaultTasks());
        } else if (!data || data.length === 0) {
          // Auto-seed if table exists but is empty
          const seedTasks = PHASES_CONFIG.flatMap(phase =>
            phase.tasks.map(title => ({
              phase_id: phase.id,
              title,
              is_completed: false,
              priority: 'Less Important'
            }))
          );

          const { error: seedError } = await supabase.from('roadmap_tasks').insert(seedTasks);
          if (seedError) {
            console.error('Seeding failed:', seedError);
            setTasks(generateDefaultTasks());
          } else {
            const { data: seededData } = await supabase.from('roadmap_tasks').select('*');
            setTasks(seededData || []);
          }
        } else {
          setTasks(data);
        }
      } catch (error) {
        console.error('Roadmap init error:', error);
        setTasks(generateDefaultTasks());
      } finally {
        setLoading(false);
      }
    }
    initRoadmap();
  }, []);

  function generateDefaultTasks() {
    return PHASES_CONFIG.flatMap(phase =>
      phase.tasks.map((title, idx) => ({
        id: `default-${phase.id}-${idx}`,
        phase_id: phase.id,
        title,
        is_completed: false,
        priority: 'Less Important'
      }))
    );
  }

  const toggleTask = async (id: string, currentStatus: boolean) => {
    if (id.startsWith('default-')) {
      // Local state only for default tasks until seeded
      setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
      return;
    }
    try {
      const { error } = await supabase.from('roadmap_tasks').update({ is_completed: !currentStatus }).eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const updatePriority = async (id: string, priority: string) => {
    if (id.startsWith('default-')) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
      return;
    }
    try {
      const { error } = await supabase.from('roadmap_tasks').update({ priority }).eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const { data, error } = await supabase.from('roadmap_tasks').insert([
        {
          title: newTaskTitle,
          phase_id: activePhase,
          is_completed: false,
          priority: 'Less Important'
        }
      ]).select();

      if (error) throw error;
      setNewTaskTitle('');
      setIsAddingTask(false);
      setTasks(prev => [...prev, ...(data || [])]);
    } catch (e) {
      console.error(e);
      // Local fallback
      setTasks(prev => [...prev, { id: Date.now().toString(), title: newTaskTitle, phase_id: activePhase, is_completed: false, priority: 'Less Important' }]);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (id.startsWith('default-')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('roadmap_tasks').delete().eq('id', id);
      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const currentPhaseConfig = PHASES_CONFIG.find(p => p.id === activePhase)!;

  const getPhaseTasks = () => {
    const phaseTasks = tasks.filter(t => t.phase_id === activePhase);
    const priorityMap: Record<string, number> = { 'Important': 0, 'Moderate': 1, 'Less Important': 2 };
    return phaseTasks.sort((a, b) => (priorityMap[a.priority] ?? 3) - (priorityMap[b.priority] ?? 3));
  };

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
          <p className="text-slate-500 mt-1">Your strategic path from October 2026 to May 2028</p>
        </div >
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            <Plus size={16} />
            Add Custom Task
          </button>
        </div >
      </div >

      <div className="relative">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 overflow-x-auto shadow-sm">
          <div className="flex justify-between min-w-[1000px] relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-100 z-0" />
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
                  "h-10 w-10 rounded-full border-4 border-white flex items-center justify-center transition-all shadow-sm",
                  activePhase === phase.id ? "bg-indigo-600 ring-4 ring-indigo-100" : "bg-slate-200"
                )}>
                  <span className="text-xs font-bold text-white">{phase.id}</span>
                </div >
                <div className="text-center max-w-[120px]">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    activePhase === phase.id ? "text-indigo-600" : "text-slate-400"
                  )}>{phase.period}</p>
                  <p className="text-xs text-slate-600 font-medium truncate">{phase.title}</p>
                </div >
              </button>
            ))}
          </div >
        </div >
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-500" />
              Phase Completion
            </h2>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Milestone Criteria</p>
              <p className="text-sm text-slate-700 leading-relaxed">{currentPhaseConfig.criteria}</p>
            </div >
          </div >
        </div >

        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 size={20} className="text-indigo-500" />
                Actionable Checklist
              </h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {getPhaseTasks().filter(t => t.is_completed).length} / {getPhaseTasks().length} Completed
              </span>
            </div >

            {isAddingTask && (
              <div className="flex gap-2 p-4 bg-slate-50 border border-indigo-200 rounded-2xl mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <input
                  autoFocus
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="Add a custom task to this phase..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={handleAddTask} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all">Add</button>
                <button onClick={() => setIsAddingTask(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all">Cancel</button>
              </div >
            )}

            <div className="space-y-3">
              {getPhaseTasks().length > 0 ? getPhaseTasks().map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleTask(task.id, task.is_completed)} className="transition-colors">
                      {task.is_completed ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : (
                        <Circle size={20} className="text-slate-300 group-hover:text-indigo-400" />
                      )}
                    </button>
                    <p className={cn(
                      "text-sm transition-all",
                      task.is_completed ? "text-slate-400 line-through" : "text-slate-700 font-medium"
                    )}>{task.title}</p>
                  </div >
                  <div className="flex items-center gap-3">
                    <select
                      value={task.priority}
                      onChange={(e) => updatePriority(task.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-lg border outline-none transition-all",
                        PRIORITY_COLORS[task.priority] || "bg-slate-50 text-slate-500 border-slate-200"
                      )}
                    >
                      <option value="Important">Important</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Less Important">Less Important</option>
                    </select>
                    <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <X size={14} />
                    </button>
                  </div >
                </div >
              )) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm italic">No tasks found for this phase. Add some to stay on track!</p>
                </div >
              )}
            </div >
          </div >
        </div >
      </div >

      <div className="space-y-6">
        <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-500" />
            MBA Applications
          </h2>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl overflow-x-auto">
            <p className="text-xs text-slate-500 italic mb-4">Application tracking is now integrated into the roadmap flow.</p>
            <MBAApplications />
          </div >
        </div >
      </div >
    </div >
  );
}
