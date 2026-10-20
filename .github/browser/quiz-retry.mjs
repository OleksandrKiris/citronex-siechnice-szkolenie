// CI-only, anonymous fixture attempts. Never clicks send-result or contact links.
import assert from 'node:assert/strict';
import {auditTabletProcedures} from './tablet-procedures.mjs';
import {readerSections,remainingReviewCases,assertReaderSection,assertReaderSections,assertRemainingReviews} from './reader-procedures.mjs';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {resolve,join,extname} from 'node:path';
assert.equal(process.env.GITHUB_ACTIONS,'true','Use the authorized CI workflow');
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PACKAGE);
const output=resolve(process.env.BROWSER_REPORT),head=process.env.TESTED_HEAD,base=process.env.TESTED_BASE;
await mkdir(output,{recursive:true});
const report={head,base,checkout:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),files:{},results:[],limits:[
  '1280x900 and 320x900 Chromium viewports, not a physical phone or screen reader.',
  'Offline acceptance covers quiz/text shell and the selected reader images only; audio/presenter, all other photos and external services are not accepted.',
  'Fixture server serves exact checked-in reader/tablet images and nine supplied PDFs. Other media preload requests receive 404, not fabricated replacements.',
  'First successful HTTP/HTTPS load and worker installation are required. No file:// SW claim.'
]};
report.readerSectionRows=[];report.remainingReviewRows=[];report.tabletNavigationRows=[];report.tabletStepRows=[];report.tabletTitleRows=[];
assert.equal(report.checkout,head);
const names=execFileSync('git',['ls-tree','-r','--name-only',head],{encoding:'utf8'}).trim().split('\n');
const allowed=names.filter(path=>/^[\w-]+\.html$/.test(path)||path==='sw.js'||path==='manifest.webmanifest'||
  /^assets\/(?:js|css|content)\/[\w.-]+\.(?:js|css|json)$/.test(path)||['assets/primserv-logo.svg','assets/logo-citronex.svg','assets/primserv-icon-192.png'].includes(path)||
  /^assets\/inline\/(?:cart_pl|cart_ua|restart_1|restart_2|reader_start)\.jpg$/.test(path)||/^assets\/tablet\/[\w.-]+\.jpg$/.test(path)||/^assets\/instructions\/[\w.-]+\.pdf$/.test(path));
const current={};
for(const file of allowed){const bytes=await readFile(file);assert.ok(bytes.equals(execFileSync('git',['show',`${head}:${file}`],{maxBuffer:4*1024*1024})),file);current[file]=bytes;report.files[file]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}
let serving=current;const requests=[],blocked=[];
const loadRevision=revision=>{
  const existing=new Set(execFileSync('git',['ls-tree','-r','--name-only',revision],{encoding:'utf8'}).trim().split('\n'));
  return Object.fromEntries(allowed.filter(file=>existing.has(file)).map(file=>[file,execFileSync('git',['show',`${revision}:${file}`],{maxBuffer:4*1024*1024})]));
};
const failedRequests=[];
const server=createServer((req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname.replace(/^\/citronex-siechnice-szkolenie\//,'')||'index.html';
  requests.push({path,method:req.method,search:new URL(req.url,'http://localhost').search,phase:serving===current?'candidate':'base'});
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  if(!allowed.includes(path)||!Object.hasOwn(serving,path)){res.writeHead(404).end();return;}
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.webmanifest':'application/manifest+json'}[extname(path)];
  res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});res.end(serving[path]);
});
const listen=()=>new Promise(done=>server.listen(4175,'127.0.0.1',done));
const stop=async()=>{if(server.listening){server.closeAllConnections();await new Promise(done=>server.close(done));}};
await listen();
const url='http://127.0.0.1:4175/citronex-siechnice-szkolenie/',key='primserv:training-test:v1:/citronex-siechnice-szkolenie/:';
const cache='citronex-siechnice-modular-20261019-tablet-procedure-links1';
let browser;
const layout=async page=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
const language=async(page,lang)=>{await page.waitForFunction(lang=>document.documentElement.lang===(lang==='ua'?'uk':lang),lang);await layout(page);};
const activate=page=>page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
const firstLoad=async(page,lang)=>{
  await page.goto(url+'test.html?lang='+lang);
  // The app reloads once on its first controllerchange. Observe the completed
  // reload document rather than racing it with a second explicit navigation.
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller)
    && performance.getEntriesByType('navigation')[0]?.type==='reload');
  await language(page,lang);
};
const resume=async page=>{if(await page.locator('#testResume').count())await page.locator('#testResume').click();};
const stored=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const answer=async(page,value)=>{const radio=page.locator(`input[name="testAnswer"][value="${value?'1':'0'}"]`);await radio.focus();await page.keyboard.press('Space');assert.equal(await radio.isChecked(),true);assert.equal(await radio.evaluate(el=>el===document.activeElement),true);};
const press=async(page,id)=>{await page.locator('#'+id).focus();await page.keyboard.press('Enter');};
const finish=async(page,wrong=[2,17])=>{for(let i=0;i<30;i++){const correct=(await page.locator('.test-question').getAttribute('data-ok'))==='1';await answer(page,wrong.includes(i)?!correct:correct);await press(page,'testNext');}};
const photoGuide=async(page,width,lang,topic)=>{
  const currentSteps=await page.locator('.reader-panel .reader-step p').allTextContents();
  assert.ok(currentSteps.length>=5);
  const overlays=page.locator('.reader-image-translation');assert.equal(await overlays.count(),1,'One shared current guide, not one duplicate per photo');
  for(const overlay of await overlays.all())assert.deepEqual(await overlay.locator('li').allTextContents(),currentSteps,'Photo guidance must match current visible steps');
  assert.ok((await page.locator('[data-reader-source-note]').innerText()).trim());
  const guide=overlays.first();await guide.scrollIntoViewIfNeeded();
  const typography=await guide.evaluate(el=>({width:el.getBoundingClientRect().width,fontSize:parseFloat(getComputedStyle(el.querySelector('li')).fontSize)}));
  assert.ok(typography.width>=200,'Current guidance must use the readable full topic width');
  assert.ok(typography.fontSize>=14,'Current guidance must remain readable on a narrow screen');
  await guide.screenshot({path:join(output,`${width}-${lang}-${topic}-current-guidance.png`)});
  report.results.push({width,lang,topic,scenario:'current photo guidance equals visible steps',steps:currentSteps.length,status:'passed'});
};
try{
  browser=await chromium.launch({headless:true});report.browser=browser.version();
  const make=async(width,mode='normal')=>{
    const ctx=await browser.newContext({viewport:{width,height:900},locale:'en-GB',reducedMotion:'reduce'});
    ctx.on('requestfailed',request=>failedRequests.push({url:request.url(),failure:request.failure()?.errorText,worker:Boolean(request.serviceWorker())}));
    await ctx.route('**/*',route=>{const req=route.request();if(new URL(req.url()).origin===new URL(url).origin&&['GET','HEAD'].includes(req.method()))return route.continue();blocked.push({url:req.url(),method:req.method()});return route.abort();});
    await ctx.addInitScript(({mode,key})=>{
      if(mode==='denied')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Fixture denial','SecurityError');}});
      else if(mode==='corrupt'&&!sessionStorage.getItem('seeded')){localStorage.setItem(key,'{broken');sessionStorage.setItem('seeded','1');}
    },{mode,key});return ctx;
  };
  // Observe the old wrong destination using exact base files in a separate,
  // worker-free anonymous context; no employee origin or saved progress is used.
  const oldLearningBase='b071f20b32d5741318df8b95829bd385e2512da3';
  serving=loadRevision(oldLearningBase);
  const oldCtx=await browser.newContext({viewport:{width:320,height:900},serviceWorkers:'block'}),oldPage=await oldCtx.newPage();
  try{
    await oldPage.goto(url+'test.html?lang=en');await finish(oldPage,[10,12]);
    const oldLinks=await oldPage.locator('.test-review-item a').evaluateAll(links=>links.map(a=>a.href));
    assert.equal(oldLinks.length,2);assert.ok(oldLinks.every(href=>new URL(href).searchParams.get('topic')===null));
    for(const index of [0,1]){
      await oldPage.goto(oldLinks[index]);assert.equal(await oldPage.locator('[data-reader-tab="prepare"]').getAttribute('aria-pressed'),'true');
      await oldPage.screenshot({path:join(output,`old-${index===0?'carts':'restart'}-wrong-prepare.png`),fullPage:true});
    }
    report.results.push({scenario:'old pinned-base RED learning links',base:oldLearningBase,status:'expected regression reproduced',oldLinks});
  }finally{await oldCtx.close();serving=current;}
  const oldPhotoBase='63240cd7aef812a7a07d535d9d6e82c335dfff83';
  serving=loadRevision(oldPhotoBase);
  const photoOldCtx=await browser.newContext({viewport:{width:320,height:900},serviceWorkers:'block'}),photoOldPage=await photoOldCtx.newPage();
  try{
    for(const topic of ['start','restart']){
      await photoOldPage.goto(url+`reader.html?lang=en&topic=${topic}`);await photoOldPage.locator('.media-details summary').click();
      const currentSteps=await photoOldPage.locator('.reader-panel .reader-step p').allTextContents();
      const overlay=photoOldPage.locator('.reader-image-translation').first();
      assert.notDeepEqual(await overlay.locator('li').allTextContents(),currentSteps);
      assert.equal(await photoOldPage.locator('[data-reader-source-note]').count(),0);
      await overlay.scrollIntoViewIfNeeded();await overlay.screenshot({path:join(output,`old-${topic}-abbreviated-guidance.png`)});
      report.results.push({scenario:'old photo guidance differs from current steps',base:oldPhotoBase,topic,status:'expected regression reproduced'});
    }
  }finally{await photoOldCtx.close();serving=current;}
  const oldRelatedBase='2faa9e0df06607c81267c5830ca9d65f5369cec6';
  serving=loadRevision(oldRelatedBase);
  const relatedOldCtx=await browser.newContext({viewport:{width:320,height:900},serviceWorkers:'block'}),relatedOldPage=await relatedOldCtx.newPage();
  try{
    for(const origin of ['prepare','rows']){
      await relatedOldPage.goto(url+`reader.html?lang=en&topic=${origin}`);
      assert.equal(await relatedOldPage.locator('[data-reader-related]').count(),0);
      report.results.push({scenario:'old reader has no contextual procedure links',base:oldRelatedBase,origin,status:'prior capability absence observed'});
    }
  }finally{await relatedOldCtx.close();serving=current;}
  serving=loadRevision(base);
  const tabletOldCtx=await browser.newContext({viewport:{width:320,height:900},serviceWorkers:'block'}),tabletOldPage=await tabletOldCtx.newPage();
  try{await tabletOldPage.goto(url+'tablet.html?lang=en');assert.equal(await tabletOldPage.locator('[data-tablet-procedures]').count(),0);assert.equal(await tabletOldPage.locator('.tablet-step').count(),13);await tabletOldPage.screenshot({path:join(output,'old-tablet-without-procedure-links.png')});report.results.push({scenario:'base tablet has no procedure links',base,status:'prior capability absence observed'});}
  finally{await tabletOldCtx.close();serving=current;}
  const oldTabletLayout='574a4fcc5f9f49ce36a3dae28e4b35125e9acc38';serving=loadRevision(oldTabletLayout);
  const oldLayoutCtx=await browser.newContext({viewport:{width:320,height:900},serviceWorkers:'block'}),oldLayoutPage=await oldLayoutCtx.newPage();
  try{await oldLayoutPage.goto(url+'tablet.html?lang=pl');const summary=oldLayoutPage.locator('.tablet-step summary').first();await summary.scrollIntoViewIfNeeded();const g=await summary.evaluate(el=>{const r=el.getBoundingClientRect(),t=el.querySelector('.tablet-step-title')||el.querySelector('span:nth-child(2)'),s=getComputedStyle(el,'::after');return {padding:parseFloat(getComputedStyle(el).paddingInlineEnd),right:t.getBoundingClientRect().right,iconLeft:r.right-parseFloat(s.right)-parseFloat(s.width),visibility:getComputedStyle(el.parentElement).contentVisibility};});assert.equal(g.padding,12);assert.ok(g.right>g.iconLeft);assert.equal(g.visibility,'auto');await summary.screenshot({path:join(output,'old-tablet-summary-overlaps-toggle.png')});report.results.push({scenario:'old tablet summary enters toggle area and uses deferred content painting',base:oldTabletLayout,geometry:g,status:'expected regression reproduced'});}
  finally{await oldLayoutCtx.close();serving=current;}
  for(const width of [1280,320]){
    const ctx=await make(width),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await ctx.tracing.start({screenshots:true,snapshots:true});
    try{
      await firstLoad(page,'en');
      for (const lang of ['pl','en','ua','ru','az','es','fil','id','ne']) {
        for (const entry of ['index.html','szklarnia.html']) {
          await page.goto(url+entry+'?lang='+lang);await language(page,lang);
          const links=page.locator('a[href*="citronex-szklarnia-3d/"]');
          assert.equal(await links.count(),1);
          assert.equal(await links.getAttribute('href'),'https://oleksandrkiris.github.io/citronex-szklarnia-3d/?lang='+lang);
        }
      }
      report.results.push({width,scenario:'3D language links from home and greenhouse',status:'passed',languages:9,entries:2});
      await page.goto(url+'test.html?lang=en');await finish(page);
      assert.match(await page.locator('#testResult h2').innerText(),/28\/30/);assert.equal(await page.locator('.test-review-item').count(),2);
      await page.locator('#testRetry').scrollIntoViewIfNeeded();await page.screenshot({path:join(output,`${width}-review.png`)});
      await press(page,'testRetry');assert.equal(await page.locator('#testQuestionTitle').evaluate(el=>el===document.activeElement),true);
      let state=await stored(page);assert.deepEqual(state.retryIndices,[2,17]);assert.equal(state.answers.filter(x=>x!==null).length,28);
      const correct=(await page.locator('.test-question').getAttribute('data-ok'))==='1';await answer(page,correct);await press(page,'testNext');
      assert.match(await page.locator('#testProgressText').innerText(),/18\/30/);
      await press(page,'testPrev');assert.match(await page.locator('#testProgressText').innerText(),/3\/30/);await press(page,'testNext');
      for(const lang of ['pl','ua','ru','az','es','fil','id','ne','en']){
        await page.locator('#langSelect').selectOption(lang);await language(page,lang);await resume(page);
        assert.match(await page.locator('#testProgressText').innerText(),/18\/30/);assert.match(await page.locator('.test-helper').innerText(),/2\/2/);
        assert.equal((await stored(page)).answers.filter(x=>x!==null).length,29);
      }
      await page.goto(url+'test.html?lang=ka');await language(page,'en');assert.match(await page.locator('.primserv-language-fallback').innerText(),/English/);await resume(page);
      await activate(page);await ctx.setOffline(true);await stop();const offlineStart=requests.length;
      await page.reload();await language(page,'en');await resume(page);assert.equal(await page.evaluate(()=>navigator.onLine),false);
      assert.match(await page.locator('#testProgressText').innerText(),/18\/30/);
      await answer(page,(await page.locator('.test-question').getAttribute('data-ok'))==='1');await press(page,'testNext');
      assert.match(await page.locator('#testResult h2').innerText(),/30\/30/);assert.equal(await page.locator('#testRetry').count(),0);
      await page.reload();await resume(page);assert.match(await page.locator('#testResult h2').innerText(),/30\/30/);
      assert.equal(requests.length,offlineStart,'offline server must receive no requests');
      await page.locator('#testResult').scrollIntoViewIfNeeded();await page.screenshot({path:join(output,`${width}-offline-perfect.png`)});
      await listen();await ctx.setOffline(false);
      // Existing same-origin learning link/Back, never an external contact or send button.
      await page.goto(url+'test.html?lang=en');await resume(page);await press(page,'testRestart');await finish(page,[2]);
      await page.locator('.test-review-item a').click();await page.waitForURL('**/szklarnia.html?lang=en');await page.goBack();await resume(page);
      assert.match(await page.locator('#testResult h2').innerText(),/29\/30/);
      await press(page,'testRetry');await answer(page,(await page.locator('.test-question').getAttribute('data-ok'))==='1');await press(page,'testNext');
      assert.match(await page.locator('#testResult h2').innerText(),/30\/30/);assert.deepEqual(errors,[]);
      report.results.push({width,status:'passed',steps:['30 actual UI answers / 2 errors','keyboard/focus','retry preserves 28 answers','9 languages / ka fallback','Back/Next','offline listener stopped + reload + persisted 30/30','learning link / Back','single remaining error']});
      for(const lang of ['pl','en','ua','ru','az','es','fil','id','ne']){
        await page.goto(url+'test.html?lang='+lang);await resume(page);await press(page,'testRestart');await finish(page,[10,12]);
        const before=await stored(page);await page.locator('#testResult').scrollIntoViewIfNeeded();
        await page.screenshot({path:join(output,`${width}-${lang}-learning-review.png`),fullPage:true});
        for(const [index,topic] of [[0,'carts'],[1,'restart']]){
          const link=page.locator('.test-review-item a').nth(index),target=new URL(await link.getAttribute('href'),url);
          assert.equal(target.searchParams.get('lang'),lang);assert.equal(target.searchParams.get('topic'),topic);
          await link.click();await language(page,lang);assert.equal(await page.locator(`[data-reader-tab="${topic}"]`).getAttribute('aria-pressed'),'true');
          await page.locator('.media-details summary').click();
          await page.waitForFunction(()=>[...document.querySelectorAll('.reader-visual img')].every(img=>img.complete&&img.naturalWidth>0));
          await photoGuide(page,width,lang,topic);
          // content-visibility can leave decoded off-screen photos blank in a
          // full-page capture. Inspect each original image in the viewport.
          const images=page.locator('.reader-visual img');
          for(let imageIndex=0;imageIndex<await images.count();imageIndex++){
            const image=images.nth(imageIndex);await image.scrollIntoViewIfNeeded();
            await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
            await image.screenshot({path:join(output,`${width}-${lang}-${topic}-image-${imageIndex}.png`)});
          }
          await layout(page);assert.deepEqual((await stored(page)).answers,before.answers);
          if(topic==='restart'){
            const pdf=page.locator('a[href*="assets/instructions/restart-"]'),documentLang=['pl','en','ua'].includes(lang)?lang:'en';
            assert.equal(await pdf.getAttribute('href'),`assets/instructions/restart-${documentLang}.pdf`);
          }
          await page.screenshot({path:join(output,`${width}-${lang}-${topic}-material.png`),fullPage:true});
          await page.locator('#langSelect').selectOption(lang==='en'?'ua':'en');
          await language(page,lang==='en'?'ua':'en');assert.equal(await page.locator(`[data-reader-tab="${topic}"]`).getAttribute('aria-pressed'),'true');
          await page.goBack();await page.goBack();await language(page,lang);await resume(page);
          assert.match(await page.locator('#testResult h2').innerText(),/28\/30/);assert.deepEqual((await stored(page)).answers,before.answers);
        }
        await press(page,'testRetry');
        for(const index of [10,12]){assert.equal((await stored(page)).current,index);await answer(page,true);await press(page,'testNext');}
        assert.match(await page.locator('#testResult h2').innerText(),/30\/30/);
        report.results.push({width,lang,status:'passed',scenario:'two exact-topic learning links, real original images, language/topic, Back preserves 28 answers, retry 30/30'});
        await page.goto(url+'reader.html?lang='+lang+'&topic=start');await language(page,lang);
        await page.locator('.media-details summary').click();await photoGuide(page,width,lang,'start');
        await layout(page);
        const savedBefore=await stored(page);
        for(const [origin,targets] of [['prepare',['restart']],['rows',['carts','outside']]]){
          for(const topic of targets){
            await page.goto(url+`reader.html?lang=${lang}&topic=${origin}&mode=fixture`);await language(page,lang);
            const link=page.locator(`[data-reader-related="${topic}"]`),target=new URL(await link.getAttribute('href'));
            assert.equal(target.searchParams.get('lang'),lang);assert.equal(target.searchParams.get('topic'),topic);assert.equal(target.searchParams.get('mode'),'fixture');
            const title=await page.locator(`[data-reader-tab="${topic}"]`).innerText();assert.equal(await link.innerText(),title);
            if(origin==='rows')assert.equal(await link.locator('..').locator('..').locator('h3').count(),1,'Link must be inside the relevant procedure section');
            // Focus and paint the actual control after scrolling. A deferred
            // off-screen ancestor can yield a blank parent-only screenshot.
            await link.focus();await link.scrollIntoViewIfNeeded();
            await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
            await link.screenshot({path:join(output,`${width}-${lang}-${origin}-to-${topic}-link.png`)});
            await page.keyboard.press('Enter');await page.waitForURL(target.href);await language(page,lang);
            assert.equal(await page.locator(`[data-reader-tab="${topic}"]`).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.reader-panel-head h2').innerText(),title);
            await page.locator('.reader-panel-head').screenshot({path:join(output,`${width}-${lang}-${origin}-to-${topic}-destination.png`)});
            assert.deepEqual((await stored(page)).answers,savedBefore.answers);
            await page.goBack();assert.equal(new URL(page.url()).searchParams.get('topic'),origin);assert.equal(new URL(page.url()).searchParams.get('mode'),'fixture');assert.equal(await page.locator(`[data-reader-tab="${origin}"]`).getAttribute('aria-pressed'),'true');
            const offlineRequests=requests.length;await ctx.setOffline(true);await stop();await page.reload();await language(page,lang);await page.locator(`[data-reader-related="${topic}"]`).click();await page.waitForURL(target.href);await language(page,lang);
            assert.equal(await page.locator(`[data-reader-tab="${topic}"]`).getAttribute('aria-pressed'),'true');assert.equal(requests.length,offlineRequests,'Related procedure must work with listener stopped');assert.deepEqual((await stored(page)).answers,savedBefore.answers);
            await listen();await ctx.setOffline(false);
            report.results.push({scenario:'contextual procedure link / keyboard / Back / stopped-server offline / progress unchanged',width,lang,origin,topic,status:'passed'});
          }
        }
        await page.goto(url+'test.html?lang='+lang);await resume(page);await press(page,'testRestart');await finish(page,remainingReviewCases.map(([i])=>i));
        const preserved=await stored(page);assert.match(await page.locator('#testResult h2').innerText(),/21\/30/);
        for(const [position,[question,topic]] of remainingReviewCases.entries()){
          const item=page.locator('.test-review-item').nth(position),link=item.locator('a'),target=new URL(await link.getAttribute('href'));
          assert.equal(target.searchParams.get('lang'),lang);assert.equal(target.searchParams.get('topic'),topic);
          await link.focus();await link.scrollIntoViewIfNeeded();await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
          await item.screenshot({path:join(output,`${width}-${lang}-question-${question}-review.png`)});
          await page.keyboard.press('Enter');await page.waitForURL(target.href);await language(page,lang);assert.equal(await page.locator(`[data-reader-tab="${topic}"]`).getAttribute('aria-pressed'),'true');
          await page.goBack();await resume(page);assert.match(await page.locator('#testResult h2').innerText(),/21\/30/);assert.deepEqual((await stored(page)).answers,preserved.answers);
          report.remainingReviewRows.push({width,lang,question,topic,passed:true});
        }
        await press(page,'testRetry');for(const [question]of remainingReviewCases){assert.equal((await stored(page)).current,question);await answer(page,(await page.locator('.test-question').getAttribute('data-ok'))==='1');await press(page,'testNext');}assert.match(await page.locator('#testResult h2').innerText(),/30\/30/);
        for(const [topic,sections]of Object.entries(readerSections)){
          await page.goto(url+`reader.html?lang=${lang}&topic=${topic}`);await language(page,lang);assert.equal(await page.locator('.reader-section').count(),sections.length);
          for(const index of sections.keys()){
            const section=page.locator('.reader-section').nth(index);await section.locator('h3').click();await section.scrollIntoViewIfNeeded();await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
            const steps=(await section.locator('.reader-step p').allTextContents()).map(s=>s.trim());
            const geometry=await section.evaluate(el=>{const root=document.documentElement,r=el.getBoundingClientRect();return {clientWidth:root.clientWidth,scrollWidth:root.scrollWidth,left:r.left,right:r.right,cards:[...el.querySelectorAll('.reader-step')].map(card=>{const r=card.getBoundingClientRect(),p=card.querySelector('p'),t=p.getBoundingClientRect(),s=getComputedStyle(p);return {visible:s.display!=='none'&&s.visibility==='visible'&&Number(s.opacity)>0,width:r.width,height:r.height,left:r.left,right:r.right,bottom:r.bottom,textBottom:t.bottom,textClientWidth:p.clientWidth,textScrollWidth:p.scrollWidth};})};});
            const row={width,lang,topic,index,steps,geometry,passed:true};assertReaderSection(row);await section.screenshot({path:join(output,`${width}-${lang}-${topic}-section-${index}.png`)});report.readerSectionRows.push(row);
          }
        }
      }
      for(const tabletLang of ['pl','en','ua','ru','az','es','fil','id','ne'])await auditTabletProcedures({page,width,lang:tabletLang,url,output,key,report,language});
      assert.deepEqual(errors,[]);
    }finally{if(!server.listening)await listen();await page.screenshot({path:join(output,`${width}-last.png`)}).catch(()=>{});await ctx.tracing.stop({path:join(output,`${width}-trace.zip`)});await ctx.close();}
  }
  for(const mode of ['corrupt','denied']){
    const ctx=await make(320,mode),page=await ctx.newPage();
    try{await firstLoad(page,'en');await resume(page);
      if(mode==='corrupt')assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),'{broken','read must not overwrite old bytes');
      await finish(page,[2]);await press(page,'testRetry');await answer(page,(await page.locator('.test-question').getAttribute('data-ok'))==='1');await press(page,'testNext');
      assert.match(await page.locator('#testResult h2').innerText(),/30\/30/);await page.screenshot({path:join(output,`${mode}.png`)});
      report.results.push({mode,status:'passed',steps:['usable fresh attempt','retry in memory','corrupt bytes untouched on read']});
    }finally{await page.screenshot({path:join(output,`${mode}-last.png`)}).catch(()=>{});await ctx.close();}
  }
  // Actual previous worker and legacy v1 save, without a destructive migration.
  const workerUpgradeBase='2faa9e0df06607c81267c5830ca9d65f5369cec6';
  report.workerUpgradeSource={ref:workerUpgradeBase,reason:'Pinned previous photo-guidance worker; test-only heads share the event-base worker bytes and cannot generate a new controller.'};
  serving=loadRevision(workerUpgradeBase);
  const ctx=await make(320),page=await ctx.newPage();
  await ctx.tracing.start({screenshots:true,snapshots:true});
  try{
    await firstLoad(page,'ua');await answer(page,true);await press(page,'testNext');
    const before=await stored(page);assert.equal(before.retryIndices,undefined);
    await page.evaluate(async()=>{localStorage.setItem('unrelated-fixture','keep');await (await caches.open('foreign-fixture')).put('./foreign-fixture',new Response('keep'));});
    // Capture the old controller before updating. Cache creation/deletion can
    // precede clients.claim(), and the app intentionally reloads once per asset
    // version per session. An explicit user reload must load the accepted build.
    await page.evaluate(()=>{window.previousQuizController=navigator.serviceWorker.controller;});
    serving=current;await page.evaluate(async()=>await (await navigator.serviceWorker.getRegistration()).update());
    await page.waitForFunction(async name=>{
      const registration=await navigator.serviceWorker.getRegistration();
      const controller=navigator.serviceWorker.controller;
      const keys=await caches.keys();
      return controller && controller!==window.previousQuizController
        && controller===registration.active && controller.state==='activated'
        && keys.includes(name)&&!keys.some(k=>k.startsWith('citronex-siechnice-modular-')&&k!==name);
    },cache);
    const expectedScriptURL=new URL('assets/js/training-app.js?v=20261019-tablet-procedure-links1',url).href;
    // The app may reload on controllerchange. Read the exact cached bytes
    // directly; polling a separate readiness flag can race that document.
    let cacheProbe;
    const upgradeDeadline=Date.now()+30000;
    do {
      try {
        cacheProbe=await page.evaluate(async ({name,scriptURL})=>{
          const installed=await caches.open(name);
          const response=await installed.match(scriptURL);
          return {keys:(await installed.keys()).map(request=>request.url),documentBase:document.baseURI,script:response?await response.text():null};
        },{name:cache,scriptURL:expectedScriptURL});
      } catch(error) {
        if(!/Execution context was destroyed/.test(error.message))throw error;
      }
      if(cacheProbe?.script)break;
      await new Promise(resolve=>setTimeout(resolve,250));
    } while(Date.now()<upgradeDeadline);
    assert.ok(cacheProbe,'upgrade cache observation must resolve');
    report.upgradeProbe={cacheKeys:cacheProbe.keys,documentBase:cacheProbe.documentBase,expectedScriptURL,
      failedRequests,updateRequests:requests.filter(request=>request.path.includes('training-app')||request.path==='sw.js')};
    const cachedScript=cacheProbe.script;
    assert.ok(cachedScript,'new script must already be cached: '+JSON.stringify(report.upgradeProbe));
    assert.equal(createHash('sha256').update(cachedScript).digest('hex'),report.files['assets/js/training-app.js'].sha256);
    await page.reload();
    await page.waitForFunction(()=>document.querySelector('script[src*="training-app.js"]').src.includes('20261019-tablet-procedure-links1'));
    await resume(page);assert.deepEqual((await stored(page)).answers,before.answers);assert.match(await page.locator('#testProgressText').innerText(),/2\/30/);
    await ctx.setOffline(true);await stop();await page.reload();await resume(page);await language(page,'ua');assert.match(await page.locator('#testProgressText').innerText(),/2\/30/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-fixture')),'keep');assert.equal(await page.evaluate(async()=>await (await (await caches.open('foreign-fixture')).match('./foreign-fixture')).text()),'keep');
    const entries=await page.evaluate(async name=>{const c=await caches.open(name),r=[];for(const req of await c.keys())r.push({url:req.url,bytes:(await (await c.match(req)).arrayBuffer()).byteLength});return r;},cache);
    await page.screenshot({path:join(output,'cache-upgrade-offline.png')});report.results.push({scenario:'base-worker upgrade / legacy progress / offline',status:'passed',cache:entries});
  }finally{serving=current;if(!server.listening)await listen();await page.screenshot({path:join(output,'cache-upgrade-last.png')}).catch(()=>{});await ctx.tracing.stop({path:join(output,'cache-upgrade-trace.zip')});await ctx.close();}
  assertReaderSections(report.readerSectionRows);assertRemainingReviews(report.remainingReviewRows);
  assert.equal(report.tabletNavigationRows.length,54);assert.equal(new Set(report.tabletNavigationRows.map(r=>`${r.width}:${r.lang}:${r.id}`)).size,54);
  assert.equal(report.tabletStepRows.length,234);assert.equal(new Set(report.tabletStepRows.map(r=>`${r.width}:${r.lang}:${r.index}`)).size,234);
  assert.equal(report.tabletTitleRows.length,234);assert.equal(new Set(report.tabletTitleRows.map(r=>`${r.width}:${r.lang}:${r.index}`)).size,234);
  assert.deepEqual(blocked,[]);assert.ok(requests.every(r=>['GET','HEAD'].includes(r.method)));
  report.requests={count:requests.length,servedPaths:[...new Set(requests.filter(r=>allowed.includes(r.path)).map(r=>r.path))],unservedMediaRequests:requests.filter(r=>!allowed.includes(r.path)).length};report.status='passed';
}catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}
finally{await browser?.close();await stop();await writeFile(join(output,'acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
