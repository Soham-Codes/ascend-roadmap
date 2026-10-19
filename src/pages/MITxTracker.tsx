import React, { useState } from 'react';
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
import { cn } from '@/lib/utils';

const INITIAL_COURSES = [
  { id: 'c1', name: 'SCM.1x: Supply Chain Analytics', status: 'Planned', start_date: '2027-01-15', end_date: '2027-03-15', progress: 0, grade: 'TBA', certificate: 'Pending' },
  { id: 'c2', name: 'SCM.2x: Supply Chain Design', status: 'Planned', start_date: '2027-04-01', end_date: '2027-06-01', progress: 0, grade: 'TBA', certificate: 'Pending' },
  { id: 'c3', name: 'SCM.3x: Supply Chain Dynamics', status: 'Planned', start_date: '2027-07-01', end_date: '2027-09-01', progress: 0, grade: 'TBA', certificate: 'Pending' },
  { id: 'c4', name: 'SCM.4x: Supply Chain Strategy', status: 'Planned', start_date: '2027-10-01', end_date: '2027-12-01', progress: 0, grade: 'TBA', certificate: 'Pending' },
];

export default function MITxTracker() {
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

      {/* Program Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Overall Progress</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-indigo-400">0%</span>
            <span className="text-xs text-slate-600 mb-1">of 4 courses</span>
          </div >
          <div className="w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: '0%' }} />
          </div >
        </div >
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Next Milestone</p>
          <div className="flex items-center gap-3">
            <Calendar className="text-indigo-400" size={20} />
            <span className="text-lg font-bold">Jan 15, 2027</span>
          </div >
          <p className="text-xs text-slate-600 mt-1">SCM.1x Start Date</p>
        </div >
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Certs Earned</p>
          <div className="flex items-center gap-3">
            <Award className="text-yellow-500" size={20} />
            <span className="text-lg font-bold">0 / 4</span>
          </div >
          <p className="text-xs text-slate-600 mt-1">Professional Certificates</p>
        </div >
      </div >

      {/* Course List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy size={20} className="text-indigo-400" />
          Curriculum Tracker
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {INITIAL_COURSES.map((course) => (
            <div key={course.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all group shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-lg font-bold uppercase tracking-tighter">
                      {course.status}
                    </span>
                    <h3 className="text-lg font-bold group-hover:text-indigo-300 transition-colors">{course.name}</h3>
                  </div >
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {course.start_date} $\rightarrow$ {course.end_date}
                    </div >
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Grade: {course.grade}
                    </div >
                    <div className="flex items-center gap-1">
                      <Award size={14} />
                      Cert: {course.certificate}
                    </div >
                  </div >
                </div >
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium mb-1">Course Progress</p>
                    <p className="text-xl font-black text-indigo-400">{course.progress}%</p>
                  </div >
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${course.progress}%` }} />
                  </div >
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <ChevronRight size={20} className="text-slate-400" />
                  </button>
                </div >
              </div >
            </div >
          ))}
        </div >
      </div >
    </div >
  );
}
