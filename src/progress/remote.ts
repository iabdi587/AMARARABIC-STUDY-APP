import { supabase } from '../auth/supabase';
import type { Flags, Remote } from './engine';
export function progressRemote(userId: string): Remote {
  return {
    async read() {
      const { data, error } = await supabase!.from('word_progress').select('word_id,learned,saved').eq('user_id', userId);
      if (error) throw error;
      return Object.fromEntries((data || []).map(row => [row.word_id, { learned: row.learned, saved: row.saved } as Flags]));
    },
    async write(op) {
      // The RPC verifies the owner too: an old queued edit cannot cross into a different signed-in account.
      const { error } = await supabase!.rpc('set_word_progress', { p_user_id: userId, p_word_id: op.wordId, p_field: op.field, p_value: op.value });
      if (error) throw error;
    },
  };
}
