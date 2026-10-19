import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Filter,
  MoreVertical,
  FileText,
  UserCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

const STATUSES = [
  'Researching', 'Planning to Apply', 'In Progress', 'Submitted',
  'Interview Invited', 'Interview Complete', 'Accepted', 'Waitlisted', 'Rejected', 'Withdrawn'
];

export default function MBAApplications() {
  const [view, setView] = useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mba_applications')
          .select(`
            *,
            mba_programs (
              university,
              business_school,
              program_name,
              website
            )
          `);

        if (error) throw error;

        // Flatten the joined data for easier use in the UI
        const flattened = (data || []).map(app => ({
          id: app.id,
          university: app.mba_programs?.university || 'TBA',
          business_school: app.mba_programs?.business_school || 'TBA',
          program_name: app.mba_programs?.program_name || 'TBA',
          priority: app.priority || 'Optional',
          status: app.status || 'Researching',
          fit: app.interest_level || 0,
        }));

        setApplications(flattened);
      } catch (error) {
        console.error('Error fetching MBA applications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const filteredSchools = applications.filter(s =>
    s.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.business_school.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <GraduationCap className="text-indigo-400" />
            MBA Application Center
          </h1>
          <p className="text-slate-400">Manage your path to a deferred MBA program</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            <Trophy size={16} />
            Test Scores
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            Add School
          </button>
        </div >
      </div >

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search universities..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div >
        <div className="flex p-1 bg-slate-800 rounded-xl">
          <button
            onClick={() => setView('board')}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
              view === 'board' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setView('table')}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
              view === 'table' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Detailed Table
          </button>
        </div >
      </div >

      {view === 'board' ? (
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
          {STATUSES.map(status => (
            <div key={status} className="min-w-[300px] snap-start space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{status}</h3>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                  {filteredSchools.filter(s => s.status === status).length}
                </span>
              </div >
              <div className="space-y-3">
                {filteredSchools.filter(s => s.status === status).map(school => (
                  <div
                    key={school.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                          school.priority === 'Essential' ? "bg-red-500/10 text-red-400" :
                          school.priority === 'Important' ? "bg-amber-500/10 text-amber-400" : "bg-slate-700 text-slate-400"
                        )}>{school.priority}</span>
                      </div >
                      <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-800 rounded transition-all">
                        <MoreVertical size={14} className="text-slate-500" />
                      </button>
                    </div >
                    <p className="font-bold text-sm leading-tight group-hover:text-indigo-300 transition-colors">{school.business_school}</p>
                    <p className="text-xs text-slate-500 mt-1 truncate">{school.university}</p>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Trophy size={12} className="text-yellow-500" />
                        <span className="text-[10px] text-slate-400 font-medium">Fit: {school.fit}/5</span>
                      </div >
                      <ExternalLink size={12} className="text-slate-600 hover:text-indigo-400 transition-colors" />
                    </div >
                  </div >
                ))}
                {filteredSchools.filter(s => s.status === status).length === 0 && (
                  <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center">
                    <p className="text-xs text-slate-600">No schools in this stage</p>
                  </div >
                )}
              </div >
            </div >
          ))}
        </div >
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">School & Program</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Fit Score</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSchools.map(school => (
                <tr key={school.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold group-hover:text-indigo-300 transition-colors">{school.business_school}</span>
                      <span className="text-xs text-slate-500">{school.program_name}</span>
                    </div >
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                      {school.status}
                    </span>
                  </td >
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-bold uppercase",
                      school.priority === 'Essential' ? "text-red-400" :
                      school.priority === 'Important' ? "text-amber-400" : "text-slate-500"
                    )}>{school.priority}</span>
                  </td >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Trophy size={12} className="text-yellow-500" />
                      <span className="text-sm">{school.fit}/5</span>
                    </div >
                  </td >
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">TBA — Verify Official Deadline</span>
                  </td >
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-indigo-400 transition-all" title="Edit Application">
                        <FileText size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-indigo-400 transition-all" title="Recs Tracking">
                        <UserCheck size={16} />
                      </button>
                    </div >
                  </td >
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSchools.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500">No schools found matching your search.</p>
            </div >
          )}
        </div >
      )}
    </div >
  );
}
