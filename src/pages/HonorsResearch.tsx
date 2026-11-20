import React, { useState, useEffect } from 'react';
import {
  Microscope,
  Plus,
  UserSearch,
  Pencil,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

const outreachStatuses = ['Reached out', 'In progress', 'Accepted', 'Rejected'];
const emptyProfessor = { name: '', research: '', department: '', status: outreachStatuses[0] };

interface Professor {
  id: string;
  professor_name: string | null;
  topic: string | null;
  department: string | null;
  status: string | null;
}

function statusOptions(status: string) {
  const options = outreachStatuses.includes(status) ? outreachStatuses : [status, ...outreachStatuses];
  return options.map(option => <option key={option} value={option}>{option}</option>);
}

export default function HonorsResearch() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ id: string | null; fields: typeof emptyProfessor } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pendingProfessorId, setPendingProfessorId] = useState<string | null>(null);

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

  const openForm = (professor?: Professor) => {
    setSaveError('');
    setForm(professor ? {
      id: professor.id,
      fields: {
        name: professor.professor_name ?? '',
        department: professor.department ?? '',
        research: professor.topic ?? '',
        status: professor.status ?? emptyProfessor.status
      }
    } : { id: null, fields: emptyProfessor });
  };

  const changeField = (field: keyof typeof emptyProfessor, value: string) => {
    setForm(current => current && { ...current, fields: { ...current.fields, [field]: value } });
  };

  const saveProfessor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !form.fields.name.trim() || saving) return;
    const { id, fields } = form;
    const values = {
      professor_name: fields.name.trim(),
      department: fields.department.trim(),
      topic: fields.research.trim(),
      status: fields.status
    };
    setSaving(true);
    setSaveError('');
    try {
      const table = supabase.from('research_entries');
      const query = id === null ? table.insert(values) : table.update(values).eq('id', id);
      const { data, error } = await query.select('id,professor_name,department,topic,status').single();
      if (error) {
        setSaveError(error.message);
        return;
      }
      setProfessors(current => id === null ? [...current, data] : current.map(p => p.id === id ? data : p));
      setForm(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unexpected error.');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setPendingProfessorId(id);
    try {
      const { data, error } = await supabase.from('research_entries')
        .update({ status }).eq('id', id).select('status').single();
      if (error) throw error;
      setProfessors(prev => prev.map(p => p.id === id ? { ...p, status: data.status } : p));
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    } finally {
      setPendingProfessorId(null);
    }
  };

  const deleteProf = async (id: string) => {
    setPendingProfessorId(id);
    try {
      const { error } = await supabase.from('research_entries').delete().eq('id', id).select('id').single();
      if (error) throw error;
      setProfessors(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete professor');
    } finally {
      setPendingProfessorId(null);
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
          onClick={() => openForm()}
          disabled={form !== null}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          <Plus size={16} />
          Add Professor
        </button>
      </div >

      {form && (
        <form onSubmit={saveProfessor} className="p-6 bg-white border border-indigo-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <h2 className="mb-4 font-bold text-slate-900">{form.id === null ? 'Add Professor' : 'Edit Professor'}</h2>
          <fieldset disabled={saving} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              autoFocus
              required
              type="text"
              value={form.fields.name}
              aria-label="Professor's Name"
              onChange={event => changeField('name', event.target.value)}
              placeholder="Professor's Name"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={form.fields.department}
              aria-label="Department"
              onChange={event => changeField('department', event.target.value)}
              placeholder="Department"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={form.fields.research}
              aria-label="Research Interests / Proposed Projects"
              onChange={event => changeField('research', event.target.value)}
              placeholder="Research Interests / Proposed Projects"
              className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              <select
                value={form.fields.status}
                aria-label="Outreach status"
                onChange={event => changeField('status', event.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
              >
                {statusOptions(form.fields.status)}
              </select>
            </div >
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
              <button type="submit" disabled={!form.fields.name.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all disabled:opacity-50">{saving ? 'Saving…' : 'Save Professor'}</button>
            </div >
          </fieldset>
          {saveError && <p role="alert" className="mt-3 text-sm text-red-700">Couldn’t save the professor. {saveError}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.length > 0 ? professors.map((prof) => (
          <div key={prof.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <UserSearch size={20} />
              </div >
              <div className="flex gap-2">
                <button type="button" onClick={() => openForm(prof)} disabled={form !== null || pendingProfessorId === prof.id} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50">
                  <Pencil size={14} aria-hidden="true" />
                  Edit
                </button>
                <button type="button" onClick={() => deleteProf(prof.id)} disabled={form?.id === prof.id || pendingProfessorId !== null} aria-label={`Delete ${prof.professor_name ?? 'professor'}`} className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-50">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div >
            <h3 className="text-lg font-bold text-slate-900 mb-1">{prof.professor_name || 'Unknown Professor'}</h3>
            <p className="text-xs font-medium text-slate-500 mb-4">{prof.department || 'TBA Department'}</p>
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Research</p>
              <p className="text-sm text-slate-600 leading-relaxed">{prof.topic || 'No research details provided.'}</p>
            </div >
            <div className="pt-4 border-t border-slate-100">
              <select
                value={prof.status ?? emptyProfessor.status}
                disabled={form?.id === prof.id || pendingProfessorId !== null}
                aria-label={`Outreach status for ${prof.professor_name ?? 'professor'}`}
                onChange={(e) => updateStatus(prof.id, e.target.value)}
                className={cn(
                  "w-full text-xs font-bold px-3 py-2 rounded-lg border transition-all outline-none",
                  prof.status === 'Accepted' ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                  prof.status === 'Rejected' ? "bg-red-50 border-red-200 text-red-600" :
                  prof.status === 'In progress' ? "bg-indigo-50 border-indigo-200 text-indigo-600" :
                  "bg-slate-50 border-slate-200 text-slate-600"
                )}
              >
                {statusOptions(prof.status ?? emptyProfessor.status)}
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
