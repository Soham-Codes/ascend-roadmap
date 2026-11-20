import React, { useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import App from '../App';

type Access = 'checking' | 'signed-out' | 'denied' | 'allowed';

export default function OwnerAccess() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [approvedUserId, setApprovedUserId] = useState<string | null>(null);
  const [access, setAccess] = useState<Access>('checking');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId === undefined) return;
    setApprovedUserId(null);
    if (userId === null) {
      setAccess('signed-out');
      return;
    }

    setAccess('checking');
    const controller = new AbortController();
    async function checkOwner() {
      const { data, error } = await supabase.rpc('is_roadmap_owner').abortSignal(controller.signal);
      if (controller.signal.aborted) return;
      if (data === true && !error) {
        setApprovedUserId(userId ?? null);
        setAccess('allowed');
      } else {
        setError(error ? 'Couldn’t verify roadmap access. Check the Supabase owner setup or try again.' : 'This account does not have access.');
        setAccess('denied');
      }
    }

    void checkOwner();
    return () => controller.abort();
  }, [userId]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: String(values.get('email')).trim(),
        password: String(values.get('password'))
      });
      if (error) setError('Couldn’t sign in. Check your email and password and try again.');
      else form.reset();
    } catch {
      setError('Couldn’t reach Supabase. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError('');
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) setError('Couldn’t sign out. Try again.');
    } catch {
      setError('Couldn’t sign out. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (access === 'allowed' && userId && approvedUserId === userId) {
    return <App onSignOut={signOut} signingOut={busy} signOutError={error} />;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-900">
      <section className="w-full max-w-sm space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <LockKeyhole className="text-indigo-600" size={24} aria-hidden="true" />
        <h1 className="text-2xl font-bold">Sign in to Ascend</h1>
        {access === 'signed-out' ? (
          <form onSubmit={signIn} className="space-y-4">
            <label className="block space-y-1 text-sm font-medium">
              <span>Email</span>
              <input required type="email" name="email" autoComplete="username" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="block space-y-1 text-sm font-medium">
              <span>Password</span>
              <input required type="password" name="password" autoComplete="current-password" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <button disabled={busy} className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : access === 'denied' ? (
          <button type="button" onClick={signOut} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            Sign out
          </button>
        ) : (
          <p role="status" className="text-sm text-slate-600">Checking access…</p>
        )}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </section>
    </main>
  );
}
