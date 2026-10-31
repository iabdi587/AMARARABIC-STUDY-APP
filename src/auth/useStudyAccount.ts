import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { allWords } from '../course';
import { supabase } from './supabase';
import { cacheKey, ProgressEngine, type Field, type Snapshot } from '../progress/engine';
import { progressRemote } from '../progress/remote';

const initial: Snapshot = { known: [], saved: [], status: 'guest', pending: 0 };
export function useStudyAccount() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [ready, setReady] = useState(false);
  const [loadedScope, setLoadedScope] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot>(initial);
  const [error, setError] = useState('');
  const engine = useRef<ProgressEngine | null>(null);
  const initialization = useRef<Promise<unknown>>(Promise.resolve());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let alive = true; let eventReceived = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
      eventReceived = true;
      if (alive) { setSession(current); setAuthReady(true); }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      if (error) setError('Could not restore your session. You can continue as a guest.');
      if (!eventReceived) setSession(data.session);
      setAuthReady(true);
    }).catch(() => { if (alive) { setError('Could not restore your session. Please sign in again.'); setAuthReady(true); } });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    let alive = true;
    setReady(false); setError('');
    const current = new ProgressEngine(AsyncStorage, new Set(allWords.map(w => w.id)), session?.user.id,
      session ? progressRemote(session.user.id) : undefined,
      next => { if (alive) setSnapshot(next); });
    engine.current = current;
    // Serialize account transitions so an old guest migration cannot race the next login.
    initialization.current = initialization.current.catch(() => {}).then(async () => {
      if (!alive) return;
      try { await current.initialize(); }
      catch { if (alive) setError('Could not read or save progress on this device. Please check available storage.'); }
      finally { if (alive) { setLoadedScope(session?.user.id || 'guest'); setReady(true); } }
      if (alive) void current.sync();
    });
    return () => { alive = false; initialization.current = Promise.all([initialization.current.catch(() => {}), current.stop()]).then(() => {}); if (timer.current) clearTimeout(timer.current); };
  }, [authReady, session?.user.id]);

  useEffect(() => {
    const retry = () => { if (engine.current) void engine.current.sync(); };
    const app = AppState.addEventListener('change', state => {
      if (state === 'active') { if (Platform.OS !== 'web') supabase?.auth.startAutoRefresh(); retry(); }
      else if (Platform.OS !== 'web') supabase?.auth.stopAutoRefresh();
    });
    const interval = setInterval(retry, 30000);
    if (Platform.OS === 'web') { window.addEventListener('online', retry); window.addEventListener('focus', retry); }
    return () => {
      app.remove(); clearInterval(interval);
      if (Platform.OS === 'web') { window.removeEventListener('online', retry); window.removeEventListener('focus', retry); }
    };
  }, []);

  const toggle = useCallback(async (id: string, field: Field) => {
    try {
      await engine.current?.toggle(id, field);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => { void engine.current?.sync(); }, 400);
    } catch { setError('Your change could not be saved on this device. Please check available storage.'); }
  }, []);
  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  };
  const deleteAccount = async () => {
    if (!supabase || !session) return;
    const { error } = await supabase.rpc('delete_my_account');
    if (error) throw error;
    await engine.current?.stop();
    try { await AsyncStorage.removeItem(cacheKey(session.user.id)); }
    finally { await supabase.auth.signOut({ scope: 'local' }); }
  };
  return { ...snapshot, ready: ready && loadedScope === (session?.user.id || 'guest'), session, error, clearError: () => setError(''), toggle, signOut, deleteAccount, retrySync: () => engine.current?.sync() };
}
