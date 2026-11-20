import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

const countdowns = [
  { label: 'Graduation', date: '2028-05-15', color: 'text-indigo-600' },
  { label: 'MBA Window', date: '2028-01-01', color: 'text-purple-600' },
  { label: 'Summer Internship', date: '2027-05-10', color: 'text-emerald-600' },
];

export default function CommandCenter() {
  const [goals, setGoals] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showAllTasks, setShowAllTasks] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [goalRes, mileRes, taskRes] = await Promise.all([
          supabase.from('strategic_goals').select('*'),
          supabase.from('milestones').select('*'),
          supabase.from('tasks').select('*').order('due_date', { ascending: true })
        ]);

        if (goalRes.data) {
          setGoals(goalRes.data);
          const total = goalRes.data.reduce((acc, g) => acc + (g.progress_percent || 0), 0);
          setOverallProgress(Math.round(total / (goalRes.data.length || 1)));
        }
        if (mileRes.data) setMilestones(mileRes.data);
        if (taskRes.data) setTasks(taskRes.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
  const remainingMilestones = milestones.length - completedMilestones;

  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'Completed');
  const upcomingTasks = tasks.filter(t => t.due_date && new Date(t.due_date) >= new Date() && t.status !== 'Completed').slice(0, 3);

  const visibleTasks = showAllTasks ? tasks : upcomingTasks;

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
            {getTimeGreeting()}, <span className="text-indigo-600">Soham</span>
          </h1>
          <p className="text-slate-500 mt-1 text-lg">"Build the skills. Create the impact."</p>
        </div >

        <div className="flex gap-3 overflow-x-auto">
          {countdowns.map((cd) => (
            <div key={cd.label} className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl shrink-0 shadow-sm">
              <Clock size={14} className={cd.color} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{cd.label}</p>
                <p className={cn("text-sm font-bold", cd.color)}>{calculateCountdown(cd.date)} days</p>
              </div >
            </div >
          ))}
        </div >
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Overall Momentum</h2>
                  <p className="text-sm text-slate-500">Progress towards May 2028 Graduation</p>
                </div >
                <span className="text-4xl font-black text-indigo-600">{overallProgress}%</span>
              </div >
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
              </div >
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { label: 'Goals', value: goals.length, color: 'text-indigo-600' },
                  { label: 'Milestones', value: milestones.length, color: 'text-slate-600' },
                  { label: 'Tasks', value: tasks.length, color: 'text-emerald-600' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium block mb-1">{stat.label}</span>
                    <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                  </div >
                ))}
              </div >
            </div >
          </div >

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                <Target size={20} className="text-indigo-600" />
                Current Priority
              </h2>
              {tasks.length > 0 && (
                <button type="button" aria-expanded={showAllTasks} onClick={() => setShowAllTasks(current => !current)} className="text-xs text-indigo-600 hover:underline font-medium">
                  {showAllTasks ? 'Show current priorities' : 'View all tasks'}
                </button>
              )}
            </div >

            <div className="space-y-3">
              {!showAllTasks && overdueTasks.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} />
                    Overdue Items
                  </h3>
                  {overdueTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <Clock size={16} className="shrink-0 text-red-400" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-red-900">{task.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] px-2 py-0.5 bg-red-100 rounded-full text-red-600 font-medium">{task.priority}</span>
                            <span className="text-[10px] text-red-400 flex items-center gap-1">
                              <Clock size={10} /> {task.due_date}
                            </span >
                          </div >
                        </div >
                      </div >
                      <div className="text-right">
                        <span className="text-[10px] px-2 py-1 bg-red-100 text-red-600 rounded-lg border border-red-200 font-medium">
                          Overdue
                        </span >
                      </div >
                    </div >
                  ))}
                </div >
              )}

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{showAllTasks ? 'All tasks' : 'Upcoming Focus'}</h3>
              {visibleTasks.length > 0 ? visibleTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <Clock size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 font-medium">{task.priority}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {task.due_date}
                        </span >
                      </div >
                    </div >
                  </div >
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 font-medium">
                      {task.status}
                    </span >
                  </div >
                </div >
              )) : (
                <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
                  No immediate tasks. Time to plan your week!
                </div >
              )}
            </div >
          </div >
        </div >

        <div className="lg:col-span-4 space-y-8">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
              <CalendarDays size={20} className="text-indigo-600" />
              Milestone Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Completed</span>
                </div >
                <span className="text-sm font-bold text-slate-900">{completedMilestones}</span>
              </div >
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-indigo-500" />
                  <span className="text-sm font-medium text-slate-600">Remaining</span>
                </div >
                <span className="text-sm font-bold text-slate-900">{remainingMilestones}</span>
              </div >
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
