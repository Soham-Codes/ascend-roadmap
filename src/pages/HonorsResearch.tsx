import React, { useState, useEffect } from 'react';
import {
  Microscope,
  Plus,
  UserSearch,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

export default function HonorsResearch() {
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProf, setNewProf] = useState({
    name: '',
    research: '',
    department: '',
    status: 'Reached out'
  });

  useEffect(() => {
    async function fetchProfessors() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('research_entries')
          .select('*');
        if (error) throw error;
        setProfessors(data || []);
      } catch (error) {
        console.error('Error fetching professors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfessors();
  }, []);

  const handleAddProf = async () => {
    if (!newProf.name.trim()) return;
    try {
      const { error } = await supabase.from('research_entries').insert([
        {
          topic: newProf.research, // Using topic as research field for compatibility
          professor_name: newProf.name,
          department: newProf.department,
          status: newProf.status
        }
      ]);
      if (error) throw error;
      setNewProf({ name: '', research: '', department: '', status: 'Reached out' });
      setIsAdding(false);
      const { data } = await supabase.from('research_entries').select('*');
      if (data) setProfessors(data);
    } catch (e) {
      console.error(e);
      alert('Failed to add professor');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('research_entries').update({ status }).eq('id', id);
      if (error) throw error;
      setProfessors(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const deleteProf = async (id: string) => {
    try {
      const { error } = await supabase.from('research_entries').delete().eq('id', id);
      if (error) throw error;
      setProfessors(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete professor');
    }
  };

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
            <Microscope className="text-indigo-500" />
            Honors Research
          </h1>
          <p className="text-slate-500">Faculty outreach and project alignment</p>
        </div >
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          <Plus size={16} />
          Add Professor
        </button>
      </div >

      {isAdding && (
        <div className="p-6 bg-white border border-indigo-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              autoFocus
              type="text"
              value={newProf.name}
              onChange={(e) => setNewProf({ ...newProf, name: e.target.value })}
              placeholder="Professor's Name"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newProf.department}
              onChange={(e) => setNewProf({ ...newProf, department: e.target.value })}
              placeholder="Department"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={newProf.research}
              onChange={(e) => setNewProf({ ...newProf, research: e.target.value })}
              placeholder="Research Interests / Proposed Projects"
              className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              <select
                value={newProf.status}
                onChange={(e) => setNewProf({ ...newProf, status: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="Reached out">Reached out</option>
                <option value="In progress">In progress</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div >
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
              <button onClick={handleAddProf} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all">Save Professor</button>
            </div >
          </div >
        </div >
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.length > 0 ? professors.map((prof) => (
          <div key={prof.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <UserSearch size={20} />
              </div >
              <button onClick={() => deleteProf(prof.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div >
            <h3 className="text-lg font-bold text-slate-900 mb-1">{prof.professor_name || 'Unknown Professor'}</h3>
            <p className="text-xs font-medium text-slate-500 mb-4">{prof.department || 'TBA Department'}</p>
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Research</p>
              <p className="text-sm text-slate-600 leading-relaxed">{prof.topic || 'No research details provided.'}</p>
            </div >
            <div className="pt-4 border-t border-slate-100">
              <select
                value={prof.status}
                onChange={(e) => updateStatus(prof.id, e.target.value)}
                className={cn(
                  "w-full text-xs font-bold px-3 py-2 rounded-lg border transition-all outline-none",
                  prof.status === 'Accepted' ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                  prof.status === 'Rejected' ? "bg-red-50 border-red-200 text-red-600" :
                  prof.status === 'In progress' ? "bg-indigo-50 border-indigo-200 text-indigo-600" :
                  "bg-slate-50 border-slate-200 text-slate-600"
                )}
              >
                <option value="Reached out">Reached out</option>
                <option value="In progress">In progress</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div >
          </div >
        )) : (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            No professors added yet. Start your outreach!
          </div >
        )}
      </div >
    </div >
  );
}
