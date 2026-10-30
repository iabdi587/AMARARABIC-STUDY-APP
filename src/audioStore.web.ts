export type Clip = { id: string; name: string; blob: Blob; start: number; end?: number };
function db(): Promise<IDBDatabase> { return new Promise((resolve,reject)=> {const r=indexedDB.open('amar-recordings',1);r.onupgradeneeded=()=>r.result.createObjectStore('clips',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function run(mode:IDBTransactionMode, action:(s:IDBObjectStore)=>IDBRequest):Promise<any>{const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('clips',mode);const r=action(tx.objectStore('clips'));tx.oncomplete=()=>{resolve(r.result);d.close();};tx.onerror=()=>{reject(tx.error);d.close();};});}
export async function listClips():Promise<Clip[]>{return run('readonly',s=>s.getAll());}
export async function saveClip(id:string, asset:any, start:number,end?:number):Promise<void>{const blob=asset.file || await (await fetch(asset.uri)).blob();await run('readwrite',s=>s.put({id,name:asset.name,blob,start,end}));}
export async function getClipUri(id:string):Promise<string|null>{const c=await run('readonly',s=>s.get(id));return c?URL.createObjectURL(c.blob):null;}
export async function removeClip(id:string){await run('readwrite',s=>s.delete(id));}
