import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Trophy,
  Filter,
  ChevronRight,
  UserCheck,
  Star,
  Target,
  FileText,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

export default function CareerTracker() {
  const [filter, setFilter] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('career_applications').select('*');
        if (error) throw error;
        setApplications(data || []);
      } catch (error) {
        console,error('Error fetching career applications:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filteredApps = applications.filter(app => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['Applied', 'Assessment', 'Interviewing'].includes(app.status);
    if (filter === 'Offers') return app.status === 'Offer';
    if (filter === 'Rejected') return app.status === 'Rejected';
    return true;
  });

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
            <Briefcase className="text-indigo-400" />
            Career & Recruiting
          </h1>
          <p className="text-slate-400">Tracking internships and full-time opportunities</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            Add Application
          </button>
        </div >
      </div >

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Apps', value: applications.length, icon: FileText, color: 'text-slate-400' },
          { label: 'Interviews', value: applications.filter(a => a.status === 'Interviewing').length, icon: Clock, color: 'text-indigo-400' },
          { label: 'Offers', value: applications.filter(a => a.status === 'Offer').length, icon: Trophy, color: 'text-yellow-400' },
          { label: 'Response Rate', value: 'TBA', icon: TrendingUp, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={14} className={stat.color} />
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
            </div >
            <p className="text-xl font-black">{stat.value}</p>
          </div >
        ))}
      </div >

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Application Pipeline</h2>
          <div className="flex gap-2">
            {['All', 'Active', 'Offers', 'Rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs rounded-lg transition-all",
                  filter === f ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                )}
              >{f}</button>
            ))}
          </div >
        </div >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/30 text-slate-500 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Company & Role</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredApps.length > 0 ? filteredApps.map(app => (
              <tr key={app.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold group-hover:text-indigo-300 transition-colors">{app.company}</span>
                    <span className="text-xs text-slate-500">{app.role}</span>
                  </div >
                </td >
                <td className="px-6 py-4 text-sm text-slate-400">{app.location}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-lg font-medium",
                    app.status === 'Offer' ? "bg-emerald-500/10 text-emerald-400" :
                    app.status === 'Interviewing' ? "bg-indigo-500/10 text-indigo-400" :
                    app.status === 'Rejected' ? "bg-red-500/10 text-red-400" : "bg-slate-800 text-slate-400"
                  )}>{app.status}</span>
                </td >
                <td className="px-6 py-4 text-sm text-slate-500">{app.application_date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-indigo-400 transition-all">
                    <ChevronRight size={16} />
                  </button>
                </td >
              </tr >
            )) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  No applications found. Time to start recruiting!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-indigo-400" />
            Accomplishments Journal
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 italic">Accomplishments journal will be live once the dedicated table is linked.</p>
            </div >
            <button className="w-full p-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-sm font-medium">
              <Plus size={16} />
              Log New Achievement
            </button>
          </div >
        </div >

        <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Interview Pro Tip</h3>
          <p className="text-sm leading-relaxed italic">
            "When describing your impact, always use the formula: 'Accomplished X as measured by Y, by doing Z.' Numbers make your story believable."
          </p>
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Star size={16} />
              </div >
              <span className="text-xs font-medium">Focus on Ownership & Initiative</span>
            </div >
          </div >
        </div >
      </div >
    </div >
  );
}
