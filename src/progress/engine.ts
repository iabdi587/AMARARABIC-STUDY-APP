export type Field = 'learned' | 'saved';
export type Flags = { learned?: boolean; saved?: boolean };
export type Operation = { wordId: string; field: Field; value: boolean; revision: number };
export type Data = { flags: Record<string, Flags>; pending: Record<string, Operation> };
export type Remote = { read(): Promise<Record<string, Flags>>; write(operation: Operation): Promise<void> };
export type Storage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
export type SyncStatus = 'guest' | 'syncing' | 'synced' | 'offline';
export type Snapshot = { known: string[]; saved: string[]; status: SyncStatus; pending: number };
const empty = (): Data => ({ flags: {}, pending: {} });
export const cacheKey = (userId?: string) => `amar-progress-v2:${userId || 'guest'}`;
const operationKey = (wordId: string, field: Field) => JSON.stringify([wordId, field]);

/** Local writes never wait for the network. Account-specific caches retain offline edits. */
export class ProgressEngine {
  private data: Data = empty();
  private status: SyncStatus;
  private revision = 0;
  private stopped = false;
  private localQueue: Promise<unknown> = Promise.resolve();
  private syncing: Promise<void> | null = null;
  constructor(private storage: Storage, private validIds: Set<string>, private userId?: string, private remote?: Remote, private changed: (s: Snapshot) => void = () => {}) {
    this.status = userId ? 'syncing' : 'guest';
  }
  private serial<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.localQueue.then(fn);
    this.localQueue = result.catch(() => {});
    return result;
  }
  private clean(input: unknown): Data {
    const out = empty();
    const data = input as Partial<Data> | null;
    for (const [id, value] of Object.entries(data?.flags || {})) {
      if (!this.validIds.has(id) || !value) continue;
      out.flags[id] = {};
      if (typeof value.learned === 'boolean') out.flags[id].learned = value.learned;
      if (typeof value.saved === 'boolean') out.flags[id].saved = value.saved;
    }
    for (const op of Object.values(data?.pending || {})) {
      if (this.validIds.has(op.wordId) && ['learned', 'saved'].includes(op.field) && typeof op.value === 'boolean') {
        out.pending[operationKey(op.wordId, op.field)] = op;
        out.flags[op.wordId] = { ...out.flags[op.wordId], [op.field]: op.value };
        this.revision = Math.max(this.revision, op.revision || 0);
      }
    }
    return out;
  }
  private async readGuest() {
    const raw = await this.storage.getItem(cacheKey());
    if (raw) return this.clean(JSON.parse(raw));
    const legacy = JSON.parse(await this.storage.getItem('amar-study-v1') || '{}');
    const data = empty();
    for (const [field, list] of [['learned', legacy.known], ['saved', legacy.saved]] as const) {
      if (Array.isArray(list)) for (const id of list) if (this.validIds.has(id)) data.flags[id] = { ...data.flags[id], [field]: true };
    }
    return data;
  }
  async initialize() {
    await this.serial(async () => {
      if (this.userId) {
        this.data = this.clean(JSON.parse(await this.storage.getItem(cacheKey(this.userId)) || 'null'));
        // A guest's progress is claimed once, never copied into the next account on a shared device.
        const guest = await this.readGuest();
        for (const [id, flags] of Object.entries(guest.flags)) for (const field of ['learned', 'saved'] as const) {
          if (flags[field] && this.data.flags[id]?.[field] !== true) this.apply(id, field, true);
        }
        await this.persist();
        await this.storage.setItem(cacheKey(), JSON.stringify(empty()));
        await this.storage.removeItem('amar-study-v1');
      } else {
        this.data = await this.readGuest();
        await this.persist();
      }
      this.emit();
    });
  }
  private apply(wordId: string, field: Field, value: boolean) {
    this.data.flags[wordId] = { ...this.data.flags[wordId], [field]: value };
    if (this.userId) this.data.pending[operationKey(wordId, field)] = { wordId, field, value, revision: ++this.revision };
  }
  async toggle(wordId: string, field: Field) {
    if (this.stopped || !this.validIds.has(wordId)) return;
    await this.serial(async () => {
      this.apply(wordId, field, !this.data.flags[wordId]?.[field]);
      await this.persist();
      if (this.userId) this.status = 'syncing';
      this.emit();
    });
  }
  private persist() { return this.storage.setItem(cacheKey(this.userId), JSON.stringify(this.data)); }
  snapshot(): Snapshot {
    return {
      known: Object.keys(this.data.flags).filter(id => this.data.flags[id].learned),
      saved: Object.keys(this.data.flags).filter(id => this.data.flags[id].saved),
      status: this.status,
      pending: Object.keys(this.data.pending).length,
    };
  }
  private emit() { if (!this.stopped) this.changed(this.snapshot()); }
  stop(): Promise<unknown> { this.stopped = true; return this.localQueue; }
  sync(): Promise<void> {
    if (this.stopped || !this.remote) return Promise.resolve();
    if (this.syncing) return this.syncing;
    this.syncing = this.performSync().finally(() => { this.syncing = null; });
    return this.syncing;
  }
  private async performSync() {
    this.status = 'syncing'; this.emit();
    try {
      // Drain per-field operations. A newer local edit cannot be removed by an older response.
      while (!this.stopped) {
        await this.localQueue;
        const entry = Object.entries(this.data.pending)[0];
        if (!entry) break;
        const [key, operation] = entry;
        await this.remote!.write(operation);
        await this.serial(async () => {
          if (this.stopped) return;
          if (this.data.pending[key]?.revision === operation.revision) delete this.data.pending[key];
          await this.persist();
        });
      }
      if (this.stopped) return;
      const remote = await this.remote!.read();
      await this.serial(async () => {
        if (this.stopped) return;
        this.data.flags = this.clean({ flags: remote }).flags;
        for (const op of Object.values(this.data.pending)) this.data.flags[op.wordId] = { ...this.data.flags[op.wordId], [op.field]: op.value };
        await this.persist();
        this.status = Object.keys(this.data.pending).length ? 'syncing' : 'synced';
        this.emit();
      });
    } catch {
      if (!this.stopped) { this.status = 'offline'; this.emit(); }
    }
  }
}
