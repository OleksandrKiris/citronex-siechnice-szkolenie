import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const source = (await fs.readFile(process.env.THREE_D_SOURCE_FILE || new URL('assets/js/training-app.js',root),'utf8')).replace(/\r\n/g,'\n');
const data = await fs.readFile(new URL('assets/js/training-data.js',root),'utf8');
function render(requested,page,blocked=false){
 const location = new URL(`https://example.test/training/${page==='home'?'index':page}.html?lang=${requested}&mode=fixture&section=E1#instructions`);
 const app = {innerHTML:'',querySelector(){return null;}};
 const document={documentElement:{},currentScript:{src:'https://example.test/training-app.js?v=fixture'},body:{dataset:{page},insertAdjacentHTML(_position,html){this.header=html;}},getElementById(id){return id==='app'?app:{addEventListener(){}};}};
 const localStorage={getItem(){if(blocked)throw Error('Storage denied');return 'pl';},setItem(){if(blocked)throw Error('Storage denied');}};
 const window={}; const forbidden=()=>{throw Error('External effects forbidden in link rendering');};
 const context=vm.createContext({window,document,location,localStorage,URL,URLSearchParams,navigator:{language:'pl'},fetch:forbidden,open:forbidden});
 vm.runInContext(data,context);const before=JSON.stringify(window.CX_DATA);
 const instrumented=source.replace(/  renderPage\(\);\n  upgradeCache\(\);\n\}\)\(\);\s*$/, '  window.linkTest={renderHeader,renderHomeCompact,renderGreenhouseGuide};\n})();');
 assert.notEqual(instrumented,source,'Only replace startup; never execute operational UI/network/audio');
 vm.runInContext(instrumented,context);window.linkTest.renderHeader();
 window.linkTest[page==='home'?'renderHomeCompact':'renderGreenhouseGuide']();
 assert.equal(JSON.stringify(window.CX_DATA),before,'Source facts remain unchanged');
 const links=[...app.innerHTML.matchAll(/href="([^"]*citronex-szklarnia-3d[^\"]*)"/g)].map(m=>new URL(m[1]));
 assert.equal(links.length,1,'Exactly one real rendered3Dlink on each entry');
 assert.equal(location.searchParams.get('mode'),'fixture');assert.equal(location.hash,'#instructions');
 return {link:links[0],header:document.body.header,document};
}
const supported=['pl','en','ua','ru','az','es','fil','id','ne'];
for(const requested of [...supported,'uk','EN','ka','hy']) test(`${requested}: rendered home and greenhouse links match verified3Dlanguage contract`,()=>{
 const effective=requested==='uk'?'ua':supported.includes(requested.toLowerCase())?requested.toLowerCase():'en';
 for(const page of ['home','szklarnia']){
  const r=render(requested,page);
  assert.equal(r.link.origin,'https://oleksandrkiris.github.io');assert.equal(r.link.pathname,'/citronex-szklarnia-3d/');
  assert.equal(r.link.searchParams.get('lang'),effective);
  assert.deepEqual([...r.link.searchParams.keys()],['lang'],'No location/token/returnURL invented');
  assert.equal(r.link.hash,'');assert.equal(r.document.documentElement.lang,effective==='ua'?'uk':effective);
 }
});
test('denied storage cannot discard explicit English link context',()=>{
 for(const page of ['home','szklarnia'])assert.equal(render('en',page,true).link.searchParams.get('lang'),'en');
});
