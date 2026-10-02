import { describe, it, expect } from 'vitest'
import { catalog, fixture, fresh, parse, quality, rank, reasons, validPreferences } from './domain'
// Independent hand calculation: data eligible IDs are foundations(3,1), story(2,4),
// questions(2,3), ethics(1,5). Goal scores 30/20/20/10, tie 30min before 45min.
// Exploration scores 13/42/32/51. Top3 goal F/S/Q; exploration E/S/Q.
// Useful judgments F/S/Q => goal 3/3, exploration 2/3; rejected outline is excluded.
describe('eligibility and traceable deterministic policies',()=>{
 it('uses declared duration level prerequisites and positive fit',()=>{expect(rank(fixture,[],'goal').map(c=>c.id)).toEqual(['foundations','story','questions','ethics'])})
 it('produces independently calculated exploration order',()=>{expect(rank(fixture,[],'explore').map(c=>c.id)).toEqual(['ethics','story','questions','foundations'])})
 it('does not insert a zero-fit fallback at twenty minutes',()=>{expect(rank({...fixture,maxMinutes:20},[],'goal')).toEqual([]);expect(rank({...fixture,maxMinutes:20},[],'explore')).toEqual([])})
 it('shows concrete catalog rejection reasons',()=>{expect(reasons(catalog[1],fixture)).toEqual(['Above your selected level.','Requires Read a small dataset.'])})
 it('respects all hidden courses without training',()=>{expect(rank(fixture,['foundations','story','questions','ethics'],'goal')).toEqual([])})
 it('completion unlocks applied prerequisites and excludes completed course',()=>{expect(rank({...fixture,maxLevel:2,completed:['foundations']},[],'goal').map(c=>c.id)).toEqual(['charts','story','questions','ethics'])})
 it('recomputes goal fixture numerators and denominators',()=>{const q=quality('goal');expect([q.useful,q.totalUseful,q.shown.length,q.eligible.length,q.rejected]).toEqual([3,3,3,4,0])})
 it('recomputes exploration fixture without relabeling judgments',()=>{const q=quality('explore');expect([q.useful,q.totalUseful,q.shown.length,q.eligible.length,q.rejected]).toEqual([2,3,3,4,0])})
})
describe('strict saved state contract',()=>{
 it('accepts absent storage and compatible state',()=>{expect(parse(null)).toEqual(fresh());expect(parse(JSON.stringify(fresh()))).toEqual(fresh())})
 it.each(['{','null','[]','{"version":2}','"<script>"'])('rejects invalid data %s',raw=>expect(parse(raw)).toBeNull())
 it('rejects unsupported goals',()=>expect(validPreferences({...fixture,goal:'sales'})).toBe(false))
 it('rejects unknown completed IDs',()=>expect(validPreferences({...fixture,completed:['unknown']})).toBe(false))
 it('rejects impossible prerequisite completion',()=>expect(validPreferences({...fixture,completed:['charts']})).toBe(false))
 it('rejects duplicate IDs',()=>expect(validPreferences({...fixture,completed:['foundations','foundations']})).toBe(false))
 it('rejects unexpected fields and unsupported durations',()=>{expect(validPreferences({...fixture,notes:'hello'})).toBe(false);expect(validPreferences({...fixture,maxMinutes:15})).toBe(false)})
 it('rejects invalid hidden and completed overlap',()=>{expect(parse(JSON.stringify({...fresh(),ready:true,hidden:['foundations'],preferences:{...fixture,completed:['foundations']}}))).toBeNull()})
 it('rejects noninteger revisions and unknown hidden IDs',()=>{expect(parse(JSON.stringify({...fresh(),revision:1.2}))).toBeNull();expect(parse(JSON.stringify({...fresh(),ready:true,hidden:['other']}))).toBeNull()})
 it('rejects contradictory cold start states',()=>expect(parse(JSON.stringify({...fresh(),hidden:['ethics']}))).toBeNull())
})
