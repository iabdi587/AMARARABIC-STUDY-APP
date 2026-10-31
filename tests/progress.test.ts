import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ProgressEngine, cacheKey, type Storage, type Remote, type Flags } from '../src/progress/engine';
const ids = new Set(['head', 'hair']);
class MemoryStorage implements Storage {
  values = new Map<string, string>();
  async getItem(key: string) { return this.values.get(key) ?? null; }
  async setItem(key: string, value: string) { this.values.set(key, value); }
  async removeItem(key: string) { this.values.delete(key); }
}
function backend() {
  let offline = false;
  const flags: Record<string, Flags> = {};
  const remote: Remote = {
    async read() { if (offline) throw new Error('offline'); return structuredClone(flags); },
    async write(op) { if (offline) throw new Error('offline'); flags[op.wordId] = { ...flags[op.wordId], [op.field]: op.value }; },
  };
  return { remote, flags, setOffline(value: boolean) { offline = value; } };
}
test('legacy guest progress survives and is imported once into the first account', async () => {
  const storage = new MemoryStorage(); const cloud = backend();
  await storage.setItem('amar-study-v1', JSON.stringify({ known: ['head', 'unknown'], saved: ['hair'] }));
  const guest = new ProgressEngine(storage, ids); await guest.initialize();
  assert.deepEqual(guest.snapshot().known, ['head']); guest.stop();
  const first = new ProgressEngine(storage, ids, 'first-user', cloud.remote); await first.initialize(); await first.sync();
  assert.equal(cloud.flags.head.learned, true); assert.equal(cloud.flags.hair.saved, true); first.stop();
  const second = new ProgressEngine(storage, ids, 'second-user', backend().remote); await second.initialize();
  assert.deepEqual(second.snapshot().known, []); assert.deepEqual(second.snapshot().saved, []);
  assert.equal(await storage.getItem('amar-study-v1'), null);
});
test('an offline edit survives restart and syncs after reconnecting', async () => {
  const storage = new MemoryStorage(); const cloud = backend(); cloud.setOffline(true);
  const first = new ProgressEngine(storage, ids, 'user', cloud.remote); await first.initialize(); await first.toggle('head', 'learned'); await first.sync();
  assert.equal(first.snapshot().status, 'offline'); assert.equal(first.snapshot().pending, 1); first.stop();
  cloud.setOffline(false);
  const next = new ProgressEngine(storage, ids, 'user', cloud.remote); await next.initialize(); await next.sync();
  assert.equal(cloud.flags.head.learned, true); assert.equal(next.snapshot().pending, 0); assert.equal(next.snapshot().status, 'synced');
});
test('two devices preserve independent learned and bookmarked changes', async () => {
  const cloud = backend(); const a = new ProgressEngine(new MemoryStorage(), ids, 'user', cloud.remote); const b = new ProgressEngine(new MemoryStorage(), ids, 'user', cloud.remote);
  await a.initialize(); await b.initialize(); await a.toggle('head', 'learned'); await b.toggle('head', 'saved'); await a.sync(); await b.sync(); await a.sync();
  assert.deepEqual(a.snapshot().known, ['head']); assert.deepEqual(a.snapshot().saved, ['head']);
  await b.toggle('head', 'learned'); await b.sync(); await a.sync();
  assert.deepEqual(a.snapshot().known, []); assert.deepEqual(a.snapshot().saved, ['head']);
});
test('a newer local edit is retained while an older network write is in flight', async () => {
  const cloud = backend(); let release!: () => void; let began!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; }); const started = new Promise<void>(resolve => { began = resolve; }); let first = true;
  const remote: Remote = { read: cloud.remote.read, async write(op) { if (first) { first = false; began(); await held; } await cloud.remote.write(op); } };
  const engine = new ProgressEngine(new MemoryStorage(), ids, 'user', remote); await engine.initialize(); await engine.toggle('head', 'learned'); const syncing = engine.sync(); await started;
  await engine.toggle('head', 'learned'); assert.deepEqual(engine.snapshot().known, []); release(); await syncing;
  assert.equal(cloud.flags.head.learned, false); assert.equal(engine.snapshot().pending, 0);
});
test('a pending edit during a remote read is not replaced by stale cloud state', async () => {
  let release!: () => void; let began!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; }); const started = new Promise<void>(resolve => { began = resolve; });
  const engine = new ProgressEngine(new MemoryStorage(), ids, 'user', { async read() { began(); await held; return {}; }, async write() {} });
  await engine.initialize(); const syncing = engine.sync(); await started; await engine.toggle('hair', 'saved'); release(); await syncing;
  assert.deepEqual(engine.snapshot().saved, ['hair']); assert.equal(engine.snapshot().pending, 1);
});
test('signing out keeps account progress away from the guest and next account', async () => {
  const storage = new MemoryStorage(); const first = new ProgressEngine(storage, ids, 'first', backend().remote); await first.initialize(); await first.toggle('head', 'saved'); first.stop();
  const guest = new ProgressEngine(storage, ids); await guest.initialize(); assert.deepEqual(guest.snapshot().saved, []); guest.stop();
  const second = new ProgressEngine(storage, ids, 'second', backend().remote); await second.initialize(); assert.deepEqual(second.snapshot().saved, []); second.stop();
  const restored = new ProgressEngine(storage, ids, 'first', backend().remote); await restored.initialize(); assert.deepEqual(restored.snapshot().saved, ['head']);
});
test('stopped engines do not send another account’s pending changes', async () => {
  let writes = 0; const engine = new ProgressEngine(new MemoryStorage(), ids, 'user', { async read() { return {}; }, async write() { writes++; } });
  await engine.initialize(); await engine.toggle('head', 'learned'); engine.stop(); await engine.sync(); assert.equal(writes, 0);
});
test('unknown word IDs are never persisted or uploaded', async () => {
  const storage = new MemoryStorage(); const engine = new ProgressEngine(storage, ids); await engine.initialize(); await engine.toggle('not-in-course', 'learned'); assert.deepEqual(engine.snapshot().known, []);
  assert.deepEqual(JSON.parse((await storage.getItem(cacheKey()))!).flags, {});
});
