import assert from 'node:assert/strict';
export const readerLanguages=['pl','en','ua','ru','az','es','fil','id','ne'];
export const readerSections={rows:[4,4,4,4,3],outside:[3,3,3,3]};
// These expected destinations follow the question meanings, not the renderer's
// destination map. Picking10 and restart12 remain covered by the earlier gate.
export const remainingReviewCases=[[4,'rows'],[5,'rows'],[6,'rows'],[7,'rows'],[8,'start'],[9,'start'],[11,'carts'],[25,'rows'],[26,'rows']];
export function assertRemainingReviews(rows){
 const key=r=>`${r.width}:${r.lang}:${r.question}:${r.topic}`;
 const expected=[320,1280].flatMap(width=>readerLanguages.flatMap(lang=>remainingReviewCases.map(([question,topic])=>key({width,lang,question,topic}))));
 assert.deepEqual(rows.map(key).sort(),expected.sort());assert.ok(rows.every(r=>r.passed===true));
}
export function assertReaderSection(row){
 assert.ok(readerLanguages.includes(row.lang));assert.ok([320,1280].includes(row.width));
 assert.equal(row.steps.length,readerSections[row.topic]?.[row.index]);assert.ok(row.steps.every(s=>typeof s==='string'&&s.trim()&&!s.includes('undefined')));
 assert.equal(row.passed,true);const g=row.geometry;assert.ok(g.clientWidth>0&&g.scrollWidth<=g.clientWidth+1);
 assert.ok(g.left>=-1&&g.right<=g.clientWidth+1&&g.right>g.left);
 assert.equal(g.cards.length,row.steps.length);
 for(const card of g.cards){assert.ok(card.visible&&card.width>0&&card.height>0);assert.ok(card.left>=g.left-1&&card.right<=g.right+1);assert.ok(card.textScrollWidth<=card.textClientWidth+1);assert.ok(card.textBottom<=card.bottom+1);}
}
export function assertReaderSections(rows){
 const key=r=>`${r.width}:${r.lang}:${r.topic}:${r.index}`;
 const expected=[320,1280].flatMap(width=>readerLanguages.flatMap(lang=>Object.entries(readerSections).flatMap(([topic,sections])=>sections.map((_,index)=>key({width,lang,topic,index})))));
 assert.deepEqual(rows.map(key).sort(),expected.sort());rows.forEach(assertReaderSection);
 for(const lang of readerLanguages)for(const [topic,sections]of Object.entries(readerSections))for(const index of sections.keys()){
  const pair=rows.filter(r=>r.lang===lang&&r.topic===topic&&r.index===index);assert.deepEqual(pair[0].steps,pair[1].steps,'Visible copy must agree across widths');
 }
}
