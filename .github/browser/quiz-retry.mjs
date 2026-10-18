// CI-only, anonymous fixture attempts. Never clicks send-result or contact links.
import assert from 'node:assert/strict';
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
  'Only quiz/text shell is accepted offline; audio/photos/presenter and external services are not accepted by this suite.',
  'Media are not downloaded by the fixture server. Existing SW media requests receive 404, not fabricated replacements.',
  'First successful HTTP/HTTPS load and worker installation are required. No file:// SW claim.'
]};
assert.equal(report.checkout,head);
const names=execFileSync('git',['ls-tree','-r','--name-only',head],{encoding:'utf8'}).trim().split('\n');
const allowed=names.filter(path=>/^[\w-]+\.html$/.test(path)||path==='sw.js'||path==='manifest.webmanifest'||
  /^assets\/(?:js|css|content)\/[\w.-]+\.(?:js|css|json)$/.test(path)||['assets/primserv-logo.svg','assets/logo-citronex.svg','assets/primserv-icon-192.png'].includes(path));
const current={};
for(const file of allowed){const bytes=await readFile(file);assert.ok(bytes.equals(execFileSync('git',['show',`${head}:${file}`],{maxBuffer:4*1024*1024})),file);current[file]=bytes;report.files[file]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}
let serving=current;const requests=[],blocked=[];
const failedRequests=[];
const server=createServer((req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname.replace(/^\/citronex-siechnice-szkolenie\//,'')||'index.html';
  requests.push({path,method:req.method});
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  if(!allowed.includes(path)){res.writeHead(404).end();return;}
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'}[extname(path)];
  res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});res.end(serving[path]);
});
const listen=()=>new Promise(done=>server.listen(4175,'127.0.0.1',done));
const stop=async()=>{if(server.listening){server.closeAllConnections();await new Promise(done=>server.close(done));}};
await listen();
const url='http://127.0.0.1:4175/citronex-siechnice-szkolenie/',key='primserv:training-test:v1:/citronex-siechnice-szkolenie/:';
const cache='citronex-siechnice-modular-20261016-quiz-retry1';
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
  serving=Object.fromEntries(allowed.map(file=>[file,execFileSync('git',['show',`${base}:${file}`],{maxBuffer:4*1024*1024})]));
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
    const expectedScriptURL=new URL('assets/js/training-app.js?v=20261018-3d-language1',url).href;
    // Cache writes can still become observable after the controller lifecycle
    // check. Wait for the exact required entry; missing/wrong bytes still fail.
    await page.waitForFunction(async ({name,scriptURL})=>
      Boolean(await (await caches.open(name)).match(scriptURL)),
      {name:cache,scriptURL:expectedScriptURL});
    const cacheProbe=await page.evaluate(async ({name,scriptURL})=>{
      const installed=await caches.open(name);
      const keys=(await installed.keys()).map(request=>request.url);
      const response=await installed.match(scriptURL);
      return {keys,documentBase:document.baseURI,script:response?await response.text():null};
    },{name:cache,scriptURL:expectedScriptURL});
    report.upgradeProbe={cacheKeys:cacheProbe.keys,documentBase:cacheProbe.documentBase,expectedScriptURL,
      failedRequests,updateRequests:requests.filter(request=>request.path.includes('training-app')||request.path==='sw.js')};
    const cachedScript=cacheProbe.script;
    assert.ok(cachedScript,'new script must already be cached: '+JSON.stringify(report.upgradeProbe));
    assert.equal(createHash('sha256').update(cachedScript).digest('hex'),report.files['assets/js/training-app.js'].sha256);
    await page.reload();
    await page.waitForFunction(()=>document.querySelector('script[src*="training-app.js"]').src.includes('20261018-3d-language1'));
    await resume(page);assert.deepEqual((await stored(page)).answers,before.answers);assert.match(await page.locator('#testProgressText').innerText(),/2\/30/);
    await ctx.setOffline(true);await stop();await page.reload();await resume(page);await language(page,'ua');assert.match(await page.locator('#testProgressText').innerText(),/2\/30/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-fixture')),'keep');assert.equal(await page.evaluate(async()=>await (await (await caches.open('foreign-fixture')).match('./foreign-fixture')).text()),'keep');
    const entries=await page.evaluate(async name=>{const c=await caches.open(name),r=[];for(const req of await c.keys())r.push({url:req.url,bytes:(await (await c.match(req)).arrayBuffer()).byteLength});return r;},cache);
    await page.screenshot({path:join(output,'cache-upgrade-offline.png')});report.results.push({scenario:'base-worker upgrade / legacy progress / offline',status:'passed',cache:entries});
  }finally{serving=current;if(!server.listening)await listen();await page.screenshot({path:join(output,'cache-upgrade-last.png')}).catch(()=>{});await ctx.tracing.stop({path:join(output,'cache-upgrade-trace.zip')});await ctx.close();}
  assert.deepEqual(blocked,[]);assert.ok(requests.every(r=>['GET','HEAD'].includes(r.method)));
  report.requests={count:requests.length,servedPaths:[...new Set(requests.filter(r=>allowed.includes(r.path)).map(r=>r.path))],unservedMediaRequests:requests.filter(r=>!allowed.includes(r.path)).length};report.status='passed';
}catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}
finally{await browser?.close();await stop();await writeFile(join(output,'acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
