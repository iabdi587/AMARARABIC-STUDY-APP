import AsyncStorage from '@react-native-async-storage/async-storage';
import {Directory,File,Paths} from 'expo-file-system';
export type Clip={id:string;name:string;fileName:string;start:number;end?:number};
const key='amar-clips-v1';
export async function listClips():Promise<Clip[]>{return JSON.parse(await AsyncStorage.getItem(key)||'[]');}
const folder=()=>new Directory(Paths.document,'amar-audio');
export async function saveClip(id:string,asset:any,start:number,end?:number){const dir=folder();dir.create({idempotent:true,intermediates:true});const fileName=`${Date.now()}-${asset.name.replace(/[^a-zA-Z0-9.]/g,'_')}`;new File(asset.uri).copy(new File(dir,fileName));const clips=await listClips();const old=clips.find(c=>c.id===id);await AsyncStorage.setItem(key,JSON.stringify([...clips.filter(c=>c.id!==id),{id,name:asset.name,fileName,start,end}]));if(old){try{new File(dir,old.fileName).delete();}catch{}}}
export async function getClipUri(id:string){const c=(await listClips()).find(c=>c.id===id);return c?new File(folder(),c.fileName).uri:null;}
export async function removeClip(id:string){const clips=await listClips();const c=clips.find(c=>c.id===id);await AsyncStorage.setItem(key,JSON.stringify(clips.filter(c=>c.id!==id)));if(c){try{new File(folder(),c.fileName).delete();}catch{}}}
