import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url);
const source = await fs.readFile(new URL("assets/js/training-app.js", root), "utf8");
const data = await fs.readFile(new URL("assets/js/training-data.js", root), "utf8");
const worker = await fs.readFile(new URL("sw.js", root), "utf8");

const instructionUpdate = await fs.readFile(new URL("assets/js/instruction-update.js", root), "utf8");
function readerHarness({lang="en", url="", blockedHistory=false, blockedStorage=false}={}) {
  const location = new URL(url || `https://example.test/training/reader.html?lang=${lang}&mode=fixture&from=qa#instructions`);
  let buttons = [];
  const document = { documentElement: {}, body: { dataset: { page: "reader" } }, currentScript: { src: "https://example.test/training-app.js?v=fixture" } };
  const app = { html: "", set innerHTML(value) {
    if (buttons.includes(document.activeElement)) document.activeElement = document.body;
    this.html = value;
    buttons = [...value.matchAll(/<button\b([^>]*\bdata-reader-tab="[^"]*"[^>]*)>/g)].map(([,attrs]) => {
      const attributes = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(([,key,value]) => [key,value]));
      return { attributes, dataset: { readerTab: attributes["data-reader-tab"] }, handlers: {},
        addEventListener(type, handler) { this.handlers[type] = handler; },
        focus(options) { document.activeElement = this; this.focusOptions = options; } };
    });
  }, get innerHTML() { return this.html; }, querySelectorAll(selector) { return selector === "[data-reader-tab]" ? buttons : []; } };
  document.getElementById = id => id === "app" ? app : null;
  const window = {};
  const historyCalls = [];
  const storage = { getItem() { if (blockedStorage) throw Error("Storage denied"); return ""; }, setItem() { if (blockedStorage) throw Error("Storage denied"); } };
  const forbidden = () => { throw Error("Network and operational actions forbidden"); };
  const context = vm.createContext({ window, document, location, URL, URLSearchParams, navigator: {language:lang}, localStorage:storage,
    history: { state: { preserve: true }, replaceState(state, title, url) {
      if (blockedHistory) throw Error("History denied");
      assert.equal(state.preserve, true);
      historyCalls.push(url.toString()); location.href = url.toString();
    } }, fetch: forbidden, open: forbidden });
  vm.runInContext(data, context);
  vm.runInContext(instructionUpdate, context);
  const original = JSON.stringify(window.CX_DATA);
  const instrumentedReader = source.replace(/  renderPage\(\);\n  upgradeCache\(\);\n\}\)\(\);\s*$/, "  window.readerTest = { renderReader, reloadWithLanguage };\n})();");
  assert.notEqual(instrumentedReader, source);
  vm.runInContext(instrumentedReader, context);
  window.readerTest.renderReader();
  return { location, document, app, historyCalls, api:window.readerTest, get buttons(){return buttons;},
    get selected(){return buttons.find(b => b.attributes["aria-pressed"] === "true");},
    click(id) { const b = buttons.find(b => b.dataset.readerTab === id); assert.ok(b); b.focus(); b.handlers.click(); assert.equal(JSON.stringify(window.CX_DATA), original); }
  };
}

for (const lang of ["pl","en","ua","ru","az","es","fil","id","ne"]) test(`${lang}: reader selection survives reload and language change with keyboard focus intact`, () => {
  const h = readerHarness({lang});
  for (const id of h.buttons.map(b => b.dataset.readerTab)) {
    h.click(id);
    assert.equal(h.selected.dataset.readerTab, id);
    assert.equal(h.document.activeElement, h.selected);
    assert.equal(h.selected.focusOptions.preventScroll, true);
    assert.equal(h.location.searchParams.get("topic"), id);
    assert.equal(h.location.searchParams.get("mode"), "fixture");
    assert.equal(h.location.searchParams.get("from"), "qa");
    assert.equal(h.location.hash, "#instructions");
    assert.equal(readerHarness({url:h.location.href}).selected.dataset.readerTab, id);
    assert.equal(h.buttons.filter(b => b.attributes["aria-pressed"] === "true").length, 1);
  }
  h.api.reloadWithLanguage(lang === "ua" ? "en" : "ua");
  assert.equal(readerHarness({url:h.location.href}).selected.dataset.readerTab, h.selected.dataset.readerTab);
  assert.equal(h.historyCalls.length, h.buttons.length, "Replace one entry per selection; do not add Back steps");
});
test("reader rejects unknown URL topics without injecting query values", () => {
  const h = readerHarness({url:"https://example.test/reader.html?lang=en&topic=%3Cscript%3Ebad-topic%3C/script%3E"});
  assert.equal(h.selected.dataset.readerTab, "prepare");
  assert.ok(!h.app.html.includes("bad-topic"));
});
test("reader controls and language context work when history and storage are denied", () => {
  const h = readerHarness({blockedHistory:true, blockedStorage:true});
  assert.doesNotThrow(() => h.click("carts"));
  assert.equal(h.document.activeElement, h.selected);
  h.api.reloadWithLanguage("ua");
  assert.equal(h.location.searchParams.get("topic"), "carts");
  assert.equal(readerHarness({url:h.location.href}).selected.dataset.readerTab, "carts");
});
test("reader focus stays on the next control when navigating sections with the keyboard", () => {
  const h = readerHarness();
  h.click("start");
  h.click("restart");
  h.click("rows");
  assert.equal(h.document.activeElement.dataset.readerTab, "rows");
  assert.equal(readerHarness({url:h.location.href}).selected.dataset.readerTab, "rows");
});

// These scenarios run real contact rendering/handlers, without opening contact links.
function contactHarness({lang="en", group="", blocked=false, blockedHistory=false, url=""}={}) {
  const location=new URL(url || `https://example.test/training/kontakty.html?lang=${lang}&mode=bogatynia&section=fixture${group?'&group='+encodeURIComponent(group):''}#contacts`);
  const decode=value=>value.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  let buttons=[];
  const document={documentElement:{},body:{dataset:{page:'kontakty'}},currentScript:{src:'https://example.test/training-app.js?v=fixture'}};
  const app={html:'',set innerHTML(value){
    if(buttons.includes(document.activeElement))document.activeElement=document.body;
    this.html=value;
    buttons=[...value.matchAll(/<button\b([^>]*\bdata-contact-group="[^"]*"[^>]*)>/g)].map(([,attrs])=>{
      const attributes=Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(([,k,v])=>[k,decode(v)]));
      return {attributes,dataset:{contactGroup:attributes['data-contact-group']},handlers:{},
        addEventListener(type,handler){this.handlers[type]=handler;},focus(){document.activeElement=this;}};
    });
  },get innerHTML(){return this.html;},querySelectorAll(){return buttons;}};
  document.getElementById=id=>id==='app'?app:null;
  const storage={getItem(){if(blocked)throw Error('Storage blocked');return '';},setItem(){if(blocked)throw Error('Storage blocked');}};
  const window={};
  const forbidden=()=>{throw Error('Contact/network actions forbidden');};
  const c=vm.createContext({window,document,location,URL,URLSearchParams,localStorage:storage,navigator:{language:'en'},
    history:{state:{keep:true},replaceState(state,_title,value){if(blockedHistory)throw Error('History blocked');assert.equal(state.keep,true);location.href=value.toString();}},fetch:forbidden,open:forbidden});
  vm.runInContext(data,c);
  const custom=new URL('assets/js/location-custom.js',root);
  return fs.readFile(custom,'utf8').catch(error=>{if(error.code!=='ENOENT')throw error;return '';}).then(customSource=>{
    if(customSource)vm.runInContext(customSource,c);
    const original=JSON.stringify(window.CX_DATA);
    const instrumentedContacts=source.replace(/  renderPage\(\);\n  upgradeCache\(\);\n\}\)\(\);\s*$/,'  window.contactsTest = { renderContacts, reloadWithLanguage };\n})();');
    assert.notEqual(instrumentedContacts,source);
    vm.runInContext(instrumentedContacts,c);
    window.contactsTest.renderContacts();
    return {location,document,app,api:window.contactsTest,get buttons(){return buttons;},
      get selected(){return buttons.find(button=>button.attributes.class.split(/\s+/).includes('active'));},
      click(id){const button=buttons.find(b=>b.dataset.contactGroup===id);assert.ok(button);button.focus();button.handlers.click();assert.equal(JSON.stringify(window.CX_DATA),original);}};
  });
}

for(const lang of ['pl','en','ua','ru','az','es','fil','id','ne'])test(`${lang}: contact selection survives language change and page return with focus intact`,async()=>{
  const h=await contactHarness({lang});
  const target=h.buttons.find(b=>b.dataset.contactGroup!=='coordinators').dataset.contactGroup;
  h.click(target);
  assert.equal(h.selected.dataset.contactGroup,target);
  assert.equal(h.document.activeElement,h.selected,'Focus must return to the new selected button');
  assert.equal(h.location.searchParams.get('group'),target);
  assert.equal(h.location.searchParams.get('section'),'fixture');
  assert.equal(h.location.searchParams.get('mode'),'bogatynia');
  assert.equal(h.location.hash,'#contacts');
  h.api.reloadWithLanguage(lang==='ua'?'en':'ua');
  const next=await contactHarness({url:h.location.href});
  assert.equal(next.selected.dataset.contactGroup,target);
  assert.equal(next.buttons.filter(b=>b.attributes['aria-pressed']==='true').length,1);
  assert.equal(next.selected.attributes['aria-pressed'],'true');
});
test('each real contact group supports a direct URL and selection state',async()=>{
  const h=await contactHarness();
  for(const b of h.buttons){const next=await contactHarness({group:b.dataset.contactGroup});assert.equal(next.selected.dataset.contactGroup,b.dataset.contactGroup);assert.equal(next.selected.attributes['aria-pressed'],'true');}
});
test('unknown contact group uses the existing default without inserting query content',async()=>{
  const h=await contactHarness({group:'<script>invalid-group</script>'});
  assert.equal(h.selected.dataset.contactGroup,'coordinators');
  assert.equal(h.app.html.includes('invalid-group'),false);
});
test('denied storage/history keep contact controls and language context usable',async()=>{
  const h=await contactHarness({blocked:true,blockedHistory:true});
  const target=h.buttons.find(b=>b.dataset.contactGroup!=='coordinators').dataset.contactGroup;
  assert.doesNotThrow(()=>h.click(target));
  assert.equal(h.document.activeElement,h.selected);
  h.api.reloadWithLanguage('ua');
  assert.equal(h.location.searchParams.get('group'),target);
  assert.equal((await contactHarness({url:h.location.href,blocked:true})).selected.dataset.contactGroup,target);
});

const instrumented = source.replace(/  renderPage\(\);\n  upgradeCache\(\);\n\}\)\(\);\s*$/, "  window.navigationTest = { renderHeader, reloadWithLanguage, href, recordingInstructionTopic, recordingUpdateCopy, renderRecordingUpdate };\n})();");
assert.notEqual(source, instrumented, "Only instrument startup; never execute operational UI, audio or network actions");
const langs = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];

function header(lang, page = "home", blockedStorage = false) {
  const location = new URL(`https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/${page === "home" ? "index" : page}.html?lang=${lang}&section=fixture#wanted`);
  const document = {
    documentElement: {}, currentScript: { src: `${location.origin}/assets/js/training-app.js?v=release` },
    body: { dataset: { page }, insertAdjacentHTML(_position, html) { this.html = html; } },
    getElementById: () => ({ addEventListener() {} })
  };
  const localStorage = {
    getItem() { if (blockedStorage) throw new Error("Storage blocked"); return "pl"; },
    setItem() { if (blockedStorage) throw new Error("Storage blocked"); }
  };
  const window = {};
  const context = vm.createContext({ window, document, location, localStorage, URL, URLSearchParams, navigator: { language: "pl", languages: ["pl"] } });
  vm.runInContext(data, context);
  const original = JSON.stringify(window.CX_DATA);
  vm.runInContext(instrumented, context);
  window.navigationTest.renderHeader();
  assert.equal(JSON.stringify(window.CX_DATA), original);
  return { window, document, location, html: document.body.html };
}

for (const lang of langs) test(`${lang}: header links on home, map and contacts use supported languages`, () => {
  for (const page of ["home", "mapa", "kontakty"]) {
    const c = header(lang, page);
    assert.ok(c.html.includes('alt="PrimServ"'));
    assert.ok(c.html.includes("PrimServ · HYDRA"));
    assert.ok(c.html.includes(`citronex-hydra-project/?lang=${lang}`));
    assert.ok(c.html.includes(`kiris-jobs/?lang=${lang === "ua" ? "uk" : lang}`));
    assert.ok(c.html.includes('href="https://www.primserv.pl/"'));
    assert.ok(c.html.includes('href="https://t.me/KirisWorkPoland_bot"'));
    assert.ok(c.html.includes(`kontakty.html?lang=${lang}`));
    for (const match of c.html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.ok(match[0].includes('rel="noopener noreferrer"'));
    assert.equal(c.document.documentElement.lang, lang === "ua" ? "uk" : lang);
    assert.equal(c.html.includes("English (EN)"), false);
  }
});

for (const alias of ["uk", "ka", "hy"]) test(`${alias}: explicit language beats saved Polish with truthful fallback`, () => {
  const c = header(alias);
  const actual = alias === "uk" ? "ua" : "en";
  assert.ok(c.html.includes(`citronex-hydra-project/?lang=${actual}`));
  assert.equal(c.html.includes("English (EN)"), alias !== "uk");
});

test("blocked storage does not prevent opening or changing language; query/hash survive", () => {
  const c = header("ua", "mapa", true);
  c.window.navigationTest.reloadWithLanguage("ru");
  const url = new URL(c.location.href);
  assert.equal(url.searchParams.get("lang"), "ru");
  assert.equal(url.searchParams.get("section"), "fixture");
  assert.equal(url.hash, "#wanted");
});

test("official logo and every production page use the new worker/UI entry", async () => {
  const logo = await fs.readFile(new URL("assets/primserv-logo.svg", root));
  assert.equal(crypto.createHash("sha256").update(logo).digest("hex"), "1a29802a4a0065ad84e8f8dbdd5bc46dcb9b67bbecb2190de6a99464feaf5157");
  for (const file of (await fs.readdir(root)).filter(p => p.endsWith(".html"))) {
    const html = await fs.readFile(new URL(file, root), "utf8");
    assert.ok(html.includes('href="assets/primserv-logo.svg"'), file);
    assert.match(html, /<title>[^<]*PrimServ<\/title>/, file);
    if (html.includes('data-standalone-tool=')) continue;
    assert.ok(html.includes('property="og:title"'), file);
    assert.ok(html.includes("assets/js/training-app.js?v=20261018-3d-language1"), file);
    assert.ok(html.includes("assets/css/primserv.css?v=20261016-progress1"), file);
    assert.match(html, /assets\/js\/training-data\.js\?v=[^\"\s]+/, file);
  }
  const css = await fs.readFile(new URL("assets/css/primserv.css", root), "utf8");
  assert.ok(css.includes("min-height: 44px"));
  assert.ok(css.includes(":focus-visible"));
});

function workerHarness() {
  const origin = "https://oleksandrkiris.github.io";
  const scope = `${origin}/citronex-siechnice-szkolenie/`;
  const handlers = {}, added = [], copied = [], deleted = [], lifecycle = [];
  const context = vm.createContext({
    self: { location: { origin }, addEventListener(name, handler) { handlers[name] = handler; }, skipWaiting() { lifecycle.push("skip"); }, clients: { claim() { lifecycle.push("claim"); } } },
    caches: {
      async open() { return { async add(request) { added.push(request.url); }, async put(request) { copied.push(request.url); } }; },
      async match(request) { return (request.url.includes("primserv") || request.url.includes("20261018-3d-language1") || request.url.includes("20261016-language1") || request.url.includes("20261016-recording1")) ? null : new Response("old valid asset"); },
      async keys() { return ["unrelated", "citronex-siechnice-modular-old", "citronex-siechnice-training-old", vm.runInContext("CACHE_NAME", context)]; },
      async delete(name) { deleted.push(name); }
    },
    Request: class extends Request { constructor(input, options) { super(new URL(input, scope), options); } },
    URL, Response,
    fetch() { throw new Error("Network must not run in tests"); }
  });
  vm.runInContext(worker, context);
  return { added, copied, deleted, lifecycle, async run(name) { let promise; handlers[name]({ waitUntil(value) { promise = value; } }); await promise; } };
}

test("worker migrates exact unchanged cached media but refreshes documents and changed assets", async () => {
  const w = workerHarness();
  await w.run("install");
  assert.ok(w.copied.some(url => url.includes("/assets/audio/guide/ua/01-welcome.mp3?v=20260720-siechnice-master41")));
  assert.ok(w.copied.some(url => url.endsWith("/assets/css/training.css?v=20260720-siechnice-master41")));
  assert.ok(w.added.some(url => url.endsWith("/index.html")));
  assert.ok(w.added.some(url => url.endsWith("/manifest.webmanifest")));
  assert.ok(w.added.some(url => url.endsWith("/assets/js/training-app.js?v=20261018-3d-language1")));
  assert.ok(w.added.some(url => url.endsWith("/assets/js/instruction-update.js?v=20261016-language1")));
  assert.ok(w.added.some(url => url.endsWith("/assets/primserv-logo.svg")));
  assert.equal(w.added.some(url => url.includes(".mp3")), false);
  assert.ok(w.lifecycle.includes("skip"));
});

test("activation clears only old location caches", async () => {
  const w = workerHarness();
  await w.run("activate");
  assert.deepEqual(w.deleted, ["citronex-siechnice-modular-old", "citronex-siechnice-training-old"]);
  assert.ok(w.lifecycle.includes("claim"));
});

function timeoutHarness({ network = async () => new Response("fresh"), cached = () => undefined } = {}) {
  const handlers = {}, timers = [], cleared = [], calls = [], writes = [];
  const origin = "https://oleksandrkiris.github.io";
  const cache = {
    async match(request) { return cached(request); },
    async put(request, response) { writes.push({ request, body: await response.text() }); }
  };
  vm.runInNewContext(worker, {
    self: { location: { origin }, addEventListener(name, handler) { handlers[name] = handler; } },
    URL, Response, caches: { async open() { return cache; }, async match(request) { return cached(request); } },
    fetch(request, options) { calls.push({ request, options }); return network(request); },
    setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; },
    clearTimeout(id) { cleared.push(id); }
  });
  return { timers, cleared, calls, writes,
    request({ path = "assets/new.png", destination = "image", html = false, range = false, method = "GET" } = {}) {
      const request = { url: new URL(path, `${origin}/citronex-siechnice-szkolenie/`).href, method, destination,
        mode: html ? "navigate" : "cors", headers: new Headers({ accept: html ? "text/html" : "*/*", ...(range ? { range: "bytes=0-1023" } : {}) }) };
      let result; handlers.fetch({ request, respondWith(value) { result = value; } }); return result;
    }
  };
}
const timedRoutes = [
  { label: "navigation", request: { html: true }, ms: 6000, cache: "no-store" },
  { label: "versioned script", request: { path: "assets/js/training-app.js?v=fixture", destination: "script" }, ms: 3500, cache: "reload" },
  { label: "instruction JSON", request: { path: "assets/content/presenter-guide.json", destination: "" }, ms: 4000, cache: "no-store" },
  { label: "uncached image", request: {}, ms: 1400, cache: undefined }
];
for (const route of timedRoutes) {
  for (const status of [200, 404, 503]) test(`${route.label}: HTTP ${status} releases its unused timer`, async () => {
    const h = timeoutHarness({ network: async () => new Response("result", { status }) });
    assert.equal((await h.request(route.request)).status, status);
    assert.deepEqual(h.timers.map(timer => timer.delay), [route.ms]);
    assert.deepEqual(h.cleared, [1]);
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].options?.cache, route.cache);
    assert.equal(h.calls[0].options?.signal, undefined, "Do not introduce request cancellation");
    assert.equal(h.writes.length, status === 200 ? 1 : 0);
  });
  test(`${route.label}: network rejection releases the timer and preserves error fallback`, async () => {
    const h = timeoutHarness({ network: async () => { throw Error("offline"); } });
    assert.equal((await h.request(route.request)).type, "error");
    assert.deepEqual(h.cleared, [1]); assert.equal(h.writes.length, 0);
  });
  test(`${route.label}: timeout retains fallback and late-response policy`, async () => {
    let complete, expired = false;
    const h = timeoutHarness({ network: () => new Promise(resolve => { complete = resolve; }),
      cached: () => expired ? new Response("appeared while waiting") : undefined });
    const result = h.request(route.request); await new Promise(setImmediate);
    assert.equal(h.timers[0].delay, route.ms); expired = true; h.timers[0].callback();
    assert.equal(await (await result).text(), "appeared while waiting"); assert.deepEqual(h.cleared, [1]);
    complete(new Response("late")); await new Promise(setImmediate);
    assert.equal(h.calls.length, 1); assert.equal(h.writes.length, 0);
  });
}
test("concurrent request timers remain independent", async () => {
  const pending = [], h = timeoutHarness({ network: () => new Promise(resolve => pending.push(resolve)) });
  const first = h.request({ html: true }), second = h.request(); await new Promise(setImmediate);
  pending[0](new Response("first")); assert.equal(await (await first).text(), "first"); assert.deepEqual(h.cleared, [1]);
  h.timers[1].callback(); assert.equal((await second).type, "error"); assert.deepEqual(h.cleared, [1, 2]);
  pending[1](new Response("late")); await new Promise(setImmediate); assert.equal(h.writes.length, 1);
});
test("byte-range audio remains a direct 206 response without timers or cache writes", async () => {
  const h = timeoutHarness({ network: async () => new Response("partial", { status: 206 }) });
  assert.equal((await h.request({ path: "assets/audio/guide/ua/01-welcome.mp3", range: true })).status, 206);
  assert.equal(h.calls.length, 1); assert.equal(h.timers.length, 0); assert.equal(h.writes.length, 0);
});
test("cached images still return immediately and refresh without a timeout", async () => {
  const h = timeoutHarness({ cached: () => new Response("cached") });
  assert.equal(await (await h.request()).text(), "cached"); await new Promise(setImmediate);
  assert.equal(h.timers.length, 0); assert.equal(h.calls.length, 1); assert.equal(h.writes[0].body, "fresh");
});
test("only navigation may receive the HTML shell; unrelated requests stay outside the worker", async () => {
  for (const html of [true, false]) {
    const h = timeoutHarness({ network: async () => { throw Error("offline"); }, cached: request => request === "./index.html" ? new Response("shell") : undefined });
    const response = await h.request({ html }); assert.equal(html ? await response.text() : response.type, html ? "shell" : "error");
    assert.equal(h.request({ method: "POST" }), undefined);
    assert.equal(h.request({ path: "https://www.primserv.pl/" }), undefined);
    assert.equal(h.calls.length, 1);
  }
});

const speechSource = source.replace(/  renderPage\(\);\n  upgradeCache\(\);\n\}\)\(\);\s*$/, "  window.speechTest = { renderSpeech };\n})();");
assert.notEqual(source, speechSource);
const decodeAttribute = value => value.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function speechHarness(lang) {
  const groups = [];
  const search = { value: "", addEventListener(_type, handler) { this.input = handler; } };
  const empty = { hidden: true };
  const status = {};
  const app = {
    addEventListener() {},
    set innerHTML(html) {
      this.html = html;
      for (const match of html.matchAll(/<details class="[^"]*speech-group"([^>]*)data-group-id="([^"]+)"/g)) {
        const group = { dataset: { groupId: match[2] }, open: /\bopen\b/.test(match[1]), hidden: false, cards: [],
          addEventListener(_type, handler) { this.toggle = handler; },
          querySelector: () => list,
          querySelectorAll: () => group.cards
        };
        const list = { set innerHTML(value) {
          group.cards = [...value.matchAll(/data-key="([^"]*)"/g)].map(m => ({ dataset: { key: decodeAttribute(m[1]) }, hidden: false }));
        } };
        groups.push(group);
      }
    },
    querySelector(selector) { return ({ '#speechSearch': search, '.speech-empty': empty, '#speechStatus': status })[selector] || null; },
    querySelectorAll: () => groups
  };
  const document = { documentElement: {}, body: { dataset: { page: 'mowa' } }, getElementById: () => app,
    activeElement: search, currentScript: { src: 'https://example.invalid/training-app.js?v=fixture' } };
  const window = {};
  const location = new URL(`https://oleksandrkiris.github.io/citronex-siechnice-szkolenie/mowa.html?lang=${lang}`);
  const forbidden = () => { throw Error('Voice, clipboard, network and navigation actions forbidden'); };
  const context = vm.createContext({ window, document, location, URL, URLSearchParams,
    localStorage: { getItem: () => null }, navigator: { language: lang, clipboard: { writeText: forbidden } },
    fetch: forbidden, open: forbidden, setTimeout: forbidden });
  vm.runInContext(data, context);
  const originalData = JSON.stringify(window.CX_DATA);
  vm.runInContext(speechSource, context);
  window.speechTest.renderSpeech();
  assert.ok(groups.length > 1, 'Use real production phrase groups');
  return { groups, empty, search, app, document, phrases: window.CX_DATA.speechPhrases,
    input(value) { search.value = value; search.input(); assert.equal(document.activeElement, search); assert.equal(JSON.stringify(window.CX_DATA), originalData); },
    expand(group, open) { group.open = open; group.toggle(); }
  };
}

for (const lang of langs) {
  test(`${lang}: empty or whitespace search keeps all lazy phrase groups visible`, () => {
    const c = speechHarness(lang);
    const initial = c.groups.map(g => ({ open: g.open, rendered: g.dataset.rendered, count: g.cards.length }));
    for (const query of ['', ' ', '\t \n']) {
      c.input(query);
      assert.ok(c.groups.every(g => !g.hidden));
      assert.deepEqual(c.groups.map(g => ({ open: g.open, rendered: g.dataset.rendered, count: g.cards.length })), initial);
      assert.equal(c.empty.hidden, true);
    }
    c.expand(c.groups[1], true);
    assert.ok(c.groups[1].cards.length > 0, 'Lazy opening still renders phrases');
  });

  test(`${lang}: clearing no-results restores all phrases and the pre-search expanded groups`, () => {
    const c = speechHarness(lang);
    c.expand(c.groups[0], false);
    c.expand(c.groups[1], true);
    const original = c.groups.map(g => g.open);
    c.input('___no_phrase_matches_this___');
    assert.ok(c.groups.every(g => g.hidden));
    assert.equal(c.empty.hidden, false);
    c.input('  ');
    assert.ok(c.groups.every(g => !g.hidden && g.cards.every(card => !card.hidden)));
    assert.deepEqual(c.groups.map(g => g.open), original);
    assert.equal(c.empty.hidden, true);
  });
}

test('Polish and translated phrase matches still filter correctly across consecutive searches', () => {
  const c = speechHarness('ua');
  const phrase = c.phrases.find(p => p.say && p.label.ua);
  const original = c.groups.map(g => g.open);
  for (const query of [phrase.say, phrase.label.ua]) {
    c.input(query.toUpperCase());
    const visible = c.groups.flatMap(g => g.hidden ? [] : g.cards.filter(card => !card.hidden));
    assert.ok(visible.length > 0);
    assert.ok(visible.every(card => card.dataset.key.includes(query.toLowerCase())));
    assert.equal(c.empty.hidden, true);
  }
  c.input('');
  assert.deepEqual(c.groups.map(g => g.open), original);
});

test('a second search remembers the newly chosen group state, not the first snapshot', () => {
  const c = speechHarness('en');
  c.input('___no_match___');
  c.input('');
  c.expand(c.groups[0], false);
  c.expand(c.groups.at(-1), true);
  const selected = c.groups.map(g => g.open);
  c.input(c.phrases[0].say);
  c.input('');
  assert.deepEqual(c.groups.map(g => g.open), selected);
  assert.ok(c.groups.every(g => !g.hidden));
});

const expectedLanguageLabels = ['Język','Language','Мова','Язык','Dil','Idioma','Wika','Bahasa','भाषा'];
const expectedReturnLabels = ['Wszystkie sekcje','All sections','Усі розділи','Все разделы','Bütün bölmələr','Todas las secciones','Lahat ng seksyon','Semua bagian','सबै खण्डहरू'];
langs.forEach((lang,index) => test(`${lang}: language picker and return control use the same clear training labels`, () => {
  const h=header(lang,'reader');
  assert.ok(h.html.includes('id="langSelect" aria-label="'+expectedLanguageLabels[index]+'"'));
  assert.ok(h.html.includes(expectedReturnLabels[index]));
  assert.match(h.html,/<option value="id"[^>]*>Bahasa Indonesia<\/option>/);
}));

const updatedRecordingTopics = {
  'reader-personal-tag': 'start', 'reader-break-end': 'rows',
  'reader-work-end': 'outside', 'reader-break': 'rows',
  'reader-restart-buttons': 'restart', 'reader-restart-menu': 'restart'
};
for (const language of langs) test(`${language}: earlier recordings are labelled and point to the current matching procedure`, () => {
  const {window} = header(language, 'pomocnik');
  const helpers = window.navigationTest;
  const copy = helpers.recordingUpdateCopy();
  assert.ok(copy.notice.length > 50 && copy.open && copy.play);
  assert.ok(!copy.notice.includes('[English]'));
  if (language !== 'en') assert.ok(!copy.notice.startsWith('This earlier'));
  for (const [id, topic] of Object.entries(updatedRecordingTopics)) {
    assert.equal(helpers.recordingInstructionTopic({id}), topic);
    const html = helpers.renderRecordingUpdate({id});
    assert.ok(html.includes(`reader.html?lang=${language}&amp;topic=${topic}`));
    assert.ok(html.includes(copy.notice));
  }
  for (const id of ['welcome', 'tablet-login', 'reader-row-exit']) {
    assert.equal(helpers.recordingInstructionTopic({id}), '');
    assert.equal(helpers.renderRecordingUpdate({id}), '');
  }
});

test('automatic chapter changes pause outdated recordings, clear stale playback intent and show the update; other chapters still play', () => {
  const body = source.slice(source.indexOf('    const activateChapter = '), source.indexOf('    const activateFreshChapter = '));
  assert.ok(body.includes('const activateChapter ='));
  const helpers = header('en', 'pomocnik').window.navigationTest;
  for (const id of [...Object.keys(updatedRecordingTopics), 'welcome']) {
    let plays = 0;
    const node = () => ({textContent:'',value:'',hidden:true,innerHTML:''});
    const c = vm.createContext({
      window: {clearTimeout(){}}, Math, Number, String, navigator: {onLine:true},
      autoAdvanceTimer:0, audioRetryTimer:0, audioRetryCount:0, chapterIndex:0,
      chapters:[{id,title:id}], hasPlaybackIntent:true, instructionUpdate:node(),
      loadToken:0, currentLipCueIndex:0, presenterReady:true,
      recording:{dataset:{},getAttribute:()=>'',pause(){},load(){}},
      chapterTitle:node(),groupLabel:node(),currentLabel:node(),totalLabel:node(),
      timeLabel:node(),durationLabel:node(),seek:node(),
      recordingInstructionTopic:helpers.recordingInstructionTopic,renderRecordingUpdate:helpers.renderRecordingUpdate,
      hideQuiz(){},closeHelpOverlay(){},showStaticPortrait(){},updateVoiceState(){},
      chapterAudioUrl:()=> 'unchanged.mp3',closePhotoOverlay(){},prepareChapterText(){},
      updateContextLink(){},updateMediaSession(){},updateChapterButtons(){},updateProgress(){},
      prefetchChapterVisuals(){},prepareVideo(){},setPlaying(){},requestPlayback(){plays++;}
    });
    vm.runInContext(body + '\nactivateChapter(0, true);',c);
    const updated = Boolean(updatedRecordingTopics[id]);
    assert.equal(plays, updated ? 0 : 1, id);
    assert.equal(c.instructionUpdate.hidden, !updated, id);
    if (updated) assert.equal(c.hasPlaybackIntent,false,id);
  }
});

function fullscreenFixture(languageIndex = 0) {
  const handlers = {}, controls = [], copies = [];
  let modal;
  const document = {activeElement: null, addEventListener(type, handler) {handlers[type] = handler;}};
  function element() {
    const classes = new Set(), attributes = {}, listeners = {};
    return {
      dataset: {}, isConnected: true, attributes, listeners,
      classList: {add(v) {classes.add(v);}, remove(v) {classes.delete(v);}, contains(v) {return classes.has(v);}},
      setAttribute(name, value) {attributes[name] = value;}, removeAttribute(name) {delete attributes[name];},
      addEventListener(type, handler) {listeners[type] = handler;},
      focus() {document.activeElement = this;}, getClientRects() {return [{}];},
      closest() {return null;}, appendChild() {}, remove() {}
    };
  }
  const close = element(), inside = element(), hidden = element(), content = element();
  hidden.getClientRects = () => [];
  controls.push(close, inside, hidden);
  const schema = element();
  const step = {querySelector: () => schema, cloneNode() {
    const copySchema = element();
    ['role','tabindex','aria-label','title'].forEach(name => copySchema.setAttribute(name, 'copied'));
    copies.push(copySchema);
    return {querySelectorAll(selector) {return selector === '.schema[role="button"]' ? [copySchema] : [];}};
  }};
  document.body = element();
  document.querySelectorAll = () => [step];
  document.querySelector = () => null;
  document.createElement = tag => {
    if (tag !== 'div') return element();
    modal = element();
    modal.querySelector = selector => selector === '.orientation-modal-close' ? close : content;
    modal.querySelectorAll = () => controls;
    modal.contains = node => controls.includes(node);
    return modal;
  };
  const start = source.indexOf('  function setupGreenhouseFullscreen()');
  const end = source.indexOf('  function readerTabButton', start);
  assert.ok(start >= 0 && end > start);
  const context = vm.createContext({document, text: v => v, tx: (...values) => values[languageIndex], esc: v => v, setupGreenhouseNavePicker() {}});
  vm.runInContext(source.slice(start, end) + '\nsetupGreenhouseFullscreen();', context);
  function event(key, target = schema, shiftKey = false) {
    return {key, target, shiftKey, prevented: false, preventDefault() {this.prevented = true;}};
  }
  function key(value, shiftKey = false) {
    const e = event(value, document.activeElement, shiftKey);handlers.keydown(e);return e;
  }
  return {document, modal, schema, close, inside, copies, controls, key,
    open(method = 'click') {
      const e = event(method === 'click' ? '' : method);
      schema.listeners[method === 'click' ? 'click' : 'keydown'](e);
      return e;
    }};
}

langs.forEach((lang, index) => test(`${lang}: full-screen diagram has a localized name and returns to its originating diagram`, () => {
  for (const method of ['click','Enter',' ']) {
    const f = fullscreenFixture(index);
    const e = f.open(method);
    assert.equal(f.modal.classList.contains('is-open'), true);
    assert.equal(f.document.activeElement, f.close);
    assert.equal(f.modal.attributes['aria-label'], f.schema.attributes['aria-label']);
    assert.ok(f.modal.attributes['aria-label']);
    assert.deepEqual(Object.keys(f.copies[0].attributes), []);
    if (method !== 'click') assert.equal(e.prevented, true);
    f.close.listeners.click();
    assert.equal(f.document.activeElement, f.schema);
    assert.equal(f.modal.attributes['aria-hidden'], 'true');
  }
}));
test('diagram Tab stays within visible controls in both directions and recovers escaped focus', () => {
  const f = fullscreenFixture();f.open();
  assert.equal(f.key('Tab', true).prevented, true);
  assert.equal(f.document.activeElement, f.inside);
  assert.equal(f.key('Tab').prevented, true);
  assert.equal(f.document.activeElement, f.close);
  assert.equal(f.key('Tab').prevented, false, 'normal navigation between controls is left to the browser');
  f.document.activeElement = f.schema;
  assert.equal(f.key('Tab').prevented, true);
  assert.equal(f.document.activeElement, f.close);
  f.document.activeElement = f.schema;
  f.key('Tab', true);assert.equal(f.document.activeElement, f.inside);
});
test('Escape and backdrop close restore focus; closed dialog does not capture page keyboard events', () => {
  const f = fullscreenFixture();f.open();
  assert.equal(f.key('Escape').prevented, true);
  assert.equal(f.document.activeElement, f.schema);
  assert.equal(f.key('Tab').prevented, false);
  assert.equal(f.key('Escape').prevented, false);
  f.open();f.modal.listeners.click({target:f.inside});
  assert.equal(f.modal.classList.contains('is-open'), true);
  f.modal.listeners.click({target:f.modal});
  assert.equal(f.document.activeElement, f.schema);
  assert.equal(f.modal.classList.contains('is-open'), false);
});
test('single-control diagram wraps to Close and safely closes after its trigger is removed', () => {
  const f = fullscreenFixture();f.controls.splice(1);f.open();
  assert.equal(f.key('Tab').prevented, true);
  assert.equal(f.document.activeElement, f.close);
  assert.equal(f.key('Tab', true).prevented, true);
  f.schema.isConnected = false;
  assert.doesNotThrow(() => f.close.listeners.click());
  assert.equal(f.modal.classList.contains('is-open'), false);
});
