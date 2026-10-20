import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Code2,
  Plus,
  CheckCircle2,
  Clock,
  Trophy,
  AlertCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

export default function PythonLearningPath() {
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', topics: '', deadline: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [sRes, pRes] = await Promise.all([
          supabase.from('python_skills').select('*'),
          supabase.from('python_projects').select('*')
        ]);
        if (sRes.data) setSkills(sRes.data);
        if (pRes.data) setProjects(pRes.data);
      } catch (error) {
        console.error('Error fetching Python data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const { error } = await supabase.from('python_skills').insert([{ skill_name: newSkill }]);
      if (error) throw error;
      setNewSkill('');
      setIsAddingSkill(false);
      const { data } = await supabase.from('python_skills').select('*');
      if (data) setSkills(data);
    } catch (e) {
      console.error(e);
      alert('Failed to add skill');
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name.trim()) return;
    try {
      const { error } = await supabase.from('python_projects').insert([
        {
          name: newProject.name,
          topics: newProject.topics,
          deadline: newProject.deadline,
          status: 'Yet to begin'
        }
      ]);
      if (error) throw error;
      setNewProject({ name: '', topics: '', deadline: '' });
      setIsAddingProject(false);
      const { data } = await supabase.from('python_projects').select('*');
      if (data) setProjects(data);
    } catch (e) {
      console.error(e);
      alert('Failed to add project');
    }
  };

  const updateProjectStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('python_projects').update({ status }).eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const isOverdue = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date() && projects.find(p => p.deadline === date)?.status !== 'Completed';
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
            <Terminal className="text-indigo-400" />
            Python Learning Path
          </h1>
          <p className="text-slate-500">Mastering the language of AI and Data Science</p>
        </div >
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddingSkill(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            <Plus size={16} />
            Add Mastered Skill
          </button>
          <button
            onClick={() => setIsAddingProject(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div >
      </div >

      {isAddingSkill && (
        <div className="flex gap-2 p-4 bg-slate-50 border border-indigo-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            autoFocus
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="e.g. Dictionaries, List Comprehensions..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleAddSkill} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all">Add</button>
          <button onClick={() => setIsAddingSkill(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all">Cancel</button>
        </div >
      )}

      {isAddingProject && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-indigo-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            autoFocus
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            placeholder="Project Name"
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newProject.topics}
            onChange={(e) => setNewProject({ ...newProject, topics: e.target.value })}
            placeholder="Topics Targeted"
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={newProject.deadline}
              onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleAddProject} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all">Add</button>
            <button onClick={() => setIsAddingProject(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all">Cancel</button>
          </div >
        </div >
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Code2 size={20} className="text-indigo-500" />
              Mastered Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? skills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-100">
                  {s.skill_name}
                </span>
              )) : (
                <p className="text-sm text-slate-400 italic">No skills added yet.</p>
              )}
            </div >
          </div >
        </div >

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy size={20} className="text-indigo-500" />
            Implementation Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length > 0 ? projects.map((p, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900">{p.name}</h3>
                  <select
                    value={p.status}
                    onChange={(e) => updateProjectStatus(p.id, e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Yet to begin">Yet to begin</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div >
                <p className="text-xs text-slate-500 mb-4">Topics: {p.topics}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className={cn(isOverdue(p.deadline) ? "text-red-500" : "text-slate-400")} />
                    <span className={cn("text-xs", isOverdue(p.deadline) ? "text-red-500 font-bold" : "text-slate-500")}>
                      {p.deadline || 'No deadline'}
                    </span>
                  </div >
                  {isOverdue(p.deadline) && (
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded">
                      Overdue
                    </span>
                  )}
                </div >
              </div >
            )) : (
              <div className="col-span-2 p-12 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                No projects tracked yet. Start building your portfolio!
              </div>
            )}
          </div >
        </div >
      </div >
    </div >
  );
}
