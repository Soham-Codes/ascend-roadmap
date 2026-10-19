import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Award,
  FileText,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

export default function MITxTracker() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('mitx_courses').select('*');
        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching MITx courses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const overallProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + (c.progress_percent || 0), 0) / courses.length)
    : 0;

  const nextCourse = courses[0]; // Simplified: assume first in list is next

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-400" />
            MITx MicroMasters
          </h1>
          <p className="text-slate-400">Supply Chain Management Professional Certification</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            Add Course
          </button>
        </div >
      </div >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Overall Progress</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-indigo-400">{overallProgress}%</span>
            <span className="text-xs text-slate-600 mb-1">of {courses.length} courses</span>
          </div >
          <div className="w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${overallProgress}%` }} />
          </div >
        </div >
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Next Milestone</p>
          <div className="flex items-center gap-3">
            <Calendar className="text-indigo-400" size={20} />
            <span className="text-lg font-bold">{nextCourse?.start_date || 'TBA'}</span>
          </div >
          <p className="text-xs text-slate-600 mt-1">{nextCourse?.course_name || 'Course start date'}</p>
        </div >
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Certs Earned</p>
          <div className="flex items-center gap-3">
            <Award className="text-yellow-500" size={20} />
            <span className="text-lg font-bold">
              {courses.filter(c => c.certificate_status === 'Earned').length} / {courses.length}
            </span>
          </div >
          <p className="text-xs text-slate-600 mt-1">Professional Certificates</p>
        </div >
      </div >

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy size={20} className="text-indigo-400" />
          Curriculum Tracker
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {courses.length > 0 ? courses.map((course) => (
            <div key={course.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all group shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-lg font-bold uppercase tracking-tighter">
                      {course.status || 'Planned'}
                    </span>
                    <h3 className="text-lg font-bold group-hover:text-indigo-300 transition-colors">{course.course_name}</h3>
                  </div >
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {course.start_date} $\rightarrow$ {course.end_date}
                    </div >
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Grade: {course.grade || 'TBA'}
                    </div >
                    <div className="flex items-center gap-1">
                      <Award size={14} />
                      Cert: {course.certificate_status || 'Pending'}
                    </div >
                  </div >
                </div >
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium mb-1">Course Progress</p>
                    <p className="text-xl font-black text-indigo-400">{course.progress_percent || 0}%</p>
                  </div >
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${course.progress_percent || 0}%` }} />
                  </div >
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <ChevronRight size={20} className="text-slate-400" />
                  </button>
                </div >
              </div >
            </div >
          )) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              No courses found. Add your MITx MicroMasters courses to start tracking.
            </div >
          )}
        </div >
      </div >
    </div >
  );
}
