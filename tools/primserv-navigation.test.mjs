import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url);
const source = await fs.readFile(new URL("assets/js/training-app.js", root), "utf8");
const data = await fs.readFile(new URL("assets/js/training-data.js", root), "utf8");
const worker = await fs.readFile(new URL("sw.js", root), "utf8");
const instrumented = source.replace(/  renderPage\(\);\n  upgradeCache\(\);\n\}\)\(\);\s*$/, "  window.navigationTest = { renderHeader, reloadWithLanguage, href };\n})();");
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
    assert.ok(html.includes("assets/js/training-app.js?v=20261016-siechnice-primserv42"), file);
    assert.ok(html.includes("assets/css/primserv.css?v=20261016-siechnice-primserv42"), file);
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
      async match(request) { return request.url.includes("primserv") ? null : new Response("old valid asset"); },
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
  assert.ok(w.added.some(url => url.endsWith("/assets/js/training-app.js?v=20261016-siechnice-primserv42")));
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
