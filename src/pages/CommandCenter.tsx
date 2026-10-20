import React, { useState, useEffect } from 'react';
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
  BookOpen,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

const countdowns = [
  { label: 'Graduation', date: '2028-05-15', color: 'text-indigo-400' },
  { label: 'MBA Window', date: '2028-01-01', color: 'text-purple-400' },
  { label: 'Summer Internship', date: '2027-05-10', color: 'text-emerald-400' },
];

export default function CommandCenter() {
  const [workstreams, setWorkstreams] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: wsData } = await supabase.from('workstreams').select('*');
        if (wsData) setWorkstreams(wsData);

        const { data: goalData } = await supabase.from('strategic_goals').select('*');
        if (goalData) {
          setGoals(goalData);
          const total = goalData.reduce((acc, g) => acc + (g.progress_percent || 0), 0);
          setOverallProgress(Math.round(total / (goalData.length || 1)));
        }

        const { data: taskData } = await supabase
          .from('tasks')
          .select('*, milestones(title)')
          .order('due_date', { ascending: true })
          .limit(3);
        if (taskData) setTasks(taskData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const { data: milestone } = await supabase
        .from('milestones')
        .select('id')
        .limit(1)
        .single();

      if (!milestone) {
        alert('Please create a milestone first in the Goals page!');
        return;
      }

      const { error } = await supabase.from('tasks').insert([
        {
          milestone_id: milestone.id,
          title: newTaskTitle,
          status: 'Not Started',
          priority: 'Important',
          due_date: new Date().toISOString().split('T')[0],
        },
      ]);

      if (error) throw error;

      setNewTaskTitle('');
      setIsAddingTask(false);

      const { data: updatedTasks } = await supabase
        .from('tasks')
        .select('*, milestones(title)')
        .order('due_date', { ascending: true })
        .limit(3);
      if (updatedTasks) setTasks(updatedTasks);

    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Check console.');
    }
  };

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

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">
            {getTimeGreeting()}, <span className="text-indigo-500">Soham</span>
          </h1>
          <p className="text-slate-400 mt-1 text-lg">"Build the skills. Create the impact."</p>
        </div >

        <div className="flex gap-3 overflow-x-auto">
          {countdowns.map((cd) => (
            <div key={cd.label} className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
              <Clock size={14} className={cd.color} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{cd.label}</p>
                <p className={cn("text-sm font-bold", cd.color)}>{calculateCountdown(cd.date)} days</p>
              </div >
            </div >
          ))}
        </div >
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Overall Momentum</h2>
                  <p className="text-sm text-slate-500">Progress towards May 2028 Graduation</p>
                </div >
                <span className="text-4xl font-black text-indigo-400">{overallProgress}%</span>
              </div >
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
              </div >
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { label: 'Goals', value: goals.length, color: 'text-indigo-400' },
                  { label: 'Workstreams', value: workstreams.length, color: 'text-slate-400' },
                  { label: 'Tasks', value: tasks.length, color: 'text-emerald-400' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
                    <span className="text-xs text-slate-500 font-medium block mb-1">{stat.label}</span>
                    <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                  </div >
                ))}
              </div >
            </div >
          </div >

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target size={20} className="text-indigo-400" />
                This Week's Focus
              </h2>
              <button className="text-xs text-indigo-400 hover:underline">View all tasks</button>
            </div >

            {isAddingTask ? (
              <div className="flex gap-2 p-4 bg-slate-800/50 border border-indigo-500/30 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                <input
                  autoFocus
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="What needs to be done?"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div >
            ) : (
              <div className="space-y-3">
                {tasks.length > 0 ? tasks.map((task, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-5 w-5 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-colors" />
                      <div>
                        <p className="text-sm font-semibold group-hover:text-indigo-300 transition-colors">{task.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 font-medium">{task.priority}</span>
                          <span className="text-[10px] text-slate-600 flex items-center gap-1">
                            <Clock size={10} /> {task.due_date}
                          </span>
                        </div >
                      </div >
                    </div >
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 font-medium">
                        {task.status}
                      </span>
                    </div >
                  </div >
                )) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                    No immediate tasks. Time to plan your week!
                  </div >
                )}
              </div >
            )}
          </div >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workstreams.map((ws) => (
              <div key={ws.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚀</span>
                    <p className="text-sm font-bold group-hover:text-indigo-300 transition-colors">{ws.name}</p>
                  </div >
                  <span className="text-xs font-black text-indigo-400">Pending</span>
                </div >
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", ws.color_code || 'bg-indigo-500')} style={{ width: '10%' }} />
                </div >
              </div >
            ))}
          </div >
        </div >

        <div className="lg:col-span-4 space-y-8">
          <div className="p-6 bg-indigo-600 rounded-3xl shadow-lg text-white">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'New Task', icon: Plus, action: () => setIsAddingTask(true) },
                { label: 'Log Achievement', icon: Trophy },
                { label: 'Plan Week', icon: CalendarDays },
                { label: 'Add Reflection', icon: BookOpen },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium group"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={16} />
                    {action.label}
                  </div >
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div >
          </div >

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CalendarDays size={20} className="text-indigo-400" />
              Upcoming
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Python Basics Quiz', date: 'Oct 21', type: 'Skill', urgency: 'high' },
                { title: 'GMAT Diagnostic', date: 'Oct 24', type: 'MBA', urgency: 'medium' },
                { title: 'Research Outreach', date: 'Oct 27', type: 'Research', urgency: 'medium' },
              ].map((dl, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      dl.urgency === 'high' ? "bg-red-500" : dl.urgency === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                    )} />
                    <div>
                      <p className="text-xs font-semibold">{dl.title}</p>
                      <p className="text-[10px] text-slate-500">{dl.date} • {dl.type}</p>
                    </div >
                  </div >
                  <ChevronRight size={14} className="text-slate-600" />
                </div >
              ))}
            </div >
          </div >

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-400" />
              Reflection
            </h2>
            <p className="text-xs text-slate-500 mb-4">"What progress did you make this week?"</p>
            <div className="relative">
              <textarea
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20 placeholder:text-slate-600"
                placeholder="Note your wins..."
              />
              <button className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg">
                <CheckCircle2 size={14} />
              </button>
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
