import React, { useState } from 'react';
import {
  Microscope,
  UserSearch,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Trophy,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function HonorsResearch() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Microscope className="text-indigo-400" />
            Honors Research Tracker
          </h1>
          <p className="text-slate-400">Exploratory AI research for Supply Chain & Operational Systems</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            New Entry
          </button>
        </div >
      </div >

      {/* Research Core */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target size={20} className="text-indigo-400" />
              Current Research Direction
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Working Topic</label>
                <p className="text-xl font-bold text-indigo-300 mt-1">"AI-Assisted Decision-Making for Supply Chain and Operational Systems"</p>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Exploring the intersection of LLMs, Reinforcement Learning, and Operations Research to optimize complex supply chain networks.
                </p>
              </div >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Primary Objective</span>
                  <p className="text-sm font-semibold">Demonstrate independent problem-solving in AI + OR</p>
                </div >
                <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Target Outcome</span>
                  <p className="text-sm font-semibold">Peer-reviewed paper or high-impact case study</p>
                </div >
              </div >
            </div >
          </div >

          {/* Research Roadmap */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-indigo-400" />
              Research Timeline
            </h2>
            <div className="space-y-6">
              {[
                { phase: 'Proposal', date: 'Fall 2027', status: 'Planned', detail: 'Identify gaps in current AI/SC literature' },
                { phase: 'Methodology', date: 'Fall 2027', status: 'Planned', detail: 'Define data sources and model architecture' },
                { phase: 'Experiments', date: 'Winter 2027', status: 'Planned', detail: 'Run tests and validate results' },
                { phase: 'Deliverables', date: 'Spring 2028', status: 'Planned', detail: 'Final paper and presentation' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2 border-slate-800 transition-all",
                      step.status === 'Completed' ? "bg-emerald-500 border-emerald-500" : "bg-slate-900 group-hover:border-indigo-500"
                    )} />
                    {idx < 3 && <div className="w-0.5 h-10 bg-slate-800" />}
                  </div >
                  <div className="flex-1 p-4 bg-slate-800/30 border border-slate-800 rounded-xl group-hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{step.phase}</span>
                      <span className="text-xs text-slate-500">{step.date}</span>
                    </div >
                    <p className="text-xs text-slate-400">{step.detail}</p>
                  </div >
                </div >
              ))}
            </div >
          </div >
        </div >

        {/* Outreach & Faculty Tracker */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserSearch size={20} className="text-indigo-400" />
              Faculty Outreach
            </h2>
            <div className="space-y-3">
              {[
                { name: 'TBA Professor A', dept: 'CSE / AI', status: 'Identified', priority: 'High' },
                { name: 'TBA Professor B', dept: 'Operations Research', status: 'Identified', priority: 'Medium' },
                { name: 'TBA Professor C', dept: 'Industrial Eng', status: 'Identified', priority: 'Low' },
              ].map((prof, idx) => (
                <div key={idx} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold">{prof.name}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">{prof.status}</span>
                  </div >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{prof.dept}</span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase",
                      prof.priority === 'High' ? "text-red-400" : "text-slate-500"
                    )}>{prof.priority} Priority</span>
                  </div >
                </div >
              ))}
            </div >
            <button className="w-full mt-4 p-2 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Plus size={14} />
              Add Professor
            </button>
          </div >

          <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">MBA Synergy</h3>
            <p className="text-sm leading-relaxed">
              Ensure your research outcomes are documented as "Leadership Evidence" for your deferred MBA essays. Focus on independent ownership.
            </p>
          </div >
        </div >
      </div >
    </div >
  );
}
