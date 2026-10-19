import React, { useState, useEffect } from 'react';
import {
  Code,
  Trophy,
  BookOpen,
  GitBranch,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';

export default function TechnicalSkills() {
  const [activeTab, setActiveTab] = useState<'skills' | 'projects'>('skills');
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: sData } = await supabase.from('technical_skills').select('*');
        const { data: pData } = await supabase.from('coding_projects').select('*');
        if (sData) setSkills(sData);
        if (pData) setProjects(pData);
      } catch (error) {
        console.error('Error fetching skills data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
            <Code className="text-indigo-400" />
            Technical Skills Tracker
          </h1>
          <p className="text-slate-400">Independent learning and engineering proficiency</p>
        </div >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors">
            <Plus size={16} />
            Add Skill
          </button>
        </div >
      </div >

      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('skills')}
          className={cn(
            "px-6 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === 'skills' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          )}
        >
          Proficiency Matrix
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={cn(
            "px-6 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === 'projects' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          )}
        >
          Learning Projects
        </button>
      </div >

      {activeTab === 'skills' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.length > 0 ? skills.map((skill, idx) => (
              <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm group-hover:text-indigo-300 transition-colors">{skill.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        skill.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400" :
                        skill.status === 'In Progress' ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-700 text-slate-400"
                      )}>{skill.status}</span>
                      <span className="text-[10px] text-slate-500">{skill.practice_hours || 0} hours invested</span>
                    </div >
                  </div >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={cn(
                          "transition-colors",
                          i < (skill.proficiency || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                        )}
                      />
                    ))}
                  </div >
                </div >
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen size={12} />
                    <span className="text-[10px]">{skill.learning_resources ? JSON.stringify(skill.learning_resources) : 'No resources linked'}</span>
                  </div >
                  <button className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-600 hover:text-indigo-400">
                    <ChevronRight size={14} />
                  </button>
                </div >
              </div >
            )) : (
              <div className="col-span-2 p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                No skills tracked yet. Start adding your technical proficiency!
              </div >
            )}
          </div >

          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target size={20} className="text-indigo-400" />
                Learning Goals
              </h3>
              <div className="space-y-4">
                {[
                  { goal: 'Reach Level 4 in Pandas', progress: 60, priority: 'High' },
                  { goal: 'Complete AI Engineering Basics', progress: 10, priority: 'Medium' },
                  { goal: 'Master SQL Window Functions', progress: 0, priority: 'High' },
                ].map((g, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">{g.goal}</span>
                      <span className="text-indigo-400 font-bold">{g.progress}%</span>
                    </div >
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${g.progress}%` }} />
                    </div >
                  </div >
                ))}
              </div >
            </div >

            <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Daily Tip</h3>
              <p className="text-sm leading-relaxed">
                "Don't just follow tutorials. Try to break the code, then figure out why it broke. That's where the real learning happens."
              </p>
            </div >
          </div >
        </div >
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.length > 0 ? projects.map((project, idx) => (
            <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all group shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <GitBranch size={20} />
                  </div >
                  <h3 className="text-lg font-bold group-hover:text-indigo-300 transition-colors">{project.name}</h3>
                </div >
                <span className={cn(
                  "text-xs px-2 py-1 rounded-lg font-medium",
                  project.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                )}>{project.status}</span>
              </div >
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills?.map((skill: string) => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div >
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Implementation Progress</span>
                  <span className="text-indigo-400 font-bold">{project.progress_percent}%</span>
                </div >
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${project.progress_percent}%` }} />
                </div >
              </div >
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 size={12} />
                  Key Lesson
                </h4>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{project.lessons_learned}"</p>
              </div >
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  <ExternalLink size={14} />
                  View GitHub
                </button>
                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-600 hover:text-indigo-400 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div >
            </div >
          )) : (
            <div className="col-span-2 p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              No projects tracked yet. Time to start building!
            </div >
          )}
          <button className="p-6 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-indigo-400 hover:border-indigo-500/50 transition-all group">
            <div className="p-3 bg-slate-800 rounded-full group-hover:bg-indigo-500/10 transition-colors">
              <Plus size={24} />
            </div >
            <p className="text-sm font-medium">Start New Project</p>
          </button>
        </div >
      )}
    </div >
  );
}
