import React, { useEffect, useState } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Achievement {
  id: string;
  title: string;
  description?: string | null;
}

export default function GoalSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadAchievements() {
      const [logged, completed] = await Promise.all([
        supabase.from('career_achievements')
          .select('id, title:achievement')
          .order('date', { ascending: false })
          .order('id', { ascending: false })
          .abortSignal(controller.signal),
        supabase.from('strategic_goals')
          .select('id,title,description')
          .or('is_completed.eq.true,progress_percent.gte.100')
          .order('id')
          .abortSignal(controller.signal)
      ]);
      if (controller.signal.aborted) return;

      setAchievements(logged.data ?? []);
      setCompletedGoals(completed.data ?? []);
      setLoadError((logged.error ?? completed.error)?.message ?? '');
      setLoading(false);
    }

    void loadAchievements();
    return () => controller.abort();
  }, []);

  async function handleAddAchievement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title || saving) return;

    setSaving(true);
    setSaveError('');
    try {
      const { data, error } = await supabase.from('career_achievements')
        .insert({ achievement: title, date: new Date().toISOString().slice(0, 10) })
        .select('id, title:achievement')
        .single();
      if (error) {
        setSaveError(error.message);
        return;
      }

      setAchievements(current => [data, ...current]);
      setNewTitle('');
      setIsAddingAchievement(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unexpected error.');
    } finally {
      setSaving(false);
    }
  }

  const entries = [
    ...achievements.map(achievement => ({ ...achievement, key: `logged-${achievement.id}` })),
    ...completedGoals.map(goal => ({ ...goal, key: `goal-${goal.id}` }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <button
          type="button"
          onClick={() => setIsAddingAchievement(true)}
          disabled={loading || isAddingAchievement}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          <Plus size={16} aria-hidden="true" />
          Add New Achievement
        </button>
      </div>

      {isAddingAchievement && (
        <form onSubmit={handleAddAchievement} className="space-y-3 p-4 bg-white border border-indigo-200 rounded-2xl shadow-sm">
          <label htmlFor="achievement-title" className="block text-sm font-medium text-slate-700">Achievement title</label>
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              required
              id="achievement-title"
              type="text"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              disabled={saving}
              className="min-w-0 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" disabled={saving || !newTitle.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 disabled:opacity-50">
              {saving ? 'Saving…' : 'Add'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setIsAddingAchievement(false);
                setSaveError('');
              }}
              className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          {saveError && <p role="alert" className="text-sm text-red-700">Couldn’t save the achievement. {saveError}</p>}
        </form>
      )}

      {loadError && <p role="alert" className="text-sm text-red-700">Couldn’t load all achievements. {loadError}</p>}
      {loading && <p role="status">Loading achievements…</p>}
      {!loading && !loadError && entries.length === 0 && (
        <p className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          Log your first win when you have something to celebrate.
        </p>
      )}
      {entries.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {entries.map(entry => (
            <li key={entry.key} className="flex items-start gap-3 p-5">
              <Trophy size={20} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
              <div className="min-w-0 break-words">
                <p className="font-semibold">{entry.title}</p>
                {entry.description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
