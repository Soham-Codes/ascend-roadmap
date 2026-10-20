import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

const COURSES = [
  { id: 'sc-analytics', name: 'Supply Chain Analytics', type: 'Course' },
  { id: 'sc-fundamentals', name: 'Supply Chain Fundamentals', type: 'Course' },
  { id: 'sc-design', name: 'Supply Chain Design', type: 'Course' },
  { id: 'sc-dynamics', name: 'Supply Chain Dynamics', type: 'Course' },
  { id: 'sc-tech', name: 'Supply Chain Technology and Systems', type: 'Course' },
  { id: 'sc-exam', name: 'Supply Chain Comprehensive Exam', type: 'Exam' },
];

export default function MITxTracker() {
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('micromasters_progress').select('*');
        if (error) throw error;
        if (data) {
          const progMap: Record<string, string> = {};
          data.forEach(row => {
            progMap[row.course_id] = row.status;
          });
          setProgress(progMap);
        }
      } catch (error) {
        console.error('Error fetching MicroMasters progress:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const updateStatus = async (courseId: string, status: string) => {
    try {
      const { error } = await supabase.from('micromasters_progress').upsert({
        course_id: courseId,
        status: status
      });
      if (error) throw error;
      setProgress(prev => ({ ...prev, [courseId]: status }));
    } catch (e) {
      console.error(e);
      alert('Failed to update progress');
    }
  };

  const calculateOverallProgress = () => {
    const completed = Object.values(progress).filter(s => s === 'Completed').length;
    return Math.round((completed / COURSES.length) * 100);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-500" />
            MITx MicroMasters
          </h1>
          <p className="text-slate-500">Supply Chain Management Learning Path</p>
        </div >
        <div className="flex items-center gap-4 bg-white p-3 border border-slate-200 rounded-2xl shadow-sm">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Overall Completion</p>
            <p className="text-xl font-black text-indigo-600">{calculateOverallProgress()}%</p>
          </div >
          <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${calculateOverallProgress()}%` }} />
          </div >
        </div >
      </div >

      <div className="grid grid-cols-1 gap-4">
        {COURSES.map(course => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-indigo-300">
            <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  progress[course.id] === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                )}>
                  {course.type === 'Exam' ? <GraduationCap size={20} /> : <BookOpen size={20} />}
                </div >
                <div>
                  <h3 className="font-bold text-slate-900">{course.name}</h3>
                  <p className="text-xs text-slate-500">{course.type}</p>
                </div >
              </div >
              <div className="flex items-center gap-4">
                <select
                  value={progress[course.id] || 'Enrolled'}
                  onChange={(e) => updateStatus(course.id, e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {expandedCourse === course.id ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </div >
            </div >
            {expandedCourse === course.id && (
              <div className="p-5 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className={progress[course.id] === 'Completed' ? "text-emerald-500" : "text-slate-300"} />
                      <span className="text-sm text-slate-600">Core Modules Completion</span>
                    </div >
                    <span className="text-xs font-bold text-indigo-600">{progress[course.id] === 'Completed' ? 'Done' : 'Pending'}</span>
                  </div >
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-600">Exam Preparation Phase</span>
                    </div >
                    <span className="text-xs font-bold text-indigo-600">{progress[course.id] === 'Completed' ? 'Completed' : 'In Progress'}</span>
                  </div >
                </div >
              </div >
            )}
          </div >
        ))}
      </div >
    </div >
  );
}
