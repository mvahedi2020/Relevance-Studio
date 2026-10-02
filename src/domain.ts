export const goals = ['data', 'story', 'discovery'] as const
export type Goal = typeof goals[number]
export type Policy = 'goal' | 'explore'
export type Course = { id: string; title: string; description: string; level: 1 | 2; minutes: number; requires: string[]; fit: Record<Goal, number>; curiosity: number }
export const catalog: Course[] = [
 {id:'foundations',title:'Read a small dataset',description:'Find patterns without losing the context behind a number.',level:1,minutes:30,requires:[],fit:{data:3,story:1,discovery:2},curiosity:1},
 {id:'charts',title:'Choose a chart with care',description:'Match a visual form to the question you need to answer.',level:2,minutes:60,requires:['foundations'],fit:{data:3,story:3,discovery:1},curiosity:2},
 {id:'story',title:'Tell the story behind a number',description:'Turn one finding into a clear, qualified explanation.',level:1,minutes:30,requires:[],fit:{data:2,story:3,discovery:1},curiosity:4},
 {id:'questions',title:'Ask a better learning question',description:'Frame a question before you reach for a tool.',level:1,minutes:45,requires:[],fit:{data:2,story:1,discovery:3},curiosity:3},
 {id:'ethics',title:'Notice what the data leaves out',description:'Explore missing perspectives and responsible interpretation.',level:1,minutes:60,requires:[],fit:{data:1,story:2,discovery:3},curiosity:5},
 {id:'experiment',title:'Design a tiny experiment',description:'Separate a hypothesis from a promising observation.',level:2,minutes:90,requires:['foundations'],fit:{data:3,story:1,discovery:3},curiosity:2},
 {id:'outline',title:'Sketch an idea before building',description:'Make a rough concept tangible with a simple outline.',level:1,minutes:20,requires:[],fit:{data:0,story:2,discovery:3},curiosity:4},
 {id:'synthesis',title:'Connect several sources',description:'Compare evidence and keep contradictions visible.',level:2,minutes:120,requires:['foundations'],fit:{data:2,story:3,discovery:2},curiosity:3},
]
export type Preferences = { goal: Goal; maxMinutes: number; maxLevel: 1 | 2; completed: string[] }
export type State = { version: 1; revision: number; ready: boolean; preferences: Preferences; hidden: string[]; policy: Policy }
export const fresh = (): State => ({version:1,revision:0,ready:false,preferences:{goal:'data',maxMinutes:60,maxLevel:1,completed:[]},hidden:[],policy:'goal'})
export function reasons(c: Course, p: Preferences, hidden: string[] = []): string[] {
 return [c.minutes > p.maxMinutes ? `Needs ${c.minutes} minutes; your limit is ${p.maxMinutes}.` : '',c.level > p.maxLevel ? 'Above your selected level.' : '',...c.requires.filter(id=>!p.completed.includes(id)).map(id=>`Requires ${catalog.find(x=>x.id===id)!.title}.`),p.completed.includes(c.id) ? 'Already completed.' : '',hidden.includes(c.id) ? 'Hidden by your not-for-me feedback.' : ''].filter(Boolean)
}
export const score = (c: Course,p: Preferences,policy: Policy) => policy==='goal' ? c.fit[p.goal]*10 : c.curiosity*10+c.fit[p.goal]
export function rank(p: Preferences,hidden: string[],policy: Policy): Course[] {
 return catalog.filter(c=>reasons(c,p,hidden).length===0).sort((a,b)=>score(b,p,policy)-score(a,p,policy)||a.minutes-b.minutes||a.id.localeCompare(b.id))
}
const keys = (v: object,w: string[]) => Object.keys(v).sort().join('|')===w.sort().join('|')
const uniqueIDs = (v: unknown): v is string[] => Array.isArray(v)&&v.every(id=>typeof id==='string'&&catalog.some(c=>c.id===id))&&new Set(v).size===v.length
export function validPreferences(v: unknown): v is Preferences {
 if (!v||typeof v!=='object'||!keys(v,['goal','maxMinutes','maxLevel','completed'])) return false
 const p=v as Preferences
 return goals.includes(p.goal)&&[20,30,60,90,120].includes(p.maxMinutes)&&[1,2].includes(p.maxLevel)&&uniqueIDs(p.completed)&&p.completed.every(id=>catalog.find(c=>c.id===id)!.requires.every(req=>p.completed.includes(req)))
}
export function parse(raw: string | null): State | null {
 if(raw===null) return fresh()
 try {const s=JSON.parse(raw) as State
 if(!s||typeof s!=='object'||!keys(s,['version','revision','ready','preferences','hidden','policy'])||s.version!==1||!Number.isSafeInteger(s.revision)||s.revision<0||typeof s.ready!=='boolean'||!validPreferences(s.preferences)||!uniqueIDs(s.hidden)||!['goal','explore'].includes(s.policy)||s.hidden.some(id=>s.preferences.completed.includes(id))) return null
 if(!s.ready&&(s.hidden.length>0||JSON.stringify(s.preferences)!==JSON.stringify(fresh().preferences)||s.policy!=='goal')) return null
 return s
 } catch {return null}
}
export const KEY='northstar-relevance-v1'
export type Read = {raw: string|null; state: State|null; unavailable: boolean}
export function read(): Read {try {const raw=window.localStorage.getItem(KEY);return {raw,state:parse(raw),unavailable:false}}catch{return {raw:null,state:null,unavailable:true}}}
export function write(s: State): boolean {try {window.localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}}
// Original author-assigned judgments for this one frozen persona, not learner research.
export const judgments: Record<string,'useful'|'neutral'|'rejected'> = {foundations:'useful',charts:'useful',story:'useful',questions:'useful',ethics:'neutral',experiment:'useful',outline:'rejected',synthesis:'neutral'}
export const fixture: Preferences = {goal:'data',maxMinutes:60,maxLevel:1,completed:[]}
export function quality(policy: Policy) {const eligible=rank(fixture,[],policy);const shown=eligible.slice(0,3);const useful=shown.filter(c=>judgments[c.id]==='useful').length;return {eligible,shown,useful,totalUseful:eligible.filter(c=>judgments[c.id]==='useful').length,rejected:shown.filter(c=>judgments[c.id]==='rejected').length}}
