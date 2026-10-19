import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyPlanner() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <CalendarIcon className="text-indigo-400" />
            Weekly Planner
          </h1>
          <p className="text-slate-400">Strategize your week. Execute your goals.</p>
        </div >
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold px-2">Oct 19 - Oct 25, 2026</span>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div >
      </div >

      {/* Weekly Priorities */}
      <div className="p-6 bg-indigo-600 rounded-2xl shadow-xl text-white">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Star size={20} />
          Primary Objectives for the Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-white/10 border border-white/20 rounded-xl flex items-center gap-3">
              <div className="h-6 w-6 rounded-full border-2 border-white/50 flex items-center justify-center text-xs font-bold">
                {i}
              </div >
              <input
                type="text"
                placeholder={`Objective ${i}...`}
                className="bg-transparent border-none outline-none text-sm placeholder:text-white/50 w-full"
              />
            </div >
          ))}
        </div >
      </div >

      {/* Daily Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day, idx) => (
          <div key={day} className="space-y-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-t-xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{day}</span>
            </div >
            <div className="p-3 bg-slate-900 border border-slate-800 border-t-0 rounded-b-xl min-h-[300px] space-y-3">
              <div className="space-y-2">
                {/* Mock Tasks */}
                {idx === 0 && [
                  { title: 'Python Modules', time: '9am', effort: '2h' },
                  { title: 'Research Outreach', time: '1pm', effort: '1h' },
                ].map((task, tIdx) => (
                  <div key={tIdx} className="p-2 bg-slate-800/50 border border-slate-800 rounded-lg group hover:border-indigo-500/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-indigo-400">{task.time}</span>
                      <div className="h-2 w-2 rounded-full bg-slate-600" />
                    </div >
                    <p className="text-xs font-medium truncate">{task.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{task.effort}</p>
                  </div >
                ))}
              </div >
              <button className="w-full p-2 border-2 border-dashed border-slate-800 rounded-lg text-slate-600 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                <Plus size={14} />
                Task
              </button>
            </div >
          </div >
        ))}
      </div >

      {/* Weekly Review Section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-400" />
          Weekly Review & Growth Log
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: 'What did I accomplish?', placeholder: 'List your wins...', icon: CheckCircle2 },
            { q: 'What did I struggle with?', placeholder: 'Identify blockers...', icon: AlertCircle },
            { q: 'What did I learn?', placeholder: 'New skills or insights...', icon: Star },
            { q: 'What should I change?', placeholder: 'Process improvements...', icon: Clock },
          ].map((field, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <field.icon size={14} />
                {field.q}
              </label>
              <textarea
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 placeholder:text-slate-600"
                placeholder={field.placeholder}
              />
            </div >
          ))}
        </div >
        <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={14} />
            Last review completed: Oct 12, 2026
          </div >
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            Save Weekly Review
            <ArrowRight size={16} />
          </button>
        </div >
      </div >
    </div >
  );
}
