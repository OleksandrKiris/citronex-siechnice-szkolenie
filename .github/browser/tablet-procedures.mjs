import assert from 'node:assert/strict';
import {join} from 'node:path';
export async function auditTabletProcedures({page,width,lang,url,output,key,report,language}){
 const saved=await page.evaluate(key=>localStorage.getItem(key),key);
 await page.goto(url+`reader.html?lang=${lang}&topic=prepare`);await language(page,lang);
 const prepare=page.locator('.reader-panel');assert.equal(await prepare.locator('.reader-step').count(),4);
 await prepare.screenshot({path:join(output,`${width}-${lang}-prepare-complete.png`)});
 await page.goto(url+`tablet.html?lang=${lang}&mode=fixture`);await language(page,lang);
 const nav=page.locator('[data-tablet-procedures]');assert.equal(await nav.locator('a').count(),3);
 await nav.screenshot({path:join(output,`${width}-${lang}-tablet-navigation.png`)});
 const ids=['tablet-priva','tablet-work','tablet-workshop'];
 for(const id of ids){
  const link=nav.locator(`a[href="#${id}"]`),section=page.locator('#'+id);
  assert.equal((await link.innerText()).trim(),(await section.locator('h2,h3').first().innerText()).trim());
  await link.focus();await page.keyboard.press('Enter');await page.waitForURL(u=>u.hash==='#'+id);
  assert.equal(new URL(page.url()).searchParams.get('lang'),lang);assert.equal(new URL(page.url()).searchParams.get('mode'),'fixture');
  await page.waitForFunction(id=>{const r=document.getElementById(id).getBoundingClientRect();return r.top>=-1&&r.top<innerHeight;},id);
  assert.equal(await page.evaluate(()=>document.activeElement.id),id);
  await section.locator('h2,h3').first().screenshot({path:join(output,`${width}-${lang}-${id}-destination.png`)});
  await page.goBack();assert.equal(new URL(page.url()).hash,'');await language(page,lang);
  report.tabletNavigationRows.push({width,lang,id,passed:true});
 }
 // All thirteen actual details must open and display their complete localized
 // note. The same supplied images are measured in every language; eight unique
 // production photos are captured once in the narrow English context.
 const steps=page.locator('.tablet-step');assert.equal(await steps.count(),13);
 for(let i=0;i<13;i++){
  const step=steps.nth(i);await step.locator('summary').click();assert.equal(await step.getAttribute('open'),'');
  const note=step.locator('.tablet-step-body > p'),text=(await note.innerText()).trim();assert.ok(text&&!text.includes('undefined'));
  await note.scrollIntoViewIfNeeded();const g=await note.evaluate(el=>{const r=el.getBoundingClientRect(),root=document.documentElement;return {left:r.left,right:r.right,width:root.clientWidth,scroll:el.scrollWidth,client:el.clientWidth,rootScroll:root.scrollWidth};});
  assert.ok(g.left>=-1&&g.right<=g.width+1&&g.scroll<=g.client+1&&g.rootScroll<=g.width+1);
  const img=step.locator('img');assert.equal(await img.count(),1);await img.evaluate(el=>el.decode());assert.ok(await img.evaluate(el=>el.naturalWidth>0&&el.getBoundingClientRect().width>0));
  await note.screenshot({path:join(output,`${width}-${lang}-tablet-note-${i}.png`)});
  if(width===320&&lang==='en'&&i<8)await step.screenshot({path:join(output,`320-en-tablet-original-photo-${i}.png`)});
  report.tabletStepRows.push({width,lang,index:i,text,geometry:g,passed:true});
 }
 const pdfLang=['pl','en','ua'].includes(lang)?lang:'en';
 for(const kind of ['priva','workshop'])assert.equal(await page.locator(`a[href="assets/instructions/${kind}-${pdfLang}.pdf"]`).count(),1);
 const nextLang=lang==='en'?'ua':'en';await page.goto(url+`tablet.html?lang=${lang}&mode=fixture#tablet-workshop`);await language(page,lang);
 await page.locator('#langSelect').selectOption(nextLang);await language(page,nextLang);assert.equal(new URL(page.url()).hash,'#tablet-workshop');assert.equal(new URL(page.url()).searchParams.get('mode'),'fixture');
 await page.locator('#langSelect').selectOption(lang);await language(page,lang);assert.equal(new URL(page.url()).hash,'#tablet-workshop');
 await page.context().setOffline(true);
 try{
  await page.reload();await language(page,lang);
  for(const id of ids){await page.locator(`[data-tablet-procedures] a[href="#${id}"]`).focus();await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#'+id);assert.equal(await page.evaluate(()=>document.activeElement.id),id);}
 }finally{await page.context().setOffline(false);}
 assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),saved,'Material navigation must preserve completed quiz answers');
 report.results.push({scenario:'tablet procedure links / keyboard / Back / language / offline / original notes and photos',width,lang,status:'passed'});
}
